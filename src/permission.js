import router, { asyncRoutes } from './router' // 路由实例
import store from './store' // vue实例

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

// 白名单 (不需要token)
const whiteList = ['/login', '404']
/**
 * to 去哪里
 * from 来自
 * next 放行回调函数 访问页面
 */
router.beforeEach(async (to, from, next) => {
  // 开启进度条
  NProgress.start()

  if (store.getters.token) {
    // 有token
    if (to.path === '/login') {
      // 如果是登录页跳转到首页
      next('/')
    } else {
      // 不是登录页 放行
      next()
      // 在放行之后获取用户登录信息 此时有token js中用实例不能用vuex 发送请求，路由守卫做数据不用存储本地 而且用户信息是可变的 加前缀
      // 判断如果没有获取用户信息才进行调用
      if (!store.getters.name) {
        // promise返回的权限数据
        const roles = await store.dispatch('user/getUserInfoAction')
        console.log('当前登录人的权限数据', roles)
        /**
         * 权限控制
         * 1.获取当前登录人可以访问页面的身份标识 守卫中获取vuex数据userinfo
         * 2.根据当前登录人的访问页面的身份标识匹配动态路由  =====》留下有身份标识的页面路由规则 filter
         * 3.把上一步留下的有身份标识的路由跳转规则动态追加到路由表routes中
         */
        // 留下有身份标识的页面路由规则
        const canLook = asyncRoutes.filter(route => {
          // route表示每一个动态规则
          // 根据标识menus和route的name过滤roles.menus是数组,子路由规则children的第一个name是路由规则的唯一标识
          // 一致name和menus的标识才可以访问不然也是无法访问的
          return roles.menus.includes(route.children[0].name)
        })
        console.log('获取当前登录人可以看的页面:', canLook)
        store.commit('routes/setMenuList', canLook)
        // 把动态路由添加到应用的路由表里 addRoutes只能追加到静态路由后面于是出现404在动态路由之前
        // 解决：追加到动态路由之后
        router.addRoutes([...canLook, { path: '*', redirect: '/404', hidden: true }])
      }
    }
  } else {
    // 没token 第一种方式 indexof ====》-1  第二种方式数组的includes方法 返回布尔值
    if (whiteList.includes(to.path)) {
      // 放行
      next()
    } else {
      next('/login')
    }
  }
  // 关闭进度条
  NProgress.done()
})
// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
