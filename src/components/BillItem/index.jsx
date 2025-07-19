import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import CustomIcon from '../CustomIcon';
import { post, get } from '../../utils';

const BillItem = ({ bill, icons, onReload, navigation }) => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    const _income = bill.bills?.filter(i => i.pay_type == 2).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setIncome(_income);
    const _expense = bill.bills?.filter(i => i.pay_type == 1).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setExpense(_expense);
  }, [bill.bills]);

  const handleEditBillItem = async (item) => {
    try {
      const { data } = await get(`/api/bill/detail?id=${item.id}`);
      // 跳转到编辑页面
      navigation.navigate('EditBill', { detail: data });
    } catch (error) {
      console.error('获取账单详情失败:', error);
    }
  };

  const handleDeleteBillItem = (item) => {
    Alert.alert(
      '提示',
      '是否删除此账目',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: async () => {
            try {
              await post('/api/bill/delete', { id: item.id });
              Alert.alert('提示', '删除成功');
              onReload();
            } catch (error) {
              console.error('删除失败:', error);
              Alert.alert('错误', '删除失败');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.item}>
      <View style={styles.headerDate}>
        <Text style={styles.date}>{bill.date}</Text>
        <View style={styles.money}>
          <Text style={styles.moneyText}>
            支出：¥{expense.toFixed(2)}
          </Text>
          <Text style={styles.moneyText}>
            收入：¥{income.toFixed(2)}
          </Text>
        </View>
      </View>
      
      <ScrollView style={styles.billList}>
        {bill && bill.bills?.sort((a, b) => b.date - a.date).map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.billItem}
            onLongPress={() => {
              Alert.alert(
                '操作',
                '请选择操作',
                [
                  { text: '取消', style: 'cancel' },
                  { text: '编辑', onPress: () => handleEditBillItem(item) },
                  { text: '删除', onPress: () => handleDeleteBillItem(item), style: 'destructive' },
                ]
              );
            }}
          >
            <View style={styles.billContent}>
              <View style={styles.billLeft}>
                <CustomIcon
                  type={icons[item.type_id]}
                  size={20}
                  color="#666"
                />
                <Text style={styles.typeName}>{item.type_name}</Text>
              </View>
              <Text style={[
                styles.amount,
                { color: item.pay_type == 2 ? 'red' : '#39be77' }
              ]}>
                {`${item.pay_type == 1 ? '-' : '+'}${item.amount}`}
              </Text>
            </View>
            {item.remark && (
              <Text style={styles.remark}>| {item.remark}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  headerDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  money: {
    flexDirection: 'row',
    gap: 16,
  },
  moneyText: {
    fontSize: 14,
    color: '#666',
  },
  billList: {
    maxHeight: 300,
  },
  billItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  billContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeName: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  remark: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    marginLeft: 28,
  },
});

export default BillItem;

