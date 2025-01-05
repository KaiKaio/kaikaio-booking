import axios from 'axios'
import { Toast } from 'zarm'
import { router } from '@/main'

const MODE = import.meta.env.MODE // 环境变量

axios.defaults.baseURL = MODE == 'development' ? '' : 'http://47.99.134.126:7009'
axios.defaults.withCredentials = true
axios.defaults.timeout = 5000
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Authorization'] = `${localStorage.getItem('token') || null}`
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use(
  (res) => {
    if (typeof res.data !== 'object') {
      Toast.show('服务端异常！')
      return Promise.reject(res)
    }
    if (res.data.code !== 200) {
      if (res.data.msg) {
        Toast.show(res.data.msg)
      }

      if (res.data.code === 401) {
        Toast.show('未登录，请登录后使用')
        router.navigate('/login', { replace:true })
      }

      if (res.data.code === 413) {
        Toast.show('图片不得超过 50kb')
      }

      return Promise.reject(res.data)
    }

    return res.data
  },
  (err) => {
    if (err?.response?.status === 401) {
      Toast.show('未登录，请登录后使用')
      router.navigate('/login', { replace:true })
    }
    if (err?.code === 'ECONNABORTED') {
      Toast.show('请求超时，请刷新重试')
    }
  }
)

export default axios
