<template>
  <div class="permission-container">
    <div class="app-container">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <template #header>
          <el-row type="flex" justify="space-between" align="middle">
            <span>权限管理</span>
            <!-- 添加type=1的页面访问权限 -->
            <el-button type="primary" @click="addPermi(1, '0')">
              添加权限
            </el-button>
          </el-row>
        </template>
        <!-- card body权限点树形table列表 -->
        <!-- 给 table 表格添加 row-key 属性，一般使用唯一标识作为值 显示树形数据时，该属性是必填的 -->
        <el-table border :data="list" row-key="id">
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="code" label="标识" />
          <el-table-column prop="description" label="描述" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <!-- <el-button type="text">添加</el-button> -->
              <!-- 权限 type=1的时候页面访问的权限 type=2页面下操作功能的权限(一般是按钮)只有这两种类型 -->
              <!-- 添加type=2的页面下功能权限 -->
              <el-button
                v-if="row.type === 1"
                type="text"
                @click="addPermi(2, row.id)"
              >
                添加
              </el-button>
              <el-button type="text" @click="editPermission(row.id)">
                编辑
              </el-button>
              <el-button type="text" @click="delPermission(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 新增权限点==》type=1能不能看 type=2能不能操作 -->
    <el-dialog
      :visible="showDialog"
      :title="formData.id ? '编辑权限' : '新增权限'"
      @close="close"
    >
      <el-form
        ref="addForm"
        label-width="100px"
        :model="formData"
        :rules="rules"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="权限启用">
          <el-switch
            active-text="启用"
            active-value="1"
            inactive-text="不启用"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: right">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="clickSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { getPermissionList, addPermission, delPermission, getPermissionDetail, updatePermission } from '@/api/permission'
import { transformTreeData } from '@/utils'
export default {
  name: 'Permission',
  data () {
    return {
      list: [],
      // 弹层的可见
      showDialog: false,
      // 新增表单的数据===》可复用(编辑)
      formData: {
        enVisible: '0', // 暂时不开启 switch
        name: '', // 名称
        code: '', // 权限标识(身份的标识控制权限)
        description: '', // 描述
        type: '', // 类型
        // 权限点父节点ID（'0'代表是页面权限 | '604f7df5f900be1850edb152'代表页面下功能权限）
        pid: '' // 添加到哪个节点下
      },
      // 校验
      rules: {
        name: [{ required: true, message: '权限点名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限点标识不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.GetPermissionList()
  },
  methods: {
    // 编辑 权限点
    async editPermission (id) {
      // 数据回显
      this.showDialog = true
      try {
        const data = await getPermissionDetail(id)
        console.log('编辑数据', data)
        this.formData = data
      } catch (error) {
        console.log(error)
      }
    },
    // 删除 权限点
    // 判断是否是页面权限或功能权限
    async delPermission (row) {
      console.log('当前点击删除的权限点', row)
      try {
        await this.$confirm(`确定要删除${row.name}权限吗?`, '温馨提示')
        // 开始判断 存在孩子并且不是空
        if (row.children && row.children.length > 0) {
          return this.$message.warning('请先清空页面功能权限')
        } else {
          // 功能权限点 正常删除
          await delPermission(row.id)
        }
        this.GetPermissionList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 关闭
    close () {
      this.showDialog = false
      this.$refs.addForm.resetFields()
      this.formData = {
        enVisible: '0', // 暂时不开启 switch
        name: '', // 名称
        code: '', // 权限标识(身份的标识控制权限)
        description: '', // 描述
        type: '', // 类型
        // 权限点父节点ID（'0'代表是页面权限 | '604f7df5f900be1850edb152'代表页面下功能权限）
        pid: '' // 添加到哪个节点下
      }
    },
    // 确认实现新增 权限点
    clickSubmit () {
      /** 超级管理员才能加而且是规范的
       * 整体校验
       * 调接口新增或编辑更新
       * 刷新列表
       * 提示
       */
      // 校验
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        // 编辑和新增区别 接口不同
        if (this.formData.id) {
          await updatePermission(this.formData)
        } else {
          await addPermission(this.formData)
        }
        this.$message.success('操作成功')
        this.GetPermissionList()
        this.showDialog = false
      })
      /**
       * try catch
       * await this.$refs.addForm.validate()
       *省略了if推荐
       */
    },
    /**
     * type表示添加的是页面权限还是功能权限
     * pid表示添加到哪个节点
     */
    // 新增权限准备
    addPermi (type, pid) {
      // 显示弹层
      this.showDialog = true
      // 存储type和pid
      // 记录当前添加的权限点类型
      this.formData.type = type
      // 记录父节点（添加到哪里）
      this.formData.pid = pid
    },
    async GetPermissionList () {
      const data = await getPermissionList()
      console.table(data)
      // this.list = data
      this.list = transformTreeData(data)
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
