import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import axios from '../utils/axios';

const Login = ({ navigation }) => {
  const [type, setType] = useState('login'); // 登录注册类型
  const [username, setUsername] = useState(''); // 账号
  const [password, setPassword] = useState(''); // 密码
  const [imageLoaded, setImageLoaded] = useState(false);

  const onSubmit = async () => {
    if (!username) {
      Alert.alert('提示', '请输入账号');
      return;
    }
    if (!password) {
      Alert.alert('提示', '请输入密码');
      return;
    }

    try {
      if (type === 'login') {
        const { data } = await axios({
          url: '/api/user/login',
          method: 'POST',
          data: {
            username,
            password
          }
        });
        
        // 在 React Native 中，我们使用 global 来存储 token
        global.token = data.token;
        axios.defaults.headers['Authorization'] = data.token;

        // 登录成功后跳转到主页面
        navigation.replace('Main');
      } else {
        const { data } = await axios({
          url: '/api/user/register',
          method: 'POST',
          data: {
            username,
            password
          }
        });
        Alert.alert('提示', '注册成功');
        setType('login');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('错误', err.msg || '操作失败');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.auth}>
          <Image
            source={require('../assets/login-title-icon.webp')}
            style={[styles.loginTitleIcon, { opacity: imageLoaded ? 1 : 0 }]}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
          
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="请输入账号"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <TextInput
              style={styles.input}
              placeholder="请输入密码"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <TouchableOpacity style={styles.loginBtn} onPress={onSubmit}>
              <Text style={styles.loginBtnText}>
                {type === 'login' ? '登 录' : '注 册'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.switchBtn}
              onPress={() => setType(type === 'login' ? 'register' : 'login')}
            >
              <Text style={styles.switchBtnText}>
                {type === 'login' ? '没有账号？去注册' : '已有账号？去登录'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  auth: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loginTitleIcon: {
    width: 200,
    height: 200,
    marginBottom: 48,
    resizeMode: 'contain',
  },
  form: {
    width: '100%',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  loginBtn: {
    height: 48,
    backgroundColor: '#007fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchBtn: {
    alignItems: 'center',
  },
  switchBtnText: {
    color: '#007fff',
    fontSize: 14,
  },
});

export default Login;