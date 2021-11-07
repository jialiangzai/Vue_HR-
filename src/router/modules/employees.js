/**
 * 员工管理路由规则
 */
// 公共布局
import Layout from '@/layout'

export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      path: '', // 空或和父路由路径一样会被默认加载
      name: 'employees', // 权限的标识
      component: () => import('@/views/employees/index'),
      // 配置左侧菜单信息
      meta: {
        title: '员工管理', // 菜单名字
        icon: 'people' // 菜单图标
      }
    }
  ]
}
