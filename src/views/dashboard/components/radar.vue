<template>
  <div @mouseenter="loop" @mouseleave="loop(false)">
    <el-switch
      v-model="cg"
      active-text="开启数据切换"
      inactive-text="关闭数据切换"
      :active-value="true"
      :inactive-value="false"
      @change="loop"
    >
    </el-switch>
    <!-- 雷达图  图表必须给高和宽度-->
    <div ref="myDiv" class="radar-echart" />
  </div>
</template>

<script>
// import * as echarts from 'echarts'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
// import * as echarts from 'echarts/core'
// // 引入柱状图图表，图表后缀都为 Chart
// import {
//   RadarChart
// } from 'echarts/charts'
// // 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
// import {
//   TitleComponent,
//   TooltipComponent,
//   GridComponent
// } from 'echarts/components'
// // 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
// import {
//   CanvasRenderer
// } from 'echarts/renderers'

// // 注册必须的组件
// echarts.use(
//   [TitleComponent,
//     TooltipComponent,
//     GridComponent,
//     RadarChart,
//     CanvasRenderer]
// )
export default {
  // 一定要在mounted中不然无法操作dom
  // 页面渲染完毕事件
  data () {
    return {
      cg: false,
      opt: {
        // title: {
        //   text: '基础雷达图'
        // },
        tooltip: {},
        // legend: {
        //   data: ['张三', '李四']
        // },
        radar: {
          // shape: 'circle',
          axisName: {
            // textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
            // }
          },
          indicator: [
            { name: '工作效率', max: 100 },
            { name: '考勤', max: 100 },
            { name: '积极性', max: 100 },
            { name: '帮助同事', max: 100 },
            { name: '自主学习', max: 100 },
            { name: '正确率', max: 100 }
          ]
        },
        series: [
          {
            type: 'radar',
            // areaStyle: {normal: {}},
            data: [

            ]
          }
        ]
      }
    }
  },
  mounted () {
    this.initChart()
  },
  methods: {
    initChart () {
      // 基于准备好的dom，初始化echarts实例
      // 类似data但是不是响应式
      this.myChart = this.echarts.init(this.$refs.myDiv)
      // 绘制图表
      this.opt.series[0].data = [
        {
          value: [10, 20, 100, 30, 100, 0],
          name: '张三'
        },
        {
          value: [50, 50, 50, 50, 50, 10],
          name: '李四'
        }
      ]
      this.myChart.setOption(this.opt)
    },
    // 动态切换核心改option里的data=》重新调用myChart.setOption方法
    // 切换 节流
    loop (f) {
      // console.log(f)
      if (this.st) {
        clearInterval(this.st)
        this.st = null
        return
      }
      this.st = setInterval(this.change, 1000)
    },
    change () {
      const data = []
      for (let index = 0; index < 3; index++) {
        const per = { value: [], name: `李${index}` }
        for (let j = 0; j < 6; j++) {
          per.value.push(Math.floor(Math.random() * 100 + 1))
        }
        data.push(per)
      }
      // 绘制图表
      this.opt.series[0].data = data

      this.myChart.setOption(this.opt)
    }

  }
}
</script>

<style>
.radar-echart {
  width: 100%;
  height: 400px;
}
</style>
