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
              <el-button type="warning" size="small">导入excel</el-button>
              <el-button type="danger" size="small">导出excel</el-button>
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
                active-text="出勤"
                inactive-text="缺勤"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
              <!-- <el-switch v-model="qys" /> -->
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="280">
              <!-- 作用域插槽 -->
              <!-- 删除时传递点击所在行的数据 -->
              <template #default="{ row }">
                <el-button type="text" size="small">查看</el-button>
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
    <!-- 因为遮罩问题 v2只有一个跟元素节点 -->
    <AddEmployee
      :show-dialog="showDialog"
      @close-dialog="showDialog = $event"
    />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EnumTypes from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
// console.log('枚举数据', EnumTypes)
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
      showDialog: false

    }
  },
  mounted () {
    this.getEmployeeList()
  },
  methods: {
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
</style>
