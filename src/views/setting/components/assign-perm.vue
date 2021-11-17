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
      <el-button type="primary" @click="savePer">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getPermissionList } from '@/api/permission'
import { transformTreeData } from '@/utils'
import { getRoleDetail, assignPerm } from '@/api/setting'
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
    // 点击确认实现权限的分配
    async savePer () {
      await assignPerm({
        id: this.rolesId,
        //  返回目前被选中的节点的 key 所组成的数组
        permIds: this.$refs.tree.getCheckedKeys()
      })
      this.$message.success('分配成功')
      this.$emit('update:showAssignDialog', false)
    },
    closeAssignDialog () {
      this.$emit('update:showAssignDialog', false)
      // 重置选中状态
      this.$refs.tree.setCheckedKeys([])
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
      const { permIds } = await getRoleDetail(id)
      console.log('当前数据', permIds)
      // this.$refs.tree.setCheckedKeys()
      // 实现数据回显,tree实例的的方法
      this.$refs.tree.setCheckedKeys(permIds)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
