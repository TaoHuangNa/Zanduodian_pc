// vs code 快捷键   ctrl + k + 0
export default {
  data() {
    return {
      // 所有角色列表的数据，默认为空
      rolesList: [],
      // 控制分配权限对话框的显示和隐藏
      setRightDialogVisible: false,
      // 权限的树形结构数据
      rightTree: [],
      // 树形控件的配置对象
      treeConfig: {
        children: 'children', // 指定节点之间的嵌套关系
        label: 'authName' // 指定把哪个属性渲染出来供用户查看
      },
      // 设置默认被选中的节点的id
      defaultCheckedKeys: [],
      // 将要分配权限的角色Id
      selectedRoleId: null
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.rolesList = res.data
      console.log(res.data)
    },
    // 根据角色Id和权限Id，删除角色下指定的权限
    async removeRight(role, rightId) {
      // 提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 取消删除
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }

      // 删除权限
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败！')
      this.$message.success('删除权限成功！')
      // 重新刷新角色列表，但是不要这么调用，因为 体验差，会把整个表格的数据都重新请求一遍
      // this.getRolesList()

      // res.data // 当前角色下，所有的最新的权限
      // 我们只需要，把 当前角色的 children 属性，重新赋值为 res.data 即可
      role.children = res.data
    },
    // 点击按钮，显示分配权限的对话框
    async showSetRightDialog(role) {
      // 在展示分配权限对话框的时候，立即把当前角色的Id，存储到data中，供后续保存使用
      this.selectedRoleId = role.id
      // 在展示对话框之前，先获取到 权限的树形结构的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('初始化权限失败！')
      // 把权限的树形结构数据，保存到data中，供页面渲染使用
      this.rightTree = res.data
      // 调用递归，获取当前角色下所有三级权限的Id
      const keys = [] // 专门存放所有三级节点的Id
      this.getLeafIds(role, keys)
      this.defaultCheckedKeys = keys
      this.setRightDialogVisible = true
    },
    // 根据指定的节点和keys数组，递归获取所有三级节点的Id
    getLeafIds(node, keys) {
      if (!node.children) {
        keys.push(node.id)
      } else {
        node.children.forEach(item => this.getLeafIds(item, keys))
      }
    },
    // 重置分配权限的对话框
    resetSetRightDialog() {
      this.rightTree = []
      this.defaultCheckedKeys = []
      this.selectedRoleId = null
    },
    // 点击按钮，分配权限
    async saveRight() {
      // 1. 获取树形控件中，所有半选和全选节点的Id数组
      const arr1 = this.$refs.tree.getCheckedKeys()
      const arr2 = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...arr1, ...arr2].join(',')
      // 2. 把两个数组，合并成一个数组
      // 3. 把数组调用 .join(',') 拼接，得到最终的 rids 字符串
      // 4. 调用服务器的 API 接口，保存权限
      const { data: res } = await this.$http.post(`roles/${this.selectedRoleId}/rights`, { rids })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败！')
      this.$message.success('分配权限成功！')
      this.setRightDialogVisible = false
      this.getRolesList()
    }
  }
}
