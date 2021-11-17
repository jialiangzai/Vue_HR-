// 路由==》菜单=静态+动态(根据权限动态追加)
// 导入静态路由
import { constantRoutes } from '@/router'
export default {
  // 开启模块化
  namespaced: true,
  state: {
    menuList: []
  },
  mutations: {
    // 存储数据   canLook表示动态路由
    setMenuList (state, canLook) {
      state.menuList = [...constantRoutes, ...canLook]
    }
  }
}
