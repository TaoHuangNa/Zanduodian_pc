export default {
  data() {
    return {
      // 所有商品分类的列表
      cateList: [],
      // 级联选择框的配置对象
      cascaderConfig: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的商品分配列表
      selectedCateList: [],
      // 被激活的面板的名称
      activeName: 'many',
      // 动态参数的数据列表
      manyTableData: [],
      // 静态参数的数据列表
      onlyTableData: [],
      // 控制添加参数面板的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      //  添加参数表单的验证规则对象
      addFormRules: {
        attr_name: [{ required: true, message: '请填写参数名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getAllCateList()
  },
  methods: {
    // 获取所有商品的分类列表
    async getAllCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败！')
      this.cateList = res.data
    },
    // 级联选择框选中项，发生变化以后会触发这个函数
    cascaderChanged() {
      if (this.selectedCateList.length !== 3) {
        // 没有选中三级分类，把分类重置为空
        this.selectedCateList = []
        this.manyTableData = []
        this.onlyTableData = []
      } else {
        // 选中了三级分类
        // 获取当前三级分类下所有的分类参数
        // 调用 getParamsList 方法，获取所有的参数列表
        this.getParamsList()
      }

      console.log(this.selectedCateList)
    },
    // 根据 指定的分类Id 和 参数的类型，获取参数列表
    async getParamsList() {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) return this.$message.error('获取分类下的参数失败！')
      // 在挂载数据之前，把每个参数项中的 attr_vals 进行字符串的分割
      res.data.forEach(item => {
        // 把字符串的可选项，分割为数组，重新赋值给 attr_vals
        // 注意：item.attr_vals 可能是空字符串，为了防止split以后，出现 空的Tag标签，所以要做三元表达式的判断
        item.attr_vals = item.attr_vals.length > 0 ? item.attr_vals.split(' ') : []
        // 控制TagInput文本输入框的显示与隐藏
        // 为每个数据行，添加自己的 tagInputVisible ，从而控制自己展开行中的 输入框的显示与隐藏
        item.tagInputVisible = false
        // 把文本框中输入的值，双向绑定到 item.tagInputValue 上
        item.tagInputValue = ''
      })
      // 挂载数据到data中
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
      console.log(res.data)
    },
    // 添加对话框关闭事件，重置表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加新参数
    addNewParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          // 参数的名称
          attr_name: this.addForm.attr_name,
          // 参数类型   many  only
          attr_sel: this.activeName
        })

        if (res.meta.status !== 201) return this.$message.error('添加参数失败！')
        this.$message.success('添加参数成功！')
        // 刷新参数列表
        this.getParamsList()
        // 隐藏对话框
        this.addDialogVisible = false
      })
    },
    // 点击按钮，展示TagInput
    showTagInput(row) {
      row.tagInputVisible = true
      // 当我们修改了 data 中 tagInputVisible 的值以后，
      // 如果要操作文本框，必须等页面重新渲染完毕之后才可以，所以，必须把 操作文本框的代码，放到 $nextTick 中，当作回调去执行
      // $nextTick 的执行时机，是在 DOM 更新完毕之后
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 文本框失去焦点的事件
    async loseBlur(row) {
      row.tagInputVisible = false
      // 想办法把文本框中输入的值，保存到服务器
      if (row.tagInputValue.trim().length <= 0) {
        row.tagInputValue = ''
        return
      }
      console.log('要提交到服务器')
      // 把用户输入的文本框中的数据，push到数组中
      row.attr_vals.push(row.tagInputValue)
      row.tagInputValue = ''
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )

      if (res.meta.status !== 200) return this.$message.error('更新参数项失败！')
      this.$message.success('更新参数项成功！')
    },
    // 删除参数项
    async removeTag(row, index) {
      // 1. 根据传递过来的索引值，从 attr_vals 数组中，删除指定的那一项
      row.attr_vals.splice(index, 1)
      // 2. 删除完毕以后，得到的新数组，需要保存到服务器
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )

      if (res.meta.status !== 200) return this.$message.error('删除参数项失败！')
      this.$message.success('删除参数项成功！')
    }
  },
  computed: {
    // 选中的三级分类的Id，被定义为了计算属性，由级联选择框的选中项决定
    // 返回值，可能是 null 或 三级分类的Id
    // 如果 cateId 为 null 证明用户没有选择三级分类
    cateId() {
      if (this.selectedCateList.length === 3) {
        return this.selectedCateList[this.selectedCateList.length - 1]
      } else {
        return null
      }
    },
    // 定义计算属性，控制 添加按钮的 禁用状态
    isDisable() {
      if (this.selectedCateList.length === 3) {
        return false
      } else {
        return true
      }
      // return this.selectedCateList.length === 3 ? false : true
    }
  },
  watch: {
    activeName(newVal, oldVal) {
      // 如果 计算属性 cateId 的值不为null，证明用户选择了三级分类的Id
      // 同时，触发了面板的切换，需要重新请求参数列表数据
      if (this.cateId !== null) {
        this.getParamsList()
      }
    }
  }
}

// 自己写谷歌浏览器的插件http://open.chrome.360.cn/extension_dev/content_scripts.html
