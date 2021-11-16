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
              <el-button type="text">编辑</el-button>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 新增权限点==》type=1能不能看 type=2能不能操作 -->
    <el-dialog
      :visible="showDialog"
      title="新增权限"
      @close="showDialog = false"
    >
      <el-form label-width="100px" :model="formData" :rules="rules">
        <el-form-item label="权限名称" prop="name">
          <el-input />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input />
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
          <el-button type="primary">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { getPermissionList } from '@/api/permission'
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
    /**
     * type表示添加的是页面权限还是功能权限
     * pid表示添加到哪个节点
     */
    addPermi (type, pid) {
      // 显示弹层
      this.showDialog = true
      // 存储type和pid
      this.formData.type = type
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
