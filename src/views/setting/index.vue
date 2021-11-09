<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card>
        <!-- 默认插槽 ===》内容 -->
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="padding: 10px 0">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >
                新增角色
              </el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="list">
              <!-- column表示列 label表示显示的表格字段名 type表示内部的遍历 prop显示的属性  -->
              <el-table-column
                label="序号"
                type="index"
                prop="name"
                width="120"
              />
              <el-table-column label="角色名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template #default="{ row }">
                  <!-- 获取当前行数据 -->
                  <p>{{ row }}</p>
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="delRole(row.id)"
                  >
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
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next"
                :total="total"
                :page-size="query.pagesize"
                :pager-count="7"
                :current-page="query.page"
                background
                @current-change="currentChange"
              />
            </el-row>
          </el-tab-pane>
          <!-- 第二栏 -->
          <el-tab-pane label="公司信息">
            <h1>The Shy</h1>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 新增角色 -->
    <!-- title="新增角色"  -->
    <el-dialog
      :title="roleForm.id ? '编辑角色' : '新增角色'"
      :visible.sync="showDialog"
      width="40%"
      @close="close"
    >
      <!-- 表单 -->
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="addRole">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, deleteRole, addRole, getRoleDetail, updateRole } from '@/api/setting'
export default {
  data () {
    return {
      // 角色列表
      list: [],
      // 分页
      query: {
        // 页码
        page: 1,
        // 每页的条数
        // pagesize: 10
        pagesize: 10
      },
      // 数据的总条数
      total: 0,
      // 控制弹出层显示
      showDialog: false,
      // 表单数据（新增|编辑）
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      }

    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取角色列表
    async getList () {
      const { total, rows } = await getRoleList(this.query)
      // console.log('返回角色列表', list)
      this.list = rows
      this.total = total
    },
    // 分页切换
    currentChange (currPage) {
      console.log(currPage)
      this.query.page = currPage
      this.getList()
    },
    // 删除
    async delRole (id) {
      /**
       * 1. 用户确认后
       * 2. 调用接口删除
       * 3. 刷新列表
       */
      try {
        await this.$confirm('确认删除吗？')
        // 确定
        await deleteRole(id)
        // 重置
        this.query.page = 1
        this.getList()
        this.$message.success('删除成功')
      } catch (error) {
        // 取消
        console.log('点击取消')
      }
    },
    // 弹层关闭
    close () {
      console.log('弹层关闭')
      // 只能匹配有校验规则的表单-----既能重置数据还能重置状态去除爆红
      this.$refs.roleForm.resetFields()
      this.roleForm = {
        name: '',
        description: ''
      }
    },
    async addRole () {
      try {
        await this.$refs.roleForm.validate()
        //  校验通过走到这
        // 判断
        if (this.roleForm.id) {
          // 编辑
          await updateRole(this.roleForm)
        } else {
          // 新增
          await addRole(this.roleForm)
        }
        this.query.page = 1
        this.getList()
        this.showDialog = false
        this.$message.success('操作成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole (id) {
      // console.log(id)
      // 查询接口回显当前编辑的角色数据
      const res = await getRoleDetail(id)
      console.log(res)
      // 数据回显
      this.roleForm = res
      // 显示编辑弹出层
      this.showDialog = true
    }
    // 编辑----》提交

  }
}
</script>

<style lang="scss" scoped>
</style>
