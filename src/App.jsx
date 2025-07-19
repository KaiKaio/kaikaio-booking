import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from './store';
import axios from './utils/axios';
import { useDispatch } from 'react-redux';
import { setTypes } from './store/typesSlice';

// 导入页面组件
import Login from './container/Login';
import Home from './container/Home';
import Data from './container/Data';
import User from './container/User';
import Detail from './container/Detail';
import Account from './container/Account';
import About from './container/About';
import Books from './container/Books';
import UserInfo from './container/UserInfo';

// 导入自定义图标组件
import CustomIcon from './components/CustomIcon';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 底部标签导航器
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'icon-wj-zd';
          } else if (route.name === 'Data') {
            iconName = 'icon-tongji';
          } else if (route.name === 'User') {
            iconName = 'icon-wode';
          }
          return <CustomIcon type={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007fff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ title: '账单' }} />
      <Tab.Screen name="Data" component={Data} options={{ title: '统计' }} />
      <Tab.Screen name="User" component={User} options={{ title: '我的' }} />
    </Tab.Navigator>
  );
};

// 主应用组件
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 设置 axios 默认 headers
    axios.defaults.headers.common.Authorization = `Bearer ${
      global.token || ''
    }`;

    // 验证用户身份
    axios({ method: 'post', url: '/api/user/verify' }).then((res = {}) => {
      const { code = 401 } = res;
      if (code !== 200) {
        // 在 React Native 中，我们需要通过导航来处理登录跳转
        throw new Error('NOT 200 Verify Auth');
      }

      return axios({ url: '/api/type/list' });
    }).then((res) => {
      const { data: { list = [] } } = res;
      dispatch(setTypes(list));
    }).catch((err) => {
      console.error(err, 'Error App useEffect');
    });
  }, [dispatch]);

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Detail" component={Detail} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="Books" component={Books} />
      <Stack.Screen name="UserInfo" component={UserInfo} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
