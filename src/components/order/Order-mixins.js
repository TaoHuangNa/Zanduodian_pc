// 导入 省市区县的数据
import cityOptions from './city_data2017_element.js'

export default {
  data() {
    return {
      // 查询条件对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 订单列表
      orderList: [],
      // 总数据条数
      total: 0,
      // 控制物流对话框的显示与隐藏
      wlDialogVisible: false,
      // 物流进度
      wlList: [],
      // 控制地址对话框的显示与隐藏
      addressDialogVisible: false,
      // 修改地址的表单数据对象
      addressForm: {
        area: '',
        address: ''
      },
      addressFormRules: {
        area: [{ required: true, message: '请填写省市区县', trigger: 'blur' }],
        address: [{ required: true, message: '请填详细地址', trigger: 'blur' }]
      },
      // 省市区县的数据
      cityOptions,
      // 选中的省市区县
      selectedArea: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败！')
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(res)
    },
    // pageSize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 展示物流进度对话框
    async showWLDialog() {
      // 先获取物流数据
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) return this.$message.error('获取物流进度失败！')
      console.log(res)
      this.wlList = res.data
      this.wlDialogVisible = true
    },
    // 省市区县改变了
    changeProvince() {
      console.log(this.selectedArea)
    }
  }
}
