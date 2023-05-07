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
        setTimeout(() => {
          axios({ url: '/api/type/list' }).then((res) => {
            const { data: { list = [] } } = res
            dispatch(setTypes(list))
            navigateTo('/', { replace: true })
          });
        }, 0)
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
    <div className={s.tab}>
      <span className={cx({ [s.avtive]: type == 'login' })} onClick={() => setType('login')}>登录</span>
      <span className={cx({ [s.avtive]: type == 'register' })} onClick={() => setType('register')}>注册</span>
    </div>
    <div className={s.form}>
      <List>
        <List.Item className={s.inputWrap} prefix={ <CustomIcon type="icon-wode" /> }>
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            onChange={(event) => setUsername(event.target.value)}
          />
        </List.Item>
      
        <List.Item className={s.inputWrap} prefix={<CustomIcon type="icon-password" />}>
          <Input
            clearable
            type="password"
            placeholder="请输入密码"
            onChange={(event) => setPassword(event.target.value)}
          />
        </List.Item>
        {
          type == 'register' ? (
            <List.Item className={s.inputWrap} prefix={<CustomIcon type="icon-password" />}>
              <Input
                clearable
                type="text"
                placeholder="请输入验证码"
                onChange={(event) => setVerify(event.target.value)}
              />
              <Captcha ref={captchaRef} charNum={4} onChange={handleChange} />
            </List.Item>
          ) : null
        }
      </List>
    </div>
    <div className={s.operation}>
      <Button
        onClick={onSubmit}
        size={'sm'}
        block
        ghost
        shadow
      >{type == 'login' ? '登 录' : '注 册'}</Button>
    </div>
  </div>
};
export default Login;