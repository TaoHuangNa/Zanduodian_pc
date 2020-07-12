<template>
  <div class="app-container">
    <div class="filter-container">
      <el-table :data="tableData" ref="tableData" style="width: 100%" border stripe>
        <el-table-column show-overflow-tooltip align="center" type="index" width="50" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip sortable min-width="100" align="center" prop="tasks_id" label="任务id"></el-table-column>
        <el-table-column show-overflow-tooltip sortable min-width="200" align="center" prop="url" label="链接">
        </el-table-column>
        <el-table-column show-overflow-tooltip sortable min-width="80" align="center" prop="target_times" label="次数"></el-table-column>
        <el-table-column show-overflow-tooltip sortable min-width="100" align="center" prop="tasks_name" label="要求"></el-table-column>
        <el-table-column show-overflow-tooltip sortable min-width="100" align="center" prop="cost" label="出价"></el-table-column>
        <el-table-column show-overflow-tooltip sortable min-width="120" prop="total_cost" align="center" label="费用总计"></el-table-column>
        <el-table-column show-overflow-tooltip sortable min-width="120" prop="state" align="center" label="状态"></el-table-column>
        <el-table-column show-overflow-tooltip sortable min-width="120" prop="ZFBAccount" align="center" label="付款账号"></el-table-column>
        <el-table-column show-overflow-tooltip sortable min-width="120" prop="ZFBName" align="center" label="付款人姓名"></el-table-column>
        <el-table-column show-overflow-tooltip sortable min-width="200" prop="image" align="center" label="付款成功截图">
          <template  slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.image[0]"
              :preview-src-list="scope.row.image">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="control" align="center" label="操作" fixed="right" min-width='180px'>
          <template slot-scope="scope">
            <el-button type="primary" @click='handleDetails(scope.$index, scope.row)'>通过</el-button>
            <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页表格 -->
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :current-page="currentPage"
                     :page-size="pageSize" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
      <el-dialog title="审批" :visible.sync="dialogFormVisible">
        <el-form :model="form" ref="form">
          <el-form-item v-show="!isPass" prop="reson" label="驳回原因" :label-width="formLabelWidth">
            <el-input v-model="form.reson" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item v-show="isPass" prop="member" label="是否任务会员" :label-width="formLabelWidth">
            <el-select v-model="form.member" placeholder="请选择是否任务会员">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  Tree,
  Dialog,
  Table,
  TableColumn,
  Pagination,
  MessageBox,
  Message,
  Image,
  Drawer
} from 'element-ui'
export default {
  name: 'member',
  components: {
    'el-table': Table, // 表格
    'el-table-column': TableColumn, // 表格列
    'el-pagination': Pagination, // 分页
    'el-dialog': Dialog, // 对话框
    'el-drawer': Drawer, // 抽屉
    'el-image': Image // 抽屉

  },
  data() {
    return {
      total: 0, // 总条数
      pageSize: 20, // 每页展示条数
      currentPage: 1, // 默认显示页数
      tableData: [], // 查询列表
      dialogFormVisible: false,
      form: {
        reson: '',
        member: ''
      },
      formLabelWidth: '120px',
      isPass: false,
      rowData: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取表格数据
    async getList() {
      let data = {
       page: this.page,
       page_size: this.page_size
      }
      const { data: res } = await this.$http.get('/api/check_tasks/', data)
      console.log(res)
      this.tableData = res.results
      this.total = res.count
    },
    // 查看
    handleDetails(index, row) {
      this.dialogFormVisible = true
      this.isPass = true
      this.rowData = row
    },
    // 审批
    handleEdit(index, row) {
      this.dialogFormVisible = true
      this.isPass = false
      this.rowData = row
    },
    submit() {
      if (this.isPass) { // 通过
        console.log(this.form)
        console.log(this.rowData)
        let data = {
          // tasks_id: this.rowData.tasks_id,
          type: this.form.member,
          state: '2'
        }
        const { data: res } = this.$http.patch(`/api/tasks/${this.rowData.tasks_id}/`, data)
      } else { // 驳回
        console.log(this.form)
        console.log(this.rowData)
        let data = {
          // tasks_id: this.rowData.tasks_id,
          remarks: this.form.reson,
          state: '3'
        }
        const { data: res } = this.$http.patch(`/api/tasks/${this.rowData.tasks_id}/`, data)
      }
      // this.$refs.form.resetFields() // 清除表单数据
      this.dialogFormVisible = false // 关闭弹框
      setTimeout(this.getList(), 2000)
      // this.getList()
    },
    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val
    },
    // 当前页数
    handleCurrentChange(val) {
      this.currentPage = val
      this.getLists()
    }
  }
}
</script>
<style>

</style>
