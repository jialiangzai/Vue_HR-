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
              <span>江苏传智播客教育科技股份有限公司</span>
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
                      <el-dropdown-item>添加子部门</el-dropdown-item>
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
                        <el-dropdown-item>添加子部门</el-dropdown-item>
                        <el-dropdown-item>编辑部门</el-dropdown-item>
                        <el-dropdown-item>删除部门</el-dropdown-item>
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
  </div>
</template>

<script>
export default {
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
      }
    }
  },
  methods: {
    // 点击文字触发事件
    handleNodeClick (data) {
      console.log(data)
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
