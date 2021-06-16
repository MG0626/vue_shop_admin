<template>
  <div class="users">
    <!-- 卡片视图 -->
    <el-card>
      <el-row  :gutter="20">
        <el-col :span="7">
          <el-input 
            placeholder="请输入内容" 
            size="mini" 
            v-model="queryInfo.query" 
            clearable 
            @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="mini" @click="addUserVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表表格 -->
      <el-table :data="users" border stripe v-loading="loading">
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="id" label="id"></el-table-column>
        <el-table-column align="center" prop="username" label="姓名"></el-table-column>
        <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
        <el-table-column align="center" prop="mobile" label="电话"></el-table-column>
        <el-table-column align="center" prop="role_name" label="角色"></el-table-column>
        <el-table-column align="center" prop="mg_state" label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeUserState(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template v-slot="scope">
            <el-button 
              type="primary" 
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button 
              type="danger" 
              size="mini" 
              @click="handleDelete(scope.row.id, scope.row.username)">删除</el-button>
            <el-button 
              type="warning" 
              size="mini"
              @click="handleAssign(scope.row)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域，自定义组件 -->
      <pagination 
        :info="queryInfo"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :total="total"/>
    </el-card>

    <!-- 添加用户的dialog -->
    <el-dialog 
      title="添加用户" 
      :visible.sync="addUserVisible"
      center
      width="40%"
      @close="handleClose('addFormRef')">
      <!-- dialog对话框的内容主体 -->
      <div class="body">
        <el-form 
          :model="userInfo" 
          label-width="70px"
          ref="addFormRef"
          :rules="rules">
          <el-form-item
            prop="username"
            label="用户名"
          >
            <el-input v-model="userInfo.username" size="mini"></el-input>
          </el-form-item>
          <el-form-item
            prop="password"
            label="密码"
          >
            <el-input v-model="userInfo.password" size="mini"></el-input>
          </el-form-item>
          <el-form-item
            prop="email"
            label="邮箱"
          >
            <el-input v-model="userInfo.email" size="mini"></el-input>
          </el-form-item>
          <el-form-item
            prop="mobile"
            label="手机号"
          >
            <el-input v-model="userInfo.mobile" size="mini"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="addUserVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addNewUser" size="small">确 定</el-button>
      </template>
    </el-dialog>

    <!-- 修改用户信息的dialog -->
    <el-dialog 
      title="修改用户信息" 
      :visible.sync="modifyUserVisible"
      center
      width="40%"
      @close="handleClose('modifyFormRef')">
      <!-- dialog对话框的内容主体 -->
      <div class="body">
        <el-form 
          :model="userInfo" 
          label-width="70px"
          ref="modifyFormRef"
          :rules="rules">
          <el-form-item
            prop="username"
            label="用户名"
          >
            <el-input v-model="userInfo.username" size="mini" disabled></el-input>
          </el-form-item>
          <el-form-item
            prop="email"
            label="邮箱"
          >
            <el-input v-model="userInfo.email" size="mini"></el-input>
          </el-form-item>
          <el-form-item
            prop="mobile"
            label="手机号"
          >
            <el-input v-model="userInfo.mobile" size="mini"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="modifyUserVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="modifyUser" size="small">确 定</el-button>
      </template>
    </el-dialog>

    <!-- 分配角色的dialog -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignUserVisible"
      center
      width="40%"
      class="assign"
      @close="handleAssignClose"
      >
      <el-row>
        <el-col>当前用户名称： {{currentUserInfo.username}}</el-col>
        <el-col>当前分配的角色： {{currentUserInfo.role_name}}</el-col>
        <el-col>
          <span>当前分配的新角色：</span>
          <el-select 
            v-model="currentSelect"
            value-key="id"
            placeholder="请选择"
            size="mini">
            <el-option 
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item"
              ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <template #footer>
        <el-button @click="assignUserVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="handleAssignRole">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '../../components/pagination/Pagination.vue';

export default {
  data() {
    /**
     * 自定义验证规则
     * rule：验证规则, 
     * value：待验证的value值, 
     * callback：回调函数，不符合验证规则则需要new Error('')，验证通过就直接调用
     */
    var checkMobile = (rule, value, callback) => {
      // 判断是否为空
      if (!value) return callback(new Error('手机号不能为空！'));
      // 手机号码验证的正则表达式
      const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      // 检查是否验证通过 test() 方法用于检测一个字符串是否匹配某个模式.
      if(!regMobile.test(value)) return callback(new Error('请输入正确的手机号！'));
      callback();
    }
    return {
      // 获取用户列表的请求参数
      queryInfo: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 5,
      },
      // 总条数
      total: 0,
      // 用户列表
      users: [],
      // 触发loading的开关
      loading: true,
      // 添加用户弹出dialog的开关
      addUserVisible: false,
      // 修改用户弹出dialog的开关
      modifyUserVisible: false,
      // 添加新用户的信息
      userInfo: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 验证新用户的信息
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 分配角色dialog的开关
      assignUserVisible: false,
      // 当前操作的用户信息
      currentUserInfo: {
        id: 0,
        username: '',
        role_name: ''
      },
      // select选择器角色列表
      roleList: [],
      // select当前选中的选项
      currentSelect: null
    };
  },
  created() {
    // 获取用户列表数据
    this.getUserList();
  },
  methods: {
    // 发送网络请求获取用户列表数据
    async getUserList() {
      // 打开loading提示
      this.loading = true;
      const result = await this.$http.get('users', { params: this.queryInfo });
      // 获取总条数
      this.total = result.data.total;
      // 获取用户列表数据
      this.users = result.data.users;
      // 数据加载完成，关闭loading
      this.loading = false;
    },
    // switch开关改变状态的回调函数
    async changeUserState(user){
      // 获取当前改变的用户id和最新state，其中{ id, mg_state: state }是解构赋值，mg_state: state是取别名
      const { id, mg_state: state, username } = user;
      // 发送网络请求改变状态
      const result = await this.$http.put(`users/${id}/state/${state}`);
      if (result.meta.status !== 200) {
        // 进入这里则说明更新失败了，由于界面swtich开关状态已经改变，所以这里修改回来，同时弹出提示
        user.mg_state = !state;
        return this.$message.error(`更新用户 '${username}' 状态失败!`);
      }
      this.$message.success(`更新用户 '${username}' 状态成功~`);
    },
    // 监听pagesize改变，分页切显示多少条的事件
    handleSizeChange(newSize){
      // 更改最新的每页显示条数
      this.queryInfo.pagesize = newSize;
      // 发送网络请求获取最新的数据
      this.getUserList();
    },
    // 监听页码改变触发的事件
    handleCurrentChange(newPage){
      // 更新最新的页码
      this.queryInfo.pagenum = newPage;
      // 发送网络请求获取最新的数据
      this.getUserList();
    },
    // 添加新用户
    addNewUser(){
      // 表单的预校验
      this.$refs.addFormRef.validate(async (valid) => {
        // 为false是为校验不通过，不能继续执行
        if(!valid) return;
        const result = await this.$http.post('users', this.userInfo);
        if (result.meta.status !== 201) {
          return this.$message.error('添加用户失败!');
        }
        this.$message.success('添加用户成功~');
        //关闭dialog
        this.addUserVisible = false;
        // 添加成功之后获取最新数据
        this.getUserList();
      });
    },
    // 关闭dialog回调的事件
    handleClose(ref){
      this.$refs[ref].resetFields();
      // 清空数据
      this.userInfo = {};
    },
    // 编辑按钮响应事件
    async handleEdit(user){
      this.modifyUserVisible = true;
      // 获取对应用户的数据
      const { id, username, mobile, email } = user;
      // 赋值到data
      this.userInfo = {
        id,
        username, 
        mobile, 
        email
      }
    },
    // 修改用户数据
    modifyUser(){
      // 表单的预校验
      this.$refs.modifyFormRef.validate(async (valid) => {
        // 为false是为校验不通过，不能继续执行
        if(!valid) return;
        const result = await this.$http.put(`users/${this.userInfo.id}`, this.userInfo);
        console.log(result);
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg);
        this.$message.success('修改用户信息成功~');
        //关闭dialog
        this.modifyUserVisible = false;
        // 添加成功之后获取最新数据
        this.getUserList();
      });
    },
    // 删除用户按钮响应函数
    handleDelete(id, name){
      // 弹出警告，确定就执行删除的网络请求
      this.$confirm(`此操作将永久删除该用户 '${name}', 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 发起删除的网络请求
          const { meta } = await this.$http.delete(`users/${id}`);
          // 判断是否删除成功
          if (meta.status !== 200) return this.$message.error('删除用户失败!');
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 最后更新用户列表
          this.getUserList();
        }).catch(() => {
          // 点击取消是弹出提示
          this.$message({
            type: 'info',
            message: '已取消删除~'
          });          
        });
    },
    async handleAssign(info){
      // 获取当前用户的名字和角色
      const { id, username, role_name } = info;
      this.currentUserInfo = {
        id,
        username,
        role_name
      }
      // 获取角色列表roleList
      const result = await this.$http.get('/roles');
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg);
      this.roleList = result.data.map(item => {
        return {
          id: item.id,
          roleName: item.roleName
        }
      })
      console.log(this.roleList);
      // 打开分配角色的dialog
      this.assignUserVisible = true;
    },
    // 重新分配角色
    async handleAssignRole(){
      if(!this.currentSelect) return this.$message.error('请选择要分配的角色！');
      const result = await this.$http.put(`/users/${this.currentUserInfo.id}/role`, { rid: this.currentSelect.id });
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg);
      this.$message.success('分配用户新角色成功~');
      // 关闭分配角色的dialog
      this.assignUserVisible = false;
      // 重新获取数据
      this.getUserList();
    },
    // 关闭dialog时的回调函数
    handleAssignClose(){
      // 清空选中的内容，避免有缓存影响下一次选择
      this.currentSelect = null;
    }
  },
  components: {
    Pagination
  }
};
</script>

<style lang="less" scoped>
.users {
  .el-card {
    padding: 10px;
    .el-table{
      margin-top: 20px;
      font-size: 12px;
    }
    .el-pagination{
      margin-top: 15px;
      text-align: center;
    }
  }
  .el-dialog {
    .body{
      .el-form{
        padding-right: 15px;
      }
    }
  }

  .assign{
    .el-row{
      .el-col{
        padding-top: 15px;
        .el-select{
          width: 150px;
        }
      }
    }
  }
}
</style>
