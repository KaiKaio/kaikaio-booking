import axios from 'axios';
import { Alert } from 'react-native';

// 环境变量配置
const MODE = __DEV__ ? 'development' : 'production';

// axios 默认配置
axios.defaults.baseURL = MODE === 'development' ? 'http://localhost:3000' : 'http://47.99.134.126:7009';
axios.defaults.timeout = 10000;
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// 响应拦截器
axios.interceptors.response.use(
  (res) => {
    if (typeof res.data !== 'object') {
      Alert.alert('错误', '服务端异常！');
      return Promise.reject(res);
    }
    
    if (res.data.code !== 200) {
      if (res.data.msg) {
        Alert.alert('提示', res.data.msg);
      }

      if (res.data.code === 401) {
        Alert.alert('提示', '未登录，请登录后使用');
        // 在 React Native 中，导航跳转需要通过 navigation prop 处理
      }

      if (res.data.code === 413) {
        Alert.alert('提示', '图片不得超过 50kb');
      }

      return Promise.reject(res.data);
    }

    return res.data;
  },
  (err) => {
    if (err?.response?.status === 401) {
      Alert.alert('提示', '未登录，请登录后使用');
    }
    if (err?.code === 'ECONNABORTED') {
      Alert.alert('提示', '请求超时，请刷新重试');
    }
    return Promise.reject(err);
  }
);

export default axios;
