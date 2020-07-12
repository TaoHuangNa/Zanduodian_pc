export default {
  data() {
    return {
      // 查询对象
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 所有分类列表的数据
      cateList: [],
      // 总数据条数
      total: 0,
      // 定义表格中，每一行数据由几列组成
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          // 通过 type: 'template' 把当前列，定义为模板列
          type: 'template',
          // 指定，当前使用的模板，叫做 opt
          template: 'opt',
          width: '200px'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addDialogVisible: false,
      // 添加表单的数据对象
      addForm: {
        // 即将添加的新分类的名称
        cat_name: '',
        // 父级分类的Id，默认为 0，表示要添加的是一级分类
        cat_pid: 0,
        // 即将添加的新分类的等级，默认为0， 表示要添加一级分类
        cat_level: 0
      },
      // 添加表单的验证规则对象
      addFormRules: {
        cat_name: [{ required: true, message: '请填写分类名称', trigger: 'blur' }]
      },
      // 父级分类的可选列表数据
      parentCateList: [],
      // 被选中的分类Id的数组
      selectedCateList: [],
      // 配置级联选择框的节点对应关系
      cascaderConfig: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 根据分页，获取分类列表数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败！')
      this.cateList = res.data.result
      this.total = res.data.total
      console.log(res)
    },
    // 页码值变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮，展示添加分类对话框
    async showAddDialog() {
      // 先获取所有父级分类的数据列表
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类失败！')
      // 把父级分类数据，挂载到data中
      this.parentCateList = res.data
      console.log(res.data)
      this.addDialogVisible = true
    },
    // 只要级联选择框的选中项，发生了变化，就会触发 这个函数
    handleChange() {
      console.log(this.selectedCateList)
      if (this.selectedCateList.length === 0) {
        // 证明没有选中任何父级分类
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      } else {
        // 选中了父级分类
        // 父分类的Id
        this.addForm.cat_pid = this.selectedCateList[this.selectedCateList.length - 1]
        // 等级
        this.addForm.cat_level = this.selectedCateList.length
      }
    },
    // 点击按钮，添加新分类
    addNewCate() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post('categories', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败！')
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addDialogVisible = false
      })
    },
    // 重置表单项
    resetForm() {
      this.$refs.addFormRef.resetFields()
      this.selectedCateList = []
      // 格外注意：一定要清理干净
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    }
  }
}
