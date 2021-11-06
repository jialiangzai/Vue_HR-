<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <h1 :style="{ color: styles.red }">使用css in js的样式值</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import styles from '@/styles/variables.scss'
// console.log('使用css in js 的样式值', styles)
export default {
  name: 'Dashboard',
  data () {
    return {
      styles
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
