// 批量注册全局公共组件---------插件形式
/**
 * 导出插件对象是一个install函数
 * 注册一下Vue.use
 */
import PageTools from './PageTools'
export default {
  /**
   *
   * @param {*} Vue  Vue构造函数
   */
  install (Vue) {
    Vue.component('PageTools', PageTools)
  }
}
