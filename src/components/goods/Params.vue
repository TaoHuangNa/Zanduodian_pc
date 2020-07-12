<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示框 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>

      <!-- 商品分类选择区域 -->
      <div class="cascader">
        <span>选择商品分类：</span>
        <!-- 分类的级联选择框 -->
        <el-cascader expand-trigger="hover" :options="cateList" :props="cascaderConfig" v-model="selectedCateList" @change="cascaderChanged">
        </el-cascader>
      </div>

      <!-- Tab 标签页区域 -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isDisable" @click="addDialogVisible=true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                {{scope.row}}
                <hr/>
                <!-- 通过循环，把 attr_vals 数组，渲染为每一个 tag 标签 -->
                <el-tag closable v-for="(item, i) in scope.row.attr_vals" :key="i" @close="removeTag(scope.row, i)">{{item}}</el-tag>
                <!-- 通过输入框，添加新的 tag 标签 -->
                <el-input size="small" class="tagInput" v-if="scope.row.tagInputVisible" ref="saveTagInput" @blur="loseBlur(scope.row)" @keyup.enter.native="loseBlur(scope.row)" v-model="scope.row.tagInputValue"></el-input>
                <!-- 点击按钮，展示出文本输入框 -->
                <el-button size="small" v-else @click="showTagInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isDisable" @click="addDialogVisible=true">添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 通过循环，把 attr_vals 数组，渲染为每一个 tag 标签 -->
                <el-tag closable v-for="(item, i) in scope.row.attr_vals" :key="i" @close="removeTag(scope.row, i)">{{item}}</el-tag>
                <!-- 通过输入框，添加新的 tag 标签 -->
                <el-input size="small" class="tagInput" v-if="scope.row.tagInputVisible" ref="saveTagInput" @blur="loseBlur(scope.row)" @keyup.enter.native="loseBlur(scope.row)" v-model="scope.row.tagInputValue"></el-input>
                <!-- 点击按钮，展示出文本输入框 -->
                <el-button size="small" v-else @click="showTagInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog :title="activeName === 'many' ? '添加动态参数' : '添加静态属性'" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 添加的表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item :label="activeName === 'many' ? '动态参数' : '静态属性'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mix from './Params-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
.cascader {
  margin: 15px 0;
}
.el-tag {
  margin: 5px;
}
.tagInput {
  width: 120px;
}
</style>
