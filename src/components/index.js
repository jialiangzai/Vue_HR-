// 批量注册全局公共组件---------插件形式
/**
 * 导出插件对象是一个install函数
 * 注册一下Vue.use
 */
import PageTools from './PageTools'
// xlsx UploadExcel
import UploadExcel from './UploadExcel'
// 定义数据，里面放全局公共组件的
const components = [PageTools, UploadExcel]
export default {
  /**
   *
   * @param {*} Vue  Vue构造函数
   */
  install (Vue) {
    // Vue.component('PageTools', PageTools)
    // Vue.component('UploadExcel', UploadExcel)
    // 动态批量处理注册全局组件
    components.forEach(cp => {
      // cp.name作为批量注册组件的标签名
      Vue.component(cp.name, cp)
    })
  }
}
