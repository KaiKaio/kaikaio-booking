import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    setShowNav(needNav.includes(pathname))
  }, [pathname]) // [] 内的参数若是变化，便会执行上述回调函数=

  useEffect(() => {
    axios({  url: '/api/type/list' }).then((res) => {
      const { data: { list = [] } } = res
      dispatch(setTypes(list))
    });
  }, [])

  return <ConfigProvider primaryColor={'#007fff'}>
    <>
      <Routes>
        {routes.map(route => <Route exact key={route.path} path={route.path} element={<route.component />} />)}
      </Routes>
      <NavBar showNav={showNav} path={pathname} />
    </>
  </ConfigProvider>;
};

export default App;
