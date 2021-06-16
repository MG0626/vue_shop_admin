<template>
  <div class="roles">
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="handleAddRole">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="list" border v-loading="loading">
        <!-- 展开列表区域 -->
        <el-table-column align="center" width="40" type="expand">
          <template v-slot="scope">
            <el-row
              v-for="item1 in scope.row.children"
              :key="item1.id"
              class="one"
            >
              <!-- 一级 -->
              <el-col :span="4">
                <el-tag closable @close="handleTagClose(scope.row.id, item1.id, scope.row.children)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right" style="margin-left: 5px;"></i>
              </el-col>
              <!-- 二级和三级 -->
              <el-col :span="20">
                <el-row
                  class="two"
                  v-for="item2 in item1.children"
                  :key="item2.id">
                  <el-col :span="5" >
                    <el-tag closable type="success" @close="handleTagClose(scope.row.id, item2.id, item1.children)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right" style="margin-left: 5px;"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col class="three" :span="19" >
                    <div
                      v-for="item3 in item2.children"
                      :key="item3.id">
                      <el-tag closable type="warning" @close="handleTagClose(scope.row.id, item3.id, item2.children)">{{ item3.authName }}</el-tag>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 序号 -->
        <el-table-column
          align="center"
          width="60"
          label="序号"
          type="index"
        ></el-table-column>
         <el-table-column
          align="center"
          label="id"
          prop="id"
          width="80"
        ></el-table-column>
        <el-table-column
          align="center"
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="角色描述"
          prop="roleDesc"
        ></el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              @click="handleAssign(scope.row)"
              >分配角色</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="分配权限" :visible.sync="dialogTableVisible">
      <el-tree
      :data="treeList"
      show-checkbox
      node-key="id"
      ref="tree"
      :default-checked-keys="defKeys"
      :props="treeProps"></el-tree>

      <template #footer>
        <el-button @click="dialogTableVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="allotRights" size="small">确 定</el-button>
      </template>
    </el-dialog>

    <!-- 添加和修改角色信息的dialog -->
    <el-dialog 
      :title="currentTitle" 
      :visible.sync="modifyRoleVisible"
      center
      width="40%"
      @close="handleClose('modifyFormRef')">
      <!-- dialog对话框的内容主体 -->
      <div class="body">
        <el-form 
          :model="roleInfo" 
          label-width="100px"
          ref="modifyFormRef"
          :rules="modifyRolerules">
          <el-form-item
            prop="roleName"
            label="角色名称"
          >
            <el-input v-model="roleInfo.roleName" size="mini"></el-input>
          </el-form-item>
          <el-form-item
            prop="roleDesc"
            label="角色描述"
          >
            <el-input v-model="roleInfo.roleDesc" size="mini"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="modifyRoleVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="modifyRoleInfo">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      // dialog开关
      dialogTableVisible: false,
      // 分配权限树结构数据
      treeList: [],
      // Tree 配置选项
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 当前打开dialog的权限节点id
      roleId: 0,
      // 默认选中的tree树节点数组
      defKeys: [],
      // 当前时在添加或修改角色
      currentTitle: '添加角色', 
      // 角色信息
      roleInfo: {},
      // 修改角色信息的dialog开关
      modifyRoleVisible: false,
      // 修改角色信息的验证规则
      modifyRolerules: {
        roleName: [{required: true, message: '角色名称不能为空！', trigger: 'blur'}]
      },
      // 触发loading的开关
      loading: true
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      // 打开loading开关
      this.loading = true;
      const result = await this.$http.get('/roles');
      if (result.meta.status !== 200) return this.$message.error('获取角色列表失败！');
      this.list = result.data;
      // 获取数据完成，关闭loading
      this.loading = false;
    },
    //添加角色 
    handleAddRole(){
      this.currentTitle = '添加角色';
      // 打开dialog
      this.modifyRoleVisible = true;
    },
    // 修改角色信息
    handleEdit(role) {
      // 保存当前打开dialog对应节点的id
      this.roleId = role.id;
      this.currentTitle = '修改角色信息';
      // 更新角色信息到对应的dialog中显示
      this.roleInfo = {
        roleName: role.roleName,
        roleDesc: role.roleDesc
      }
      // 打开开关
      this.modifyRoleVisible = true;
    },
    // 删除角色
    async handleDelete(index, role) {
      this.$confirm(`此操作将永久取消角色 '${role.roleName}', 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发起网络请求删除对应的权限
        const result = await this.$http.delete(`roles/${role.id}`);
        // 检查是否成功
        if(result.meta.status !== 200) return this.$message.error(`删除角色失败！`);
        // 成功，弹出提示
        this.$message.success(`删除角色 '${role.roleName}' 成功~`);
        // 更新页面dom
        this.list.splice(index, 1);
      }).catch(() => {
        // 点击取消是弹出提示
        this.$message({
          type: 'info',
          message: '已取消操作~'
        });          
      });
    },
    // 分配更新权限
    async handleAssign(role) {
      // 保存当前打开dialog对应节点的id
      this.roleId = role.id;
      // 获取tree树结构的数据
      const result = await this.$http.get('/rights/tree');
      if (result.meta.status !== 200) return this.$message.error('获取角色列表失败！');
      this.treeList = result.data;
      

      // 获取第三级权限节点的id，赋值到tree默认选中的defKeys，获取前先清空defKeys的数据，避免缓存着上一次数据
      this.defKeys = [];
      this.getLeafKeys(role, this.defKeys);
      // 打开dialog
      this.dialogTableVisible = true;
    },
    // tag标签删除的回调函数
    async handleTagClose(rolesId, rightId, rights){
      // rolesId: 角色id, rightId: 权限id, rights：权限列表
      // 弹出警告，确定就执行删除的网络请求
      this.$confirm(`此操作将永久取消该权限, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 对应下标值
          let index = 0;
          // 遍历比对，获得对应下标值
          for (let i = 0; i < rights.length; i++) {
            if(rights[i].id === rightId){
              index = i;
              break;
            }
          }
          // 发起网络请求删除对应的权限
          const result = await this.$http.delete(`roles/${rolesId}/rights/${rightId}`)
          // 检查是否成功
          if(result.meta.status !== 200) return this.$message.error(`权限 '${rights[index].authName}' 取消失败！`);
          // 成功，弹出提示
          this.$message.success(`权限 '${rights[index].authName}' 取消成功~`);
          // 更新页面dom
          rights.splice(index, 1);
        }).catch(() => {
          // 点击取消是弹出提示
          this.$message({
            type: 'info',
            message: '已取消操作~'
          });          
        });
    },

    // 通过递归获取所有三级权限节点的id
    getLeafKeys(node, arr){
      // node为传入权限节点的数据, arr为需要保存到的数组
      // 三级节点数据中没有children数组，有则不是第三级节点
      if(!node.children){
        /**
         * 递归函数需要有出口，必须要return，不然就是死循环，由于我们需要找到的是第三级节点，
         * 并且我们已经知道第三级节点中没有children，这就是出口，找到第三级节点的id，就可以return出去了
         */
        return arr.push(node.id);
      }

      // // 不是第三级节点，则继续执行该函数
      node.children.forEach(item => {
        this.getLeafKeys(item, arr);
      });
    },
    // 点击为角色添加对应权限
    async allotRights(){
      // 获取所有已选中节点的id和半选中的节点的id(当第三级没有被全选中时，半选中则指第一第二级节点)
      const keys = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ];
      // 把数组转化为字符串
      const idStr = keys.join(',');
      const result = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr});
      if(result.meta.status !== 200) return this.$message.error('分配权限失败！');
      this.$message.success('分配权限成功~');
      // 关闭dialog
      this.dialogTableVisible = false;
      // 重新获取数据
      this.getRoleList();
    },
    // 关闭dialog回调函数
    handleClose(ref){
      this.$refs[ref].resetFields();
      // 清空数据
      this.roleInfo = {};
    },
    // 修改或添加角色发送网络请求的响应函数
    async modifyRoleInfo(){
      if (this.currentTitle === '修改角色信息') {
        const result = await this.$http.put(`roles/${this.roleId}`, this.roleInfo);
        if (result.meta.status !== 200) return this.$message.error('修改角色信息失败！');
        this.$message.success('修改角色信息成功~');
        // 获取最新数据，重新渲染数据
        this.getRoleList();
      }
      // 添加角色
      else{
        const result = await this.$http.post(`roles`, this.roleInfo);
        if (result.meta.status !== 201) return this.$message.error('添加角色失败！');
        this.$message.success('添加角色成功~');
        // 获取最新数据，重新渲染数据
        this.getRoleList();
      }
      // 最后关闭dialog
      this.modifyRoleVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.roles {
  .el-card {
    .el-table {
      margin-top: 15px;
      .el-row {
        // padding: 20px 20px 20px 0;
      }
      .one {
        &:first-child {
          border-top: 1px solid #eee;
        }
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
      }

      .two {
        &:last-child {
          border-bottom: 0;
        }
        padding: 10px 0;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
      }
      .three{
        display: flex;
        flex-wrap: wrap;
        div{
          padding: 5px 10px;
        }
      }
    }
  }
}
</style>
