<template>
  <div class="app-container">
    <!-- 个人信息 -->
    <el-form
      ref="userInfo"
      label-width="100px"
      :model="userInfo"
      :rules="rules"
    >
      <!-- 部门 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="部门" prop="departmentName">
            <el-input v-model="userInfo.departmentName" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="userInfo.mobile" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="入职时间" prop="timeOfEntry">
            <el-date-picker
              v-model="userInfo.timeOfEntry"
              type="date"
              class="inputW"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片 -->
            <!-- <el-image :src="require('@/assets/common/head.jpg')"></el-image> -->
            <UploadImg :staff-photo.sync="userInfo.staffPhoto" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="updates">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
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
        departmentName: [{ required: true, message: '请输入', trigger: 'blur' }],
        timeOfEntry: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  methods: {
    updates () {
      // 校验
      this.$refs.userInfo.validate(async valid => {
        if (!valid) return
        await saveUserDetailById(this.userInfo)
        this.$message.success('更新成功！')
      })
    }
  }
}
</script>
