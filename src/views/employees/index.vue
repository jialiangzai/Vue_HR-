<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header">
          <PageTools>
            <!-- 插入到left插槽位置 -->
            <template #left>
              <span>总记录数：{{ total }}条</span>
            </template>
            <!-- 插入到right插槽位置 -->
            <template #right>
              <el-button
                type="warning"
                size="small"
                @click="$router.push('/import')"
              >
                导入excel
              </el-button>
              <el-button
                type="danger"
                size="small"
                :loading="downloadLoading"
                @click="exportData"
              >
                导出excel
              </el-button>
              <el-button
                icon="plus"
                type="primary"
                size="small"
                @click="showDialog = true"
              >
                新增员工
              </el-button>
            </template>
          </PageTools>
        </div>
        <div>
          <!-- table列表 default-sort属性设置默认的排序列和排序顺序。假的排序-->
          <!-- sortable对应列是否可以排序默认false不开启，如果设置为 'custom'，则代表用户希望远程排序，需要监听 Table 的 sort-change 事件 -->
          <!--prop 指定某一列数据排序 order 有ascending升序默认, descending降序-->
          <el-table
            border
            :data="list"
            :default-sort="{ prop: 'workNumber', order: 'descending' }"
          >
            <!-- 一行的数据多列 -->
            <el-table-column label="序号" type="index" />
            <el-table-column label="头像" prop="staffPhoto">
              <!-- 作用域插槽 -->
              <template #default="{ row }">
                <img
                  class="staff"
                  :src="row.staffPhoto"
                  @click="clickShowCodeDialog(row.staffPhoto)"
                />
              </template>
            </el-table-column>
            <el-table-column label="姓名" prop="username" />
            <el-table-column label="工号" prop="workNumber" />
            <!-- <el-table-column label="聘用形式" prop="formOfEmployment"> -->
            <el-table-column label="聘用形式">
              <!-- 使用作用域插槽获取当前行的数据进行格式化 -->
              <template #default="{ row }">
                {{ formatForm(row.formOfEmployment) }}
              </template>
            </el-table-column>
            <el-table-column label="部门" prop="departmentName" />
            <el-table-column label="入职时间" sortable prop="correctionTime" />
            <el-table-column label="账户状态">
              <!-- 项目中暂时只是展示 -->
              <!-- 活跃和不活跃 -->

              <el-switch
                v-model="qys"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
              <!-- <el-switch v-model="qys" /> -->
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="280">
              <!-- 作用域插槽 -->
              <!-- 删除时传递点击所在行的数据 -->
              <template #default="{ row }">
                <el-button
                  type="text"
                  size="small"
                  @click="$router.push(`/employees/detail/${row.id}`)"
                >
                  查看
                </el-button>
                <el-button type="text" size="small">分配角色</el-button>
                <el-button type="text" size="small" @click="delElp(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-row
            type="flex"
            justify="center"
            align="middle"
            style="height: 60px"
          >
            <el-pagination
              background
              layout="prev, pager, next,sizes"
              :total="total"
              :current-page="query.page"
              :page-size="query.size"
              :page-sizes="[5, 10, 2]"
              @current-change="currentChange"
              @size-change="sizeChange"
            />
          </el-row>
        </div>
      </el-card>
    </div>
    <!--新增员工弹出对话框 因为遮罩问题 v2只有一个跟元素节点 -->
    <AddEmployee
      :show-dialog="showDialog"
      @close-dialog="showDialog = $event"
    />
    <!-- 二维码弹出层 -->
    <!-- 分享展示, 预览的二维码的弹层 -->
    <el-dialog
      title="二维码"
      width="300px"
      :visible="showCodeDialog"
      @close="showCodeDialog = false"
    >
      <!-- 二维码 用canvas绘制 用插件QrCode把地址转为二维码-->
      <el-row type="flex" align="center" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EnumTypes from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
// console.log('枚举数据', EnumTypes)
// 基本用法
import QrCode from 'qrcode'

