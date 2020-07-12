export default {
  data() {
    // 定义校验邮箱的规则
    const checkEmail = (rule, value, cb) => {
      if (
        /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value)
      ) {
        // 校验通过
        cb()
      } else {
        // 校验失败
        cb(new Error('邮箱格式不正确'))
      }
    }

    // 定义校验手机号的规则
    const checkMobile = (rule, value, cb) => {
      if (/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(value)) {
        cb()
      } else {
        cb(new Error('手机号码格式不正确'))
      }
    }

    return {
      // 查询参数对象
      queryInfo: {
        query: '', // 默认没有搜索条件
        pagenum: 1, // 默认查询第一页的数据
        pagesize: 5 // 默认每页显示2条数据
      },
      total: 0, // 总数据条数
      userlist: [], // 当前页中的数据列表
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加表单的数据对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制编辑对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑用户的表单对象
      editForm: {},
      // 编辑表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVidible: false,
      // 用户信息对象
      userInfo: {},
      // 所有角色列表
      rolesList: [],
      // 选中的角色的Id
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 根据查询条件和分页，获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('查询用户列表失败！')
      this.total = res.data.total
      this.userlist = res.data.users
    },
    // 开关状态发生变化就会触发这个函数
    async stateChanged(id, newState) {
      const { data: res } = await this.$http.put(`users/${id}/state/${newState}`)
      if (res.meta.status !== 200) return this.$message.error('修改状态失败！')
    },
    // 每当 pageSize 发生变化，都会触发这个函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 每当 页码值 发生变化，都会触发这个函数
    handleCurrentChange(newPage) {
      // 把最新的页码值，保存到 查询对象中
      this.queryInfo.pagenum = newPage
      // 根据最新的页码值，从新获取数据
      this.getUserList()
    },
    // 重置添加的表单
    resetAddForm() {
      // 重置表单
      this.$refs.addFormRef.resetFields()
      // 关闭对话框
      this.addDialogVisible = false
    },
    // 添加新用户
    addUser() {
      // 1. 表单预校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败！')
        this.$message.success('添加用户成功！')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 展示编辑的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败！')
      // 把获取到的用户信息对象，保存到 编辑表单数据对象中
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 重置编辑表单并隐藏编辑对话框
    resetEditForm() {
      // 清空数据源
      this.editForm = {}
      // 重置表单
      this.$refs.editFormRef.resetFields()
      this.editDialogVisible = false
    },
    // 保存对用户的编辑
    saveUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改的请求
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })

        if (res.meta.status !== 200) return this.$message.error('编辑用户信息失败！')
        this.$message.success('编辑用户信息成功！')
        this.getUserList()
        this.editDialogVisible = false
      })
    },
    // 根据Id删除用户数据
    async remove(id) {
      // 询问是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 用户不想删除数据
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }

      // 删除数据
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    // 展示分配角色的对话框
    async showSetRoleDialog(userInfo) {
      console.log(userInfo)
      this.userInfo = userInfo
      // 发起请求，获取所有角色的列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.rolesList = res.data
      this.setRoleDialogVidible = true
    },
    // 重置修改角色的对话框
    resetRoleDialog() {
      // 把选中的角色Id值重置为空
      this.selectedRoleId = ''
      // 把所有的角色列表，重置为空数组
      this.rolesList = []
      this.setRoleDialogVidible = false
    },
    // 点击保存用户的新角色
    async saveNewRole() {
      if (this.selectedRoleId === '') return this.$message.error('请选择新角色后再保存！')

      // 发起请求，保存新角色
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId
      })
      if (res.meta.status !== 200) return this.$message.error('分配角色失败！')
      this.$message.success('分配角色成功！')
      this.getUserList()
      this.setRoleDialogVidible = false
    }
  }
}
