// router/index.js
import { lazy } from 'react'

// 使用懒加载导入组件
const Home = lazy(() => import('@/container/Home'))
const Data = lazy(() => import('@/container/Data'))
const User = lazy(() => import('@/container/User'))
const Login = lazy(() => import('@/container/Login'))
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