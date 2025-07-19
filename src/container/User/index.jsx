import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import CustomIcon from '../components/CustomIcon';

const User = ({ navigation }) => {
  const handleLogout = () => {
    Alert.alert(
      '提示',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            global.token = null;
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      title: '账单详情',
      icon: 'icon-detail',
      onPress: () => navigation.navigate('Detail'),
    },
    {
      title: '账户管理',
      icon: 'icon-account',
      onPress: () => navigation.navigate('Account'),
    },
    {
      title: '关于我们',
      icon: 'icon-about',
      onPress: () => navigation.navigate('About'),
    },
    {
      title: '账本管理',
      icon: 'icon-books',
      onPress: () => navigation.navigate('Books'),
    },
    {
      title: '用户信息',
      icon: 'icon-userinfo',
      onPress: () => navigation.navigate('UserInfo'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <CustomIcon type="icon-user" size={40} color="#fff" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.username}>用户</Text>
            <Text style={styles.userDesc}>欢迎使用记账应用</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuLeft}>
              <CustomIcon type={item.icon} size={20} color="#666" />
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            <CustomIcon type="icon-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007fff',
    padding: 20,
    paddingTop: 40,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  logoutBtn: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutText: {
    fontSize: 16,
    color: '#ff4757',
    fontWeight: 'bold',
  },
});

export default User;