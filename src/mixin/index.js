// 做一个混入对象
import store from '@/store'
export default {
  // 混入对象是组件的选项对象
  methods: {
    // 检查权限 有或者没有 key是检查的权限点
    CheckPermission (key) {
      // 去用户的信息资料中的roles中的points 如果有key表示有权限 如果没有表示没权限不能点
      // store.state.user.userInfo.roles.points
      // 复现：如果不是下面的方案,不判断在员工管理页面退出登录时（当前页面调用了mixin的全局方法）
      // 这时候权限点数据已被清空，vuex中的数据是响应的，当清空之后员工控制会刷新页面，刷完退出之后用户信息是空的
      // 虽然不影响功能,可以用问号?加在roles字母后面,避免报错所以在获取时出现异常
      const { userInfo } = store.state.user
      // if (userInfo.roles && userInfo.roles.points.length) {
      // include 也可以
      return userInfo.roles?.points.some(item => item === key)
      // }
      // 没权限
      // return false
    }
  }
}
