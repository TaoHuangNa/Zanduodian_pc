export default {
  data() {
    return {
      // 所有菜单项
      menus: [],
      collapse: false,
      iconlist: ['icon-users', 'icon-tijikongjian', 'icon-shangpin', 'icon-danju', 'icon-baobiao'],
      // 被激活的菜单的path
      activePath: ''
    }
  },
  created() {
    // this.getMenus()
    this.menus = [
      {
        authName: '发布任务',
        id: 0,
        children: [
          {
            authName: '发布审核',
            path: 'newTask'
          }
        ]
      },
      {
        authName: '开通会员',
        id: 1,
        children: [
          {
            authName: '开通审核',
            path: 'member'
          }
        ]
      },
      {
        authName: '完成任务',
        id: 2,
        children: [
          {
            authName: '完成审核',
            path: 'task'
          }
        ]
      },
      {
        authName: '提现',
        id: 3,
        children: [
          {
            authName: '提现审核',
            path: 'withDrawal'
          }
        ]
      }
    ]
    // 只要刷新浏览器，Home组件就会被重新创建一次，data中数据数据会被清空
    // 可以从 sessionStorage 中，把之前保存的激活状态，读取回来，
    // 从新赋值给 data 中的 activePath， 就能够记录之前的激活状态
    const ap = window.sessionStorage.getItem('activePath')
    this.activePath = ap
  },
  methods: {
    // 退出登录状态
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取左侧菜单列表
    async getMenus() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('获取左侧菜单失败！')
      this.menus = res.data
    },
    // 保存用户点击的当前二级菜单的 index 值
    saveActivePath(activePath) {
      console.log(activePath)
      this.activePath = activePath
      // 把当前激活的菜单的值，保存到 sessionStorage
      window.sessionStorage.setItem('activePath', activePath)
    }
  }
}
