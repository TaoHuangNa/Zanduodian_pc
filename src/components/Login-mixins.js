export default {
  data() {
    return {
      // 登录表单的数据对象
      loginForm: {
        username: '18864835725',
        password: '666666'
      },
      // 登录表单的验证规则对象
      loginFormRules: {
        // 登录名称的验证规则
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置表单
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 点击按钮，实现登录
    login() {
      // 1. 进行表单验证
      this.$refs.loginFormRef.validate(async valid => {
        // 如果验证失败，直接退出后续代码的执行
        if (!valid) return
        const { data: res } = await this.$http.post('/jwt-auth/', this.loginForm)
        if (!res.token) return this.$message.error('登录失败！')
        this.$message.success('登录成功！')
        // 把登录成功的token保存到sessionStorage
        window.sessionStorage.setItem('token', res.token)
        // 使用编程式导航，跳转到后台主页
        this.$router.push('/home')
      })
    }
  }
}
