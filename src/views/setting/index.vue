<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <!-- 具名插槽header=》传入面板头部结构 -->
        <template #header>
          <span>公司设置</span>
        </template>

        <!-- 默认插槽=》传入面板内容 -->
        <div>我是面板内容</div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
</style>
