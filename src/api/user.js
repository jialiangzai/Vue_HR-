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
