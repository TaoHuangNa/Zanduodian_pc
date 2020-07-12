<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类的按钮 -->
      <el-button type="primary" @click="showAddDialog">添加分类</el-button>

      <!-- 分类的表格 -->
      <!-- https://github.com/MisterTaki/vue-table-with-tree-grid 表格组件的仓储地址 -->
      <tree-table :data="cateList" :columns="columns" border :selection-type="false" :expand-type="false" show-index index-text="#" class="tree-table">
        <!-- 操作的模板列 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
        <!-- 排序的模板列 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 是否有效的模板列 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color:#20B2AA;" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color:#F92672;" v-else></i>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-size="queryInfo.pagesize" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="resetForm">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 指定的是数据源 -->
          <!-- props 指定的是节点配置项 -->
          <!-- v-model 双向绑定到的数据，必须指定一个数组 -->
          <!-- change 处理函数，只要选中项改变，就会触发 change -->
          <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderConfig" v-model="selectedCateList" @change="handleChange" change-on-select clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import mix from './Cate-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>
