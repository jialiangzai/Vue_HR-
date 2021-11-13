<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <login-setting :user-info="userInfo" />
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <user-info :user-info="userInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import loginSetting from './components/login-setting.vue'
import userInfo from './components/user-info.vue'
// 获取员工信息api
import { getUserDetailById } from '@/api/user'
export default {
  components: {
    loginSetting,
    userInfo
  },
  data () {
    return {
      userInfo: {}
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo () {
      // id是路由配置的动态参数属性
      const res = await getUserDetailById(this.$route.params.id)
      console.log(res)
      this.userInfo = res
    }
  }
}
</script>
