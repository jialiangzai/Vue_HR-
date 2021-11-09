<template>
  <el-dialog title="新增部门" :visible="show" width="60%" @close="close">
    <!-- 新增部门表单=》默认插槽 -->
    <el-form ref="addForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="form.name"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="form.code"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- 必须要v-model -->
        <el-select
          v-model="form.manager"
          style="width: 80%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="form.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- 底部=》具名插槽 -->
    <span slot="footer">
      <!-- 如果直接写close会有重复执行嵌套组件所以调用父子通信 -->
      <el-button @click="$emit('close-dialog', false)">取消</el-button>
      <el-button type="primary" @click="addDept">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getEmployeeSimple } from '@/api/employees'
import { addDepartments } from '@/api/departments'
export default {
  props: {
    // 父组件传进来，控制dialog是否显示
    show: {
      type: Boolean,
      default: false
    },
    // 当前操作部门（父）
    currDept: {
      type: Object,
      default: () => ({})
    },
  },
  created () {
    this.getPeoples()
  },
  methods: {
    // 弹层关闭执行
    close () {
      console.log('弹层关闭执行')
      this.$emit('close-dialog', false)
    },
    // 新增部门
    addDept () {
      // 整体校验
      try {
        await this.$refs.addForm.validate()
        console.log('校验通过')
        // console.log('校验通过')
        /**
         * 1. 调用接口新增
         * 2. 组织架构列表刷新
         * 3. 关闭弹层
         */
        // 新增
        // 需要pid=》1. pid的值是父部门id（新增子部门） 2. pid是空（新增顶级部门）
        await addDepartments({
          ...this.form, pid: this.currDept.id || ''
        })
        // 通知父组件更新列表
        this.$emit('update-list')
        this.$message.success('新增成功')
        // 关闭弹出层
        this.$emit('close-dialog', false)
      } catch (error) {
        console.log(error)
      }
    },
    async getPeoples () {
      const peoples = await getEmployeeSimple()
      console.log('负责人列表：', peoples)
      this.peoples = peoples
    }
  },
  data () {
    return {
      // 表单数据
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 表单校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: ['blur', 'change'] }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: ['blur', 'change'] }
        ]
      },
      // 部门负责人列表
      peoples: []
    }
  },
}
</script>

<style lang="scss" scoped>
</style>