export default {
  components: {
    AddEmployee
  },
  data () {
    return {
      // 员工列表数据
      list: [],
      // 根据封装的接口      需要什么数据   需要传入什么参数去定义data的数据
      query: {
        page: 1,
        size: 5
      },
      // 数据的总数量
      total: 0,
      // 账户状态展示,无效果
      qys: true,
      EnumTypes,
      // 新增对话框
      // 新增员工
      showDialog: false,
      downloadLoading: false, // 导出loading
      // 二维码
      showCodeDialog: false
    }
  },
  mounted () {
    this.getEmployeeList()
  },
  methods: {
    // 点击头像获取二维码
    clickShowCodeDialog (url) {
      // 拿到头像的字符串
      // console.log(url)
      if (!url) return // 有图片才显示弹层
      this.showCodeDialog = true
      // dom为一个canvas的dom对象， info是转化二维码的信息
      // 避坑 之前对话框是没有数据的现在要渲染数据就要更新DOM，但是更新是必须要拿到url再去更新是异步的
      // Dialog 的内容是懒渲染的，即在第一次被打开之前，传入的默认 slot 不会被渲染到 DOM 上。
      // 因此，如果需要执行 DOM 操作，或通过 ref 获取相应组件，请在 open 事件回调中进行。
      // QrCode.toCanvas(this.$refs.myCanvas, url)
      this.$nextTick(() => {
        QrCode.toCanvas(this.$refs.myCanvas, url)
      })
    },
    // 导出某页员工数据 懒加载引用
    async exportData () {
      // 开始导出
      this.downloadLoading = true
      // 使用excel导出插件导出的数据
      // import() 什么时候正式要使用导出功能了,插件才会被正式引入到应用里=>需要script-loader支持 按需导入js模块
      const excel = await import('@/utils/Export2Excel.js')
      console.log('excel导出的方法', excel)
      // 准备需要导出的员工信息map映射关系 自定义的映射 如果是全部就写10个
      // 注意先后顺序必须要和后台返回的数据保持一致
      // 1. 中文key做表头（注意先后顺序和后台返回顺序保持一致）
      // 2. 英文value过滤导出字段使用enHeader
      const userMap = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '工号': 'workNumber',
        '转正日期': 'correctionTime',
        '部门': 'departmentName'
      }
      // 中文的key----表头
      const header = Object.keys(userMap)
      console.log('表头字段', header)
      const enHeader = Object.values(userMap)
      console.log('data数据', enHeader)
      // 把list数据列表转为二维数组并导入excel中做data
      /**
       * 把list中的对象转为数组放到数组中
       */
      const data = this.transformlist(this.list, enHeader)
      console.log(data)
      excel.export_json_to_excel({
        // 表头 必填
        header,
        // header: ['姓名', '工资'],
        // 表头对应的具体数据 必填
        data,
        filename: 'excel-list', // 导出下载的文件名称
        autoWidth: true, // 导出excel列宽度是否自适应
        bookType: 'xlsx' // 导出生成的文件类型
      })
      // 导出成功并关闭loading
      this.downloadLoading = false
    },
    // list转二维数组 user===>数组
    /**
     * [[员工1的信息],[员工二的信息],……]
     * 准备空数组存储转换结果
     * 遍历list老数组根据enHeader去转换二维数组
     */
    transformlist (list, enHeader) {
      // 转换后的结果
      const secondArray = []
      // 遍历 user表示每一个员工对象
      list.forEach(user => {
        // 存储每个员工对象
        const itemArray = []
        // 根据enHeader去按需转换
        // 把enHeader数组===》单个成员的属性(英文后台数据键为英文)对应的值放到itemArray中
        for (const keyIn in user) {
          // 指定字段
          if (enHeader.includes(keyIn)) {
            // 聘用形式
            if (keyIn === 'formOfEmployment') {
              itemArray.push(this.formatForm(user[keyIn]))
            } else { itemArray.push(user[keyIn]) }
          }
          // itemArray.push(user[enHeader])
        }
        secondArray.push(itemArray)
      })
      return secondArray
    },
    // 获取员工列表
    async getEmployeeList () {
      const { rows, total } = await getEmployeeList(this.query)
      // console.log('员工列表数据', rows, total)
      this.total = total
      this.list = rows
    },
    // 分页
    // currentPage 改变时会触发
    currentChange (pagen) {
      console.log(pagen)
      this.query.page = pagen
      this.getEmployeeList()
    },
    // pageSize 改变时会触发
    sizeChange (pages) {
      console.log(pages)
      this.query.size = pages
      this.getEmployeeList()
    },
    // 使用枚举格式化聘用形式和时间
    formatForm (type) {
      // console.log('在成员管理使用到的枚举数据', EnumTypes.hireType)// 数组
      // 容器
      const map = {}
      // 遍历 生成映射关系
      EnumTypes.hireType.forEach(item => { map[item.id] = item.value })
      return map[type]
    },
    // 删除功能
    async delElp (row) {
      console.log(row)
      /**
       * 用户确认删除
       * 调用接口
       * 刷新列表
       */
      try {
        // confirm返回promise
        await this.$confirm(`确认要删除${row.username}`)
        await delEmployee(row.id)
        // 刷新列表
        // this.query.page = 1
        /**
         * 组件库的问题:删除完最后一页数据此时最后一页数据为空===》页码显示正确数据是之前的在发请求之时传递的是之前的页码,
         * 解决:计算最新页数=》最后一页页码
         * 删除情况下 : 页码= (总条数-1)/每页的条数
         * 重新赋值最新的页码 刷新数据
         */
        // 最新的页码
        const newPage = Math.ceil((this.total - 1) / this.query.size)
        // 排除只剩一页情况（页码默认是1）
        if (this.query.page > newPage) {
          this.query.page = newPage
        }
        this.getEmployeeList()
        this.$message.success('删除成功！')
      } catch (error) {
        console.dir(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.employees-container {
  .staff {
    width: 70px;
    height: 70px;
    border-radius: 100%;
  }
}
</style>
