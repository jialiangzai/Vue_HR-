
/**
 * 封装自定义全局指令
 * 处理图片加载异常，如果加载失败显示默认图片
 * // 注册一个全局自定义指令 `v-focus`
 * options ====> binding
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
 */
const imgeerror = {
  inserted (dom, options) {
    dom.onerror = () => {
      dom.src = options.value
    }
  }
}
const focus = {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
}
export { imgeerror, focus }
