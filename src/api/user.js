import request from '@/utils/request'
// 返回的axios的请求的promise一定要return
/*
* @description: 登录
* @param {*} data {modile, password}
* @return {*}
*/
export function login (data) {
  return request({
    // url: '/vue-admin-template/user/login',
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getInfo (token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout () {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
/**
 * @description: 获取用户资料
 * @param {*}
 * @return {*}
 */
export function getUserInfo () {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
/**
 * 之前登录后获取头像数据已经封装过（正常应该是两个接口）
 * @description: 获取用户头像及详情及用户角色及用户角色
 * @param {*} id 用户id
 * @return {*}
 */
export function getUserDetailById (id) {
  return request({
    url: `/sys/user/${id}`
  })
}
