import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './style.module.less'



// 仅为指定的两个页面做保活
const Home = React.lazy(() => import('@/container/Home'));
const Data = React.lazy(() => import('@/container/Data'));

const KEEP_ALIVE_PATHS = ['/', '/data'];

function createElementByPath(pathname) {
  switch (pathname) {
    case '/':
      return <Home />;
    case '/data':
      return <Data />;
    default:
      return null;
  }
}

export default function KeepAlivePages() {
  const { pathname } = useLocation();
  const cacheRef = useRef(new Map());

  // 首次访问时创建并缓存页面实例
  if (KEEP_ALIVE_PATHS.includes(pathname)) {
    if (!cacheRef.current.has(pathname)) {
      cacheRef.current.set(pathname, createElementByPath(pathname));
    }
  }

  // 仅渲染已访问过并缓存的页面；当前路径显示，其它保活页面隐藏但不卸载
  return (
    <>
      {[...cacheRef.current.entries()].map(([key, element]) => (
        <div key={key} className={[styles.keepAlivePage, key === pathname ? styles.block : styles.none].join(' ')}>
          {element}
        </div>
      ))}
    </>
  );
}