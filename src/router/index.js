// router/index.js
import Home from '@/container/Home'
import Data from '@/container/Data'
import User from '@/container/User'
import Login from '@/container/Login'
import Detail from '@/container/Detail'
import Account from '@/container/Account'
import About from '@/container/About'
import Books from '@/container/Books'
import UserInfo from '@/container/UserInfo'

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