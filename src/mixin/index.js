// 做一个混入对象
import store from '@/store'
export default {
  // 混入对象是组件的选项对象
  methods: {
    // 检查权限 有或者没有 key是检查的权限点
    CheckPermission (key) {
      // 去用户的信息资料中的roles中的points 如果有key表示有权限 如果没有表示没权限不能点
      // store.state.user.userInfo.roles.points
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points.length) {
        return userInfo.roles.points.some(item => item === key)
      }
      // 没权限
      return false
    }
  }
}
