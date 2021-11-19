
// getter做了映射 简写
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto,
  name: state => state.user.userInfo.username,
  // id
  userId: state => state.user.userInfo.id,
  mobile: state => state.user.userInfo.mobile,
  departmentName: state => state.user.userInfo.departmentName
}
export default getters
