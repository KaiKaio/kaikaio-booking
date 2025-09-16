import React, { useState, useEffect } from 'react';
import { Button, Toast } from 'zarm';
import cx from 'classnames';
import LoginTitleIcon from '@/assets/login-title-icon.webp';
import axios from '@/utils/axios'
import { useNavigate } from "react-router-dom";

import s from './style.module.less';

const Login = () => {
  const navigateTo = useNavigate();
  const [type, setType] = useState('login'); // 登录注册类型
  const [username, setUsername] = useState(''); // 账号
  const [password, setPassword] = useState(''); // 密码
  const [imageLoaded, setImageLoaded] = useState(false);

  // 预加载登录图标
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      console.log('登录图标预加载完成');
    };
    img.onerror = (error) => {
      console.error('登录图标预加载失败:', error);
      setImageLoaded(true); // 即使失败也设置为已加载
    };
    img.src = LoginTitleIcon;
  }, []);
  
  const onSubmit = async () => {
    if (!username) {
      Toast.show('请输入账号')
      return
    }
    if (!password) {
      Toast.show('请输入密码')
      return
    }
    try {
      if (type == 'login') {
        const { data } = await axios({
          url: '/api/user/login',
          method: 'POST',
          data: {
            username,
            password
          }
        });
        localStorage.setItem('token', data.token);
        axios.defaults.headers['Authorization'] = data.token

        // 登录成功后直接跳转，不加载类型数据
        navigateTo('/', { replace: true })
      } else {
        const { data } = await axios({
          url: '/api/user/register',
          method: 'POST',
          data: {
            username,
            password
          }
        });
        Toast.show('注册成功');
         setType('login');
      }
    } catch (err) {
      console.error(err)
      Toast.show(err.msg);
    }
  };

  useEffect(() => {
    document.title = type == 'login' ? '登录' : '注册';
  }, [type])
  
  return <div className={s.auth}>
    {!imageLoaded && (
      <div className={s.imagePlaceholder}>
        <div className={s.loadingSpinner}></div>
      </div>
    )}
    <img 
      className={cx(s.loginTitleIcon, { [s.hidden]: !imageLoaded })} 
      src={LoginTitleIcon} 
      alt="LoginTitleIcon" 
      loading="eager"
      fetchPriority="high"
      onLoad={() => setImageLoaded(true)}
      onError={(e) => {
        console.error('登录图标加载失败:', e);
        setImageLoaded(true); // 即使失败也设置为已加载
        // 可以设置一个备用图片
        // e.target.src = '/fallback-icon.png';
      }}
    />
    <div className={s.operation}>
      <a href="http://10.242.78.83:3000/">
        <Button
          className={s.loginBtn}
          size={'sm'}
          block
          ghost
          shadow
        >{type == 'login' ? '登 录' : '注 册'}</Button>
      </a>
    </div>
  </div>
};
export default Login;