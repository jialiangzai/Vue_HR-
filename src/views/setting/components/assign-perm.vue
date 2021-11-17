<template>
  <!-- 分配权限的弹层 -->
  <el-dialog
    title="分配权限(一级为路由页面查看权限-二级为按钮操作权限)"
    :visible="showAssignDialog"
    @close="closeAssignDialog"
  >
    <!-- check-strictly动态开启严格模式可以关闭父子关联 -->
    <!-- node-key="id" // 选中时绑定的数据字段(唯一) 必传属性 -->
    <el-tree
      ref="tree"
      :data="list"
      node-key="id"
      :props="{ label: 'name' }"
      :default-expand-all="true"
      :show-checkbox="true"
      :check-strictly="true"
    ></el-tree>

    <!-- 权限点数据展示 -->
    <template #footer>
      <el-button @click="closeAssignDialog">取消</el-button>
      <el-button type="primary">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getPermissionList } from '@/api/permission'
import { transformTreeData } from '@/utils'
import { getRoleDetail } from '@/api/setting'
export default {
  props: {
    showAssignDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      list: [], // 存储权限数据
      rolesId: ''
    }
  },
  created () {
    this.GetPermissionList()
  },

  methods: {
    closeAssignDialog () {
      this.$emit('update:showAssignDialog', false)
    },
    // 获取
    async GetPermissionList () {
      const data = await getPermissionList()
      console.table(data)
      // this.list = data
      this.list = transformTreeData(data)
    },
    // 数据回显选中的权限
    async getRoleCheck (id) {
      this.rolesId = id
      const data = await getRoleDetail(this.rolesId)
      console.log('当前数据', data)
      // this.$refs.tree.setCheckedKeys()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
