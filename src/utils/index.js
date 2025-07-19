import axios from './axios';

// GET 请求
export const get = (url, params = {}) => {
  return axios.get(url, { params });
};

// POST 请求
export const post = (url, data = {}) => {
  return axios.post(url, data);
};

// PUT 请求
export const put = (url, data = {}) => {
  return axios.put(url, data);
};

// DELETE 请求
export const del = (url, params = {}) => {
  return axios.delete(url, { params });
};

// 格式化金额
export const formatMoney = (amount) => {
  return Number(amount).toFixed(2);
};

// 格式化日期
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
};

// 防抖函数
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 节流函数
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};