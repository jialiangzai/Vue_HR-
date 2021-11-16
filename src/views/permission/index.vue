<template>
  <div class="permission-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header">
          <el-row type="flex" justify="space-between" align="middle">
            <span>权限管理</span>
            <el-button type="primary">添加权限</el-button>
          </el-row>
        </div>
        <!-- card body 权限点树形table列表 -->
        <el-table border>
          <el-table-column label="名称" />
          <el-table-column label="标识" />
          <el-table-column label="描述" />
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
export default {}
</script>

<style lang="scss" scoped>
</style>
