import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';
import CustomIcon from '../components/CustomIcon';

const Detail = ({ navigation, route }) => {
  const [list, setList] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const types = useSelector((state) => state.types.types);

  useEffect(() => {
    getDetailList();
  }, []);

  const getDetailList = async () => {
    try {
      const { data } = await axios({
        url: '/api/bill/detail',
        params: route.params || {},
      });
      setList(data.list || []);
      setTotalExpense(data.totalExpense || 0);
      setTotalIncome(data.totalIncome || 0);
    } catch (error) {
      console.error('获取详情失败:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>账单详情</Text>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            支出：¥{totalExpense.toFixed(2)}
          </Text>
          <Text style={styles.summaryText}>
            收入：¥{totalIncome.toFixed(2)}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {list.map((item, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.amount}>
                ¥{item.amount}
              </Text>
            </View>
            <View style={styles.itemContent}>
              <View style={styles.itemLeft}>
                <CustomIcon
                  type={types.find(t => t.id === item.type_id)?.icon || 'icon-help'}
                  size={20}
                  color="#666"
                />
                <Text style={styles.typeName}>
                  {item.type_name}
                </Text>
              </View>
              <Text style={[
                styles.payType,
                { color: item.pay_type === 1 ? '#ff4757' : '#39be77' }
              ]}>
                {item.pay_type === 1 ? '支出' : '收入'}
              </Text>
            </View>
            {item.remark && (
              <Text style={styles.remark}>备注：{item.remark}</Text>
            )}
          </View>
        ))}
      </ScrollView>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  item: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeName: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  payType: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  remark: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

export default Detail;