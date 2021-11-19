import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import * as directs from '@/directives'
// 批量注册全局指令
// Object.keys()===>>>遍历的是对象的所有键存数组
Object.keys(directs).forEach(name => {
  Vue.directive(name, directs[name])
})
// 生成组件全局注册插件 ------>插件注册use这个插件文件就行了
import ComponentPlugin from '@/components/index'
Vue.use(ComponentPlugin)
// 引入混合
import CheckPermission from '@/mixin/index.js'
// 全局混入检查对象 ====》所有组件都有检查的方法
Vue.mixin(CheckPermission)
// echarts插件全局注册
import EchartsComp from '@/utils/plugins'
Vue.use(EchartsComp)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
Vue.use(ElementUI)
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// 重写原生js日志的方法 用于上线后生产环境重写日志
// console.log(1)
// console.log = () => ({})
// console.log = console.table = () => ({})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
