import React from 'react'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'
import { store } from '@/store'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import 'lib-flexible/flexible'
import './index.css'
import 'zarm/dist/zarm.css'; // TODO: 渐进式迁移完成后移除，antd-mobile 不需要额外引入 CSS
import App from './App'

export const router = createBrowserRouter([
  // match everything with "*"
  { path: "*", element: <App /> }
])

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    {/* <App /> */}
    <RouterProvider router={router} />
  </Provider>
  // </React.StrictMode>
);