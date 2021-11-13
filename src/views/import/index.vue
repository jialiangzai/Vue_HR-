<template>
  <div class="app-container">
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <div slot="header">
        <span>批量导入员工</span>
      </div>
      <!-- card body -->
      <UploadExcel :before-upload="beforeUpload" :on-success="onSuccess" />
    </el-card>
  </div>
</template>

<script>
import { formatExcelDate } from '@/utils/index'
import { importEmployees } from '@/api/employees'
export default {
  methods: {
    // file选择的excel文件
    beforeUpload (file) {
      // 校验大小
      // const isLt1M = file.size / 1024 / 1024 < 1
      // 只有return true 校验通过 |return false 校验失败 只有成功才会执行onSuccess
      // if (isLt1M) {
      return true
      // }
    },
    // 参数就是读取的结果对象[{},{},....] {}==》表示每个员工信息
    async onSuccess ({ results, header }) {
      // 但是是中文的键，能读取，但是要转
      // console.log('读取的表头', header)
      // console.log('读取的数据', results)
      // console.log('转为英文的数据', this.transformResults(results))
      const ens = this.transformResults(results)
      await importEmployees(ens)
      // 返回员工管理页面
      this.$router.back()
    },
    // 中文转英文
    /**
     * 把results中文转为英文属性
     * results转为excel数据
     */
    transformResults (results) {
      /**
       * 准备中英转化换的map
       * 遍历results把读取的员工信息的中文属性根据map转换为英文属性
       */
      // 根据excel中字段去定义
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 准备新数组存储转换完的结果
      const newResults = []
      results.forEach(user => {
        // 存储转换成英文属性的用户信息
        const newUser = {}
        for (const key in user) {
          const enKey = userRelations[key]
          // 属性：key是中文的属性名====》转英文属性名enKey
          // 时间格式化 入职+转正
          if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
            //  excel时间转换(读取excel时间多70年)
            newUser[enKey] = formatExcelDate(user[key], '-')
          } else {
            // enKey是英文
            newUser[enKey] = user[key]
          }
        }
        newResults.push(newUser)
      })
      return newResults
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
