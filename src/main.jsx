import React from 'react'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'
import { store } from '@/store'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import 'lib-flexible/flexible'
import './index.css'
import 'zarm/dist/zarm.css';
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