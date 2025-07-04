import React, { useEffect, useState, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import axios from '@/utils/axios'
import { ConfigProvider } from 'zarm';
import routes from '@/router';
import NavBar from '@/components/NavBar';
import { useDispatch  } from 'react-redux'
import { setTypes } from '@/store/typesSlice'

const App = () => {
  const dispatch = useDispatch();

  const location = useLocation()
  const { pathname } = location // 获取当前路径
  const needNav = ['/', '/data', '/user'] // 需要底部导航栏的路径
  const [showNav, setShowNav] = useState(false) // 是否展示 Nav


  const listenSetToken = ({ data: { method, token } }) => {
    if (method === 'setToken') {
      localStorage.setItem('token', token);
      window.parent.postMessage(
        {
          msg: 'token received',
        },
        // 'https://sso.kaikaio.com/',
        'http://localhost:3000/',
      );
    }
  };

  useEffect(() => {
    window.addEventListener('message', listenSetToken, false);

    axios.defaults.headers.common.Authorization = `Bearer ${
      localStorage.token || ''
    }`;

    return () => {
      window.removeEventListener('message', listenSetToken);
    };
  }, [])

  useEffect(() => {
    setShowNav(needNav.includes(pathname))
  }, [pathname]) // [] 内的参数若是变化，便会执行上述回调函数=

  useEffect(() => {
    axios({ method: 'post', url: '/api/user/verify' }).then((res) => {
      const { code = 401 } = res
      if (code !== 200) {
        throw new Error('NOT 200 Verify Auth')
      }

      return axios({  url: '/api/type/list' })
    }).then((res) => {
      const { data: { list = [] } } = res
      dispatch(setTypes(list))
    }).catch((err) => {
      console.error(err, 'Error App useEffect')
    });
  }, [])

  return <ConfigProvider primaryColor={'#007fff'}>
    <>
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>加载中...</div>}>
        <Routes>
          {
            routes.map(route => {
              return (
                <Route
                  exact
                  key={route.path}
                  path={route.path}
                  element={<route.component />}
                />
              )
            })
          }
        </Routes>
      </Suspense>
      <NavBar showNav={showNav} path={pathname} />
    </>
  </ConfigProvider>;
};

export default App;
