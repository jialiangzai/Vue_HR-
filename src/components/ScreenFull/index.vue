<template>
  <!-- 放置一个图标 -->
  <div>
    <svg-icon icon-class="fullscreen" class="fullscreen" />
  </div>
</template>

<script>
export default {
  // 批量注册标签名动态必加name不然报错 toLowerCase
  name: 'ScreenFull'
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
