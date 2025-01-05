import React, { useRef, useState, useCallback, useEffect } from 'react';
import { List, Input, Button, Checkbox, Toast, Keyboard } from 'zarm';
import cx from 'classnames';
import Captcha from "react-captcha-code";
import CustomIcon from '@/components/CustomIcon';
import LoginTitleIcon from '@/assets/login-title-icon.png';
import axios from '@/utils/axios'
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { setTypes } from '@/store/typesSlice'

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

  //  验证码变化，回调方法
  const handleChange = useCallback((captcha) => {
    setCaptcha(captcha)
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
    <img className={s.loginTitleIcon} src={LoginTitleIcon} alt="LoginTitleIcon" />
    <div className={s.operation}>
      <a href="http://localhost:3000/">
        <Button
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