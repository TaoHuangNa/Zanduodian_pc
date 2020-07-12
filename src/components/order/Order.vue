<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" title="修改订单地址" @click="addressDialogVisible=true"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" title="物流信息" @click="showWLDialog"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 物流信息对话框 -->
    <el-dialog title="查看物流进度" :visible.sync="wlDialogVisible" width="50%">
      <el-steps direction="vertical" :active="0">
        <el-step v-for="(item, i) in wlList" :key="i" :title="item.time" :description="item.context"></el-step>
      </el-steps>
    </el-dialog>

    <!-- 省市区县对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressDialogVisible" width="50%">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="area">
          <el-cascader :options="cityOptions" v-model="selectedArea" @change="changeProvince" change-on-select style="width: 100%;">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="addressForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mix from './Order-mixins.js'

export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
</style>
