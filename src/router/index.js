import Vue from 'vue'
import Router from 'vue-router'
// 导入 登录组件
import Login from '@/components/Login'
// 导入 后台主页组件
import Home from '@/components/home/Home'
// 导入 欢迎组件
import Welcome from '@/components/home/Welcome'
// 导入 用户列表组件
import UserList from '@/components/user/User'
// 导入 权限列表组件
import Rights from '@/components/power/Rights'
// 导入 角色列表组件
import Roles from '@/components/power/Roles'
// 导入 商品分类组件
import Cate from '@/components/goods/Cate'
// 导入 商品参数组件
import Params from '@/components/goods/Params'
// 导入 订单列表组件
import Order from '@/components/order/Order'
// 导入 报表列表组件
import Report from '@/components/Report/Report'
// 导入 开通会员组件
import member from '@/views/member/member'
// 导入 发布任务
import newTask from '@/views/newTask/newTask'
// 导入 完成任务
import task from '@/views/task/task'
// 导入 提现
import withDrawal from '@/views/withDrawal/withDrawal'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: UserList },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report },
        { path: '/member', component: member },
        { path: '/newTask', component: newTask },
        { path: '/task', component: task },
        { path: '/withDrawal', component: withDrawal }
      ]
    }
  ]
})

// 为路由对象，添加 beforeEach 导航守卫
router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页，直接放行
  if (to.path === '/login') return next()
  // 从 sessionStorage 中获取到 保存的 token 值
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token，强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
