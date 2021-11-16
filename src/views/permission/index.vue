<template>
  <div class="permission-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <template #header>
          <el-row type="flex" justify="space-between" align="middle">
            <span>权限管理</span>
            <el-button type="primary">添加权限</el-button>
          </el-row>
        </template>
        <!-- card body权限点树形table列表 -->
        <el-table border :data="list">
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="code" label="标识" />
          <el-table-column prop="description" label="描述" />
          <el-table-column label="操作">
            <template>
              <el-button type="text">添加</el-button>
              <el-button type="text">编辑</el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Permission',
  data () {
    return {
      list: []
    }
  },
  created () {
    this.GetPermissionList()
  },
  methods: {
    async GetPermissionList () {
      const data = await getPermissionList()
      console.log(data)
      this.list = data
      // this.list = tranListToTreeData(data)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
