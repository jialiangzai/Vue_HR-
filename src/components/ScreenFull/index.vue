<template>
  <!-- 放置一个图标 -->
  <div>
    <!-- 未全屏显示fullscreen 全屏显示exit -->
    <!-- svg-icon是渲染svg图标的全局组件
    icon-class传入svg文件名
    1. 不是全屏 fullscreen
    2. 是全屏 exit-fullscreen
     -->
    <svg-icon
      :icon-class="isFull ? 'exit-fullscreen' : 'fullscreen'"
      class="fullscreen"
      @click="toggleScreen"
    />
  </div>
</template>

<script>
// 老浏览器不支持全屏用插件
// 全屏插件版本====>5.0.0新版会报错
import sf from 'screenfull'
export default {
  // 批量注册标签名动态必加name不然报错 toLowerCase
  name: 'ScreenFull',
  data () {
    return {
      // 默认不是全屏
      isFull: false
    }
  },
  created () {
    // 监听全屏切换
    sf.on('change', () => {
      console.log('全屏切换了：', sf)
      // if (sf.isFullscreen) {
      //   // 全屏状态
      //   this.isFull = sf.isFullscreen
      // } else {
      //   // 不是全屏
      //   this.isFull = sf.isFullscreen
      // }
      this.isFull = sf.isFullscreen
    })
  },
  // 监听事件消耗性能
  beforeDestroy () {
    // 解绑事件
    sf.off('change')
  },
  methods: {
    toggleScreen () {
      // 判断是否可用
      if (!sf.isEnabled) {
        // 此时全屏不可用
        this.$message.warning('你的浏览器不支持全屏功能！')
        return
      }
      //   如果可用 就可以全屏
      sf.toggle()
    }
  }
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
