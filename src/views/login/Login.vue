<template>
  <div class="login">
    <div class="login-wrapper">
      <div class="title">LOGIN</div>
      <div class="content">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <!-- 账号 -->
          <el-form-item label="用户名" prop="username">
            <el-input
              type="text"
              v-model="ruleForm.username"
              autocomplete="off"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
        </el-form>

        <div class="btn">
          <!-- 登录和重置 -->
          <el-button type="primary" @click="submitForm" size="mini"
            >登录</el-button
          >
          <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        username: 'admin',
        password: '123456',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在3到10个字符之间',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在6到15个字符之间',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    async submitForm() {
      const result = await this.$http.post('/login', this.ruleForm);
      if (result.meta.status === 200) {
        // 保存获取的token和时间戳
        const info = {
          token: result.data.token,
          time: Date.now()
        }
        window.localStorage.setItem('info', JSON.stringify(info));
        // 保存用户信息到localStorage
        const userInfo = {
          id: result.data.id,
          username: result.data.username,
          mobile: result.data.mobile,
          email: result.data.email
        }
        // JSON.stringify(userInfo)对象转字符串
        window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
        console.log(window.localStorage.getItem('userInfo'));
        // 弹出登录成功提示
        this.$message({
          showClose: true,
          message: `${userInfo.username}，欢迎回来~`,
          type: 'success',
        });
        // 跳转到首页
        this.$router.push('/');
      } else {
        this.$message({
          showClose: true,
          message: '账号或密码有误，请检查！',
          type: 'error',
        });
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  width: 100vw;
  height: 100vh;
  background-color: #d3dce6;
  position: relative;

  .login-wrapper {
    width: 30%;
    height: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 25px;

    .title {
      width: 100%;
      text-align: center;
      font-size: 30px;
      font-weight: 500;
      padding-bottom: 0.5em;
    }

    .content {
      padding-right: 50px;
      box-sizing: border-box;

      .btn {
        margin-right: -50px;
        text-align: center;
      }
    }
  }
}
</style>
