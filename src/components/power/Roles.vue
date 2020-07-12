<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-button type="primary">添加角色</el-button>

      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开行的列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 注意： scope.row 是角色 -->
            <!-- 注意： scope.row.children 是当前角色下的所有权限 -->
            <!-- 通过 循环 scope.row.children 数组，把所有一级权限，绘制出来 -->
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :style="{'border-bottom': '1px solid #eee', 'border-top': i1 === 0 ? '1px solid #eee' : ''}" class="centerRow">
              <!-- 这一列，专门渲染 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRight(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 还剩余 19 列，供 二三级权限平分 -->
              <el-col :span="19">
                <!-- 通过一个 row 把 后 19 列评分成了 24 列 -->
                <!-- 其中，前 5 列放二级权限，后 19 列放三级权限 -->
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :style="{'border-top': i2 === 0 ? '' : '1px solid #eee'}" class="centerRow">
                  <!-- 放二级权限 -->
                  <el-col :span="6">
                    <el-tag closable type="success" @close="removeRight(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 放三级权限 -->
                  <el-col :span="18">
                    <el-tag closable type="warning" v-for="item3 in item2.children" :key="item3.id" @close="removeRight(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="resetSetRightDialog">
      <!-- data 用于指定数据源 -->
      <!-- props 用于指定树形组件的配置对象 -->
      <!-- show-checkbox 展示复选框 -->
      <!-- node-key 指定每个节点唯一的标识符 -->
      <!-- default-expand-all 默认展开所有节点 -->
      <el-tree ref="tree" :data="rightTree" :props="treeConfig" show-checkbox node-key="id" default-expand-all :default-checked-keys="defaultCheckedKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRight">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import mix from './Roles-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px 5px;
}

.centerRow {
  display: flex;
  align-items: center;
}
</style>
