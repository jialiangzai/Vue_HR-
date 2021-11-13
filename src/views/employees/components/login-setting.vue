<template>
  <div class="app-container">
    <!-- 放置表单 -->
    <el-form ref="userForm" label-width="60px" :model="userInfo" :rules="rules">
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userInfo.username" style="width: 300px" />
      </el-form-item>
      <el-form-item label="密码:">
        <el-input
          v-model="userInfo.password"
          disabled
          style="width: 300px"
          type="password"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateUSerName"> 更新 </el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { saveUserDetailById } from '@/api/employees'
export default {
  props: {
    userInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      rules: {
        username: [

          { required: true, min: 2, max: 10, message: '请输入用户名', trigger: ['change', 'blur'] }

        ]

      }
    }
  },
  methods: {
    updateUSerName () {
      // 整体校验
      this.$refs.userForm.validate(async vaild => {
        if (!vaild) return
        await saveUserDetailById(this.userInfo)
        this.$message.success('更新成功！')
        // this.$router.back()
      })
    }

  }
}
</script>
