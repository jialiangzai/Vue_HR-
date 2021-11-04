// 使用cookie把token存储到本地实现数据持久化
import Cookies from 'js-cookie'
// 存储的key
const TokenKey = 'hr137_token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
