<template>
  <!-- 推荐：把组件中，最外层的div, 起的类名格式，为   组件名称-container   -->
  <div class="login-container">
    <!-- 头像区域 -->
    <div class="avatar">
      <img src="../assets/logo.png" alt="">
    </div>

    <!-- 登录表单 -->
    <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" class="loginForm">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username">
          <i slot="prefix" class="iconfont icon-user"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" @keyup.enter.native="login">
          <i slot="prefix" class="iconfont icon-3702mima"></i>
        </el-input>
      </el-form-item>
      <el-form-item class="btns">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入当前 .vue 文件配套的行为
import mix from './Login-mixins.js'
export default {
  // 把外界导入的行为，通过 mixins 属性，混入到当前组件中生效
  mixins: [mix]
}
</script>

<style lang="less" scoped>
.login-container {
  width: 450px;
  height: 304px;
  background-color: #fff;
  border-radius: 4px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 7px;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.loginForm {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
