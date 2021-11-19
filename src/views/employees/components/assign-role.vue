<template>
  <el-dialog
    class="assign-role"
    title="分配角色"
    :visible="showRoleDialog"
    @close="closeDialog"
  >
    <!-- 这里准备复选框 -->
    <el-checkbox-group v-model="selRoles">
      <el-checkbox v-for="it in roleList" :key="it.id" :label="it.id">
        {{ it.name }}
      </el-checkbox>
      <!-- ：label复选框选中值；selRoles数组记录选中的值 -->
      <!-- <el-checkbox label="2"> cto </el-checkbox>
      <el-checkbox label="3"> fe </el-checkbox> -->
    </el-checkbox-group>
    <template #footer>
      <el-button type="primary" size="small" @click="saveRoles">确定</el-button>
      <el-button size="small" @click="$emit('update:show-role-dialog', false)">
        取消
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
// 列表
import { getRoleList } from '@/api/setting'
// 选中数据回显
import { getUserDetailById } from '@/api/user'
// 分配角色
import { assignRoles } from '@/api/employees'
export default {
  props: {
    // 父组件传过来的变量===》控制弹层的显示或隐藏
    showRoleDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 角色列表所有
      roleList: [],
      // 选中角色列表
      selRoles: [],
      // 用户ID
      userId: ''
    }
  },
  created () {
    this.getRoleLists()
  },
  methods: {
    // 确定入库
    async saveRoles () {
      try {
        // 这里注意出入参数对象----排了20分钟
        await assignRoles({ id: this.userId, roleIds: this.selRoles })
        this.$message.success('操作成功')
        this.$emit('update:show-role-dialog', false)
      } catch (error) {
        console.log(error)
      }
    },
    // 关闭
    closeDialog () {
      this.$emit('update:show-role-dialog', false)
    },
    // 选中角色回显
    async getUserRoles (id) {
      const { roleIds } = await getUserDetailById(id)
      // 控制当前选中用户的角色
      console.log('当前用户选过：', roleIds)
      this.selRoles = roleIds || []
      // 存储当前点击的用户ID
      this.userId = id
    },
    // 获取列表
    async getRoleLists () {
      // 接口参数
      const { rows } = await getRoleList({ page: 1, pagesize: 1000 })
      console.log('角色列表', rows)
      this.roleList = rows
    }
  }
}
</script>
<style lang="scss" scoped>
.el-checkbox {
  margin-bottom: 20px;
}
</style>
