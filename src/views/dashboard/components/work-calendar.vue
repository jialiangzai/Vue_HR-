<template>
  <el-calendar v-model="currentDate">
    <!-- 自定义每个格子(天)结构 -->
    <!-- date日期对象=》new Date data 年-月-日=》当天信息 -->
    <!-- 在 scoped-slot 可以获取到 date（当前单元格的日期）, data（包括 type，isSelected，day 属性） -->
    <template #dateCell="{ date, data }">
      <div class="date-content">
        <span class="text">{{ getDays(data.day) }}</span>
        <span v-if="isWeek(date)" class="rest">休</span>
      </div>
    </template>
  </el-calendar>
</template>

<script>
export default {
  data () {
    return {
      currentDate: new Date()
    }
  },
  methods: {
    // 几号
    getDays (value) {
      const day = value.split('-')[2] // 11, 02
      return day
    },
    // 周末
    isWeek (v) {
      // console.log(v)
      return v.getDay() === 6 || v.getDay() === 0
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-calendar-day {
  height: 50px;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
// 休息时间
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
// 当前日期
::v-deep .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
</style>
