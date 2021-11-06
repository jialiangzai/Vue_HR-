import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
// create an axios instance
const service = axios.create({
  // 后台请求基础地址(动态)
  // process.env:{} 环境变量(node)=====>本身没有是webpack提供
  /**
   * dev  开发环境==》后台地址dev localhost:3000/api
   * prod  生产环境====》后台地址prod 例如 http://ihrm-java.itheima.net/api (因为是练习所以用的是生产)
   * stage灰度最后测试阶段
   * 打包上线就不会读取临时的开发环境的地址
   */
  baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout 学校网不好
})

// request interceptor
// 发送请求之前
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 加token
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
// 响应客户端之前
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  // 因为参数传错后台也返回200，所以在这里处理异常
  response => {
    // 从axios的data中解构出来必要的字段
    // 返回简化的数据
    const { success, message, data } = response.data
    if (success) {
      // 请求成功
      // 给页面返回数据
      return data
    } else {
      // 请求失败
      // 错误提示
      Message({
        message: message,
        type: 'error',
        duration: 3 * 1000
      })
      // 对外抛出错误
    }
    return Promise.reject(new Error(message))
  },

  error => {
    // 正常：200以外走到这里
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
