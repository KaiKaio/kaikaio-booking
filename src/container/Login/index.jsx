import React, { useRef, useState, useCallback, useEffect } from 'react';
import { List, Input, Button, Checkbox, Toast, Keyboard } from 'zarm';
import cx from 'classnames';
import Captcha from "react-captcha-code";
import CustomIcon from '@/components/CustomIcon';
import LoginTitleIcon from '@/assets/login-title-icon.webp';
import axios from '@/utils/axios'
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { setTypes } from '@/store/typesSlice'
import { preloadImage } from '@/utils/index';

import s from './style.module.less';

const Login = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const captchaRef = useRef();
  const [type, setType] = useState('login'); // 登录注册类型
  const [captcha, setCaptcha] = useState(''); // 验证码变化后存储值
  const [username, setUsername] = useState(''); // 账号
  const [password, setPassword] = useState(''); // 密码
  const [verify, setVerify] = useState(''); // 验证码
  const [imageLoaded, setImageLoaded] = useState(false);

  //  验证码变化，回调方法
  const handleChange = useCallback((captcha) => {
    setCaptcha(captcha)
  }, []);

  // 预加载登录图标
  useEffect(() => {
    preloadImage(LoginTitleIcon)
      .then(() => {
        setImageLoaded(true);
        console.log('登录图标预加载完成');
      })
      .catch((error) => {
        console.error('登录图标预加载失败:', error);
        setImageLoaded(true); // 即使失败也设置为已加载，避免阻塞
      });
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

        axios({ url: '/api/type/list' }).then((res) => {
          const { data: { list = [] } } = res
          dispatch(setTypes(list))
          navigateTo('/', { replace: true })
        });
      } else {
        if (!verify) {
          Toast.show('请输入验证码')
          return
        };
        if (verify != captcha) {
          Toast.show('验证码错误')
          return
        };
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
      <a href="http://localhost:3000/">
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