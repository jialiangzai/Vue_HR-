// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }
// 导入持久化方法
import * as auth from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'

export default {
  namespaced: true,
  // 定义变量
  state: {
    // 登录成功的token
    token: auth.getToken() || null,
    // 登录人信息(昵称、头像、权限等)
    userInfo: {}
  },
  mutations: {
    /**
     *
     * @param {*} state state变量对象
     * @param {*} payload 外部调用传入的参数
     */
    // 定义修改变量的方法
    setToken (state, token) {
      state.token = token
      auth.setToken(token)
    },
    delToken (state) {
      state.token = null
      auth.removeToken()
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    // 登出
    // logout (context) {
    //   // 清除token
    //   context.commit('removeToken')
    //   // 清除用户信息
    //   context.commit('reomveUserInfo')
    // }
    delUserInfo (state) {
      state.userInfo = {}
    }
  },
  actions: {
    // 退出登录
    /**
     * 后台退出---调接口
     * 前端退出----清除本地数据
     * @param {*} param0
     * @param {*} formData
     */
    logout ({ commit }) {
      commit('delToken')
      commit('delUserInfo')
    },

    /**
     *
     * @param {*} {commit}    -------- context 调用commit等方法的上下文
     * @param {*} formData --------外部调用传来的参数 手机号 密码
     */
    // 登录请求方法
    async getTokenAction ({ commit }, formDatas) {
      const token = await login(formDatas)
      console.log('token:', token)
      console.log('formData:', formDatas)
      // 调用mutations方法存储token（内存）
      commit('setToken', token)
    },

    async getUserInfoAction ({ commit }) {
      /**
       * 发请求
       * 通过commit调用上面的mutations存储
       */
      const userInfo = await getUserInfo()
      // 头像-----依赖上一步的用户ID
      const photoInfo = await getUserDetailById(userInfo.userId)
      console.log(userInfo, photoInfo)
      // 浅拷贝
      commit('setUserInfo', { ...userInfo, ...photoInfo })
      return userInfo
    }
  }
}
