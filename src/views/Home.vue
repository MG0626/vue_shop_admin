<template>
  <div class="home">
    <el-aside width="200px">Aside</el-aside>
    <el-container>
      <el-header>
        <div>Header</div>
        <div class="exit">
          <el-button @click="LogOut">退出</el-button>
        </div>
      </el-header>
      <el-main>Main</el-main>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  methods: {
    LogOut() {
      // 清空token
      window.localStorage.removeItem('token');
      // 弹出提示
      this.$message({
        showClose: true,
        message: '退出成功，期待下一次见面~',
        type: 'success',
      });
      // 跳转到登录页面
      this.$router.push('/login');
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  width: 100vw;
  height: 100vh;
  display: flex;

  .el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  .el-container {
    height: 100vh;
    .el-header {
      background-color: #b3c0d1;
      color: #333;
      text-align: center;
      line-height: 60px;
      display: flex;
      justify-content: space-between;
    }

    .el-main {
      background-color: #e9eef3;
      color: #333;
      text-align: center;
      line-height: 160px;
    }
  }
}
</style>
