<template>
  <div class="department-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <!-- 具名插槽header=》传入面板头部结构 -->
        <template #header>
          <!-- <span>组织架构</span> -->
          <!-- 用一个行列布局 -->
          <el-row>
            <el-col :span="20">
              <span>{{ company.name }}</span>
            </el-col>
            <el-col :span="4">
              <el-row type="flex" justify="end">
                <!-- 两个内容 -->
                <el-col>负责人</el-col>
                <!-- 下拉菜单 element -->
                <el-col>
                  <el-dropdown>
                    <span> 操作<i class="el-icon-arrow-down" /> </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="addDept()">
                        添加子部门
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
        <!-- 默认插槽=》传入面板内容 -->
        <el-tree
          :data="departData"
          :props="defaultProps"
          default-expand-all
          @node-click="handleNodeClick"
        >
          <!-- 单项数据 作用域插槽定义好了的-->
          <template #default="{ data }">
            <!-- 单个树的项结构 -->
            <el-row style="width: 100%">
              <!-- 显示部门名 -->
              <el-col :span="20">
                <span>{{ data.name }}</span>
              </el-col>
              <!-- 部门操作按钮 -->
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <!-- 两个内容 -->
                  <el-col>{{ data.manager || "--" }}</el-col>
                  <el-col>
                    <!-- 下拉菜单 element -->
                    <el-dropdown>
                      <span> 操作<i class="el-icon-arrow-down" /> </span>
                      <!-- 下拉菜单 -->
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="addDept(data, 1)">
                          添加子部门
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addDept(data, 2)">
                          编辑部门
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="delDept(data)">
                          删除部门
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-tree>
      </el-card>
    </div>
    <!-- 新增部门 -->
    <AddDept
      ref="editDept"
      :show="show"
      :curr-dept="currDept"
      :all-depts="allDepts"
      @update-list="getDepartData"
      @close-dialog="show = $event"
    />
  </div>
</template>

<script>
import { getDepartments, delDepartments } from '@/api/department'
import { transformTreeData } from '@/utils/index'
import AddDept from './components/add-dept.vue'
export default {
  components: {
    AddDept
  },
  data () {
    return {
      // 组织架构树形数据
      departData: [
        {
          name: '总裁办'
        },
        {
          name: '财务部',
          children: [{
            name: '税务'
          }]
        }
      ],
      // 修改树形中属性名=》场景：后台返回数据属性名不叫lable，子不叫children
      defaultProps: {
        children: 'children',
        label: 'name' // 后台返回叫name
      },
      // 公司信息
      company: { name: '', manager: '' },
      show: false,
      // 当前操作部门数据
      currDept: null,
      // 所有部门数据
      allDepts: []
    }
  },
  created () {
    this.getDepartData()
  },
  methods: {
    // 删除部门数据
    async delDept (data) {
      console.log(data)
      /**
       * 1.用户确认
       * 2.确定了，如果是父部门下面有子部门不能删除data.children && data.children.length > 0
       * 3.如果是没有子级部门可以删除
       * 4.重新获取树形数据
       */
      try {
        await this.$confirm(`确认要删除${data.name}?`, '提示')
        if (data.children && data.children.length > 0) {
          return this.$message.error('包含子级部门的父部门不能直接删除，先删除子')
        }
        await delDepartments(data.id)
        this.$message.success('删除成功！')
      } catch (error) {
        console.log(error)
      }
    },
    async getDepartData () {
      const { companyName, depts } = await getDepartments()
      // console.table(depts)
      this.company.name = companyName
      // 拿到数据后转换
      // 注意只能调用一次log之后报错,depts改变了,组件库循环有重复的key,避免重复引用
      // console.log('转换结果,', transformTreeData(depts))
      this.allDepts = depts
      this.departData = transformTreeData(depts)
      /**
   * 根据渲染结构，我们发现，虽然数据已经成功显示出来了，但是它是平铺下来的，并不是树形的，这是因为后端返回来的数据并不是一个嵌套的数组结构，而是一个平铺的数组结构，需要我们自行处理一下
   */
    },
    // 点击文字触发事件
    handleNodeClick (data) {
      // 获取部门数据
      console.log(data)
    },
    // 新增部门
    /**
     * currDept 当前要添加子部门的父部门.
     * * type 1 代表新增  2 代表修改
     */
    addDept (currDept, type) {
      // 存储当前操作的部门
      this.currDept = currDept
      console.log(type)
      this.show = true
      if (type === 2) {
        // 编辑需要调用接口回显数据
        //  this.$refs.editDept === AddDept组件this
        this.$refs.editDept.getDepartDetail(currDept.id)
      }
    }
  }
}
/** 默认插槽 ==》1 个 默认名字 #default ==>传入结构
 * 具名插槽 -==》多个 有自己的名字====》传入结构
 * 作用域插槽===》基于前两种插槽==》接收数据(子传父)
 */

</script>

<style lang="scss" scoped>
//深度作用选择符： less 中使用 /deep/   | scss 中使用 ::v-deep
::v-deep .el-tree-node__content {
  margin: 3px 0;
  font-size: 14px;
}
</style>
