// router/index.js
import { lazy } from 'react'

// 使用懒加载导入组件，并为登录页面设置更高的优先级
const Login = lazy(() => import('@/container/Login'), {
  // 为登录页面设置预加载
  webpackPrefetch: true
});

// 其他页面使用标准懒加载
const Home = lazy(() => import('@/container/Home'))
const Data = lazy(() => import('@/container/Data'))
const User = lazy(() => import('@/container/User'))
const Detail = lazy(() => import('@/container/Detail'))
const Account = lazy(() => import('@/container/Account'))
const About = lazy(() => import('@/container/About'))
const Books = lazy(() => import('@/container/Books'))
const UserInfo = lazy(() => import('@/container/UserInfo'))

const routes = [
  {
    path: "/login",
    notAuth: true,
    component: Login
  },
  {
    path: "/",
    component: Home
  },
  {
    path: "/data",
    component: Data
  },
  {
    path: "/user",
    component: User
  },
  {
    path: "/detail",
    component: Detail
  },
  {
    path: "/account",
    component: Account
  },
  {
    path: "/about",
    component: About
  },
  {
    path: "/books",
    component: Books
  },
  {
    path: "/userinfo",
    component: UserInfo
  },
];

export default routes