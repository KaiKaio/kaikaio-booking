import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';
import CustomIcon from '../components/CustomIcon';
import BillItem from '../components/BillItem';
import Empty from '../components/Empty';

const Home = ({ navigation }) => {
  const types = useSelector((state) => state.types.types);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [orderBy, setOrderBy] = useState('DESC');
  const [currentSelect, setCurrentSelect] = useState({});
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM'));
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [icons, setIcons] = useState({});

  useEffect(() => {
    getBillList();
  }, [page, currentSelect, currentTime, orderBy]);

  useEffect(() => {
    const iconsMap = {};
    if (!types?.length) {
      return;
    }
    types.forEach(item => {
      iconsMap[item.id] = item.icon;
    });
    setIcons(iconsMap);
  }, [types]);

  const getBillList = async () => {
    try {
      const { data } = await axios({
        url: '/api/bill/list',
        params: {
          start: dayjs(currentTime).startOf('month').format('YYYY-MM-DD') + ' 00:00:00',
          end: dayjs(currentTime).endOf('month').format('YYYY-MM-DD') + ' 23:59:59',
          type_id: currentSelect.id,
          page: page,
          orderBy,
          page_size: 999
        }
      });

      if (page === 1) {
        setList(data.list);
      } else {
        const concatList = [...list, ...data.list];
        const listMap = new Map();
        concatList.forEach((item) => {
          const localDateItem = listMap.get(item.date);
          if (localDateItem) {
            listMap.set(item.date, [...localDateItem, ...item.bills]);
          } else {
            listMap.set(item.date, item.bills);
          }
        });
        
        const distinctList = [];
        listMap.forEach((value, key) => {
          distinctList.push({
            date: key,
            bills: value
          });
        });
        setList(distinctList);
      }

      setTotalExpense(data.totalExpense.toFixed(2));
      setTotalIncome(data.totalIncome.toFixed(2));
      setTotalPage(data.totalPage);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('获取账单列表失败:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = () => {
    setRefreshing(true);
    if (page !== 1) {
      setPage(1);
    } else {
      getBillList();
    }
  };

  const loadData = () => {
    if (page < totalPage) {
      setLoading(true);
      setPage(page + 1);
    }
  };

  const handleChangeOrderBy = () => {
    setOrderBy(orderBy === 'DESC' ? 'ASC' : 'DESC');
    setPage(1);
  };

  const handleTypeSelect = () => {
    // 这里可以打开类型选择弹窗或跳转到类型选择页面
    Alert.alert('提示', '类型选择功能待实现');
  };

  const handleMonthSelect = () => {
    // 这里可以打开月份选择弹窗
    Alert.alert('提示', '月份选择功能待实现');
  };

  const handleAddBill = () => {
    // 跳转到添加账单页面
    navigation.navigate('AddBill');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dataWrap}>
          <Text style={styles.expense}>
            总支出：<Text style={styles.bold}>¥ {totalExpense}</Text>
          </Text>
          <Text style={styles.income}>
            总收入：<Text style={styles.bold}>¥ {totalIncome}</Text>
          </Text>
        </View>
        <View style={styles.typeWrap}>
          <TouchableOpacity style={styles.left} onPress={handleChangeOrderBy}>
            <Text style={styles.title}>{orderBy === 'DESC' ? '倒序' : '正序'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.left} onPress={handleTypeSelect}>
            <Text style={styles.title}>
              {currentSelect.name || '全部类型'} <CustomIcon type="icon-arrow-bottom" size={12} />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.right} onPress={handleMonthSelect}>
            <Text style={styles.time}>
              {currentTime}<CustomIcon type="icon-arrow-bottom" size={12} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.contentWrap}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
        }
        onScrollEndDrag={() => {
          if (page < totalPage) {
            loadData();
          }
        }}
      >
        {list.map((item, index) => (
          <BillItem
            key={item.date}
            bill={item}
            icons={icons}
            onReload={refreshData}
            navigation={navigation}
          />
        ))}
        {!list?.length && <Empty style={{ height: 400 }} />}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddBill}>
        <CustomIcon type="icon-add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  dataWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  expense: {
    fontSize: 14,
    color: '#666',
  },
  income: {
    fontSize: 14,
    color: '#666',
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  typeWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    color: '#333',
    marginRight: 4,
  },
  time: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  contentWrap: {
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default Home;