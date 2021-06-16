<template>
  <div class="categories">
    <el-card>
      <el-button type="primary" @click="addBtn">添加分类</el-button>
      <!-- 表格区域 -->
      <el-table 
        :data="categories" 
        border 
        stripe 
        row-key="cat_id"
        :tree-props="{children: 'children'}"
        v-loading="loading">
        <el-table-column 
          width="80"
          align="center">
        </el-table-column>
        <el-table-column 
          prop="cat_name" 
          label="分类名称"
          align="center"></el-table-column>
        <el-table-column 
          prop="cat_id" 
          label="id"
          align="center"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" align="center" >
          <template v-slot="scope">
            <i :class="!scope.row.cat_deleted ? 'el-icon-success' : 'el-icon-error'"></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序"  align="center">
          <template v-slot="scope">
            <el-tag :type="scope.row.cat_level | levelType">{{ scope.row.cat_level | level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row.cat_id, scope.row.cat_name)">删除</el-button>
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

    <!-- 添加分类的dialog -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateVisible"
      center
      width="30%"
      class="assign"
      @close="handleClose"
      >
      <el-form :rules="rules" ref="addFormRef" :model="categorieInfo">
        <el-form-item label="分类名称" prop="cat_name" label-width="80px">
          <el-input type="text" v-model="categorieInfo.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" label-width="80px">
          <el-cascader
            v-model="categorieInfo.cascaderValue"
            style="width: 100%"
            :options="options"
            :props="props"
            placeholder="请选择，为空默认为一级分类"
            clearable></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addCateVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </template>
    </el-dialog>

    <!-- 添加分类的dialog -->
    <el-dialog
      title="修改分类信息"
      :visible.sync="modifyCateVisible"
      center
      width="30%"
      class="assign"
      @close="handleClose"
      >
      <el-form ref="addFormRef" :model="categorieInfo">
        <el-form-item label="当前分类名称：" prop="cat_name" label-width="130px">{{categorieInfo.currentName}}</el-form-item>
        <el-form-item 
          label="新分类名称：" 
          prop="cat_name" 
          :rules="[{required: true, message: '分类名称不能为空！', trigger: 'blur'}]"
          label-width="130px">
          <el-input type="text" v-model="categorieInfo.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modifyCateVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="handleConfirmModify">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '../../components/pagination/Pagination.vue';
  export default {
    data(){
      return {
        // 获取用户列表的请求参数
        queryInfo: {
          // 级别的分类,3为获取三级的列表
          type: 3,
          // 当前页码
          pagenum: 1,
          // 每页显示条数
          pagesize: 5
        },
        // 总条数
        total: 0,
        // 分类列表
        categories: [],
        // 触发loading的开关
        loading: true,
        // 添加分类的dialog开关
        addCateVisible: false,
        // 修改分类信息的dialog开关
        modifyCateVisible: false,
        // 级联选择器的配置
        props: { 
          checkStrictly: true, 
          expandTrigger: 'hover', 
          value: 'cat_id', 
          label: 'cat_name'
        },
        // 级联选择器的options
        options: [],
        // 验证规则
        rules: {
          cat_name: [{required: true, message: '分类名称不能为空！', trigger: 'blur'}]
        },
        categorieInfo:{
          // 分类id
          cat_id: 0,
          cat_name: '',
          currentName: '',
          // 级联选中的值
          cascaderValue: []
        }
      }
    },
    created(){
      // 发送请求获取商品分类列表
      this.getGoodsCategories();
    },
    methods: {
      // 请求商品分类列表
      async getGoodsCategories(){
        // 打开loading提示
        this.loading = true;
        const result = await this.$http.get('/categories', { params: this.queryInfo });
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg);
        this.categories = result.data.result;
        this.total = result.data.total;
        // 数据加载完成，关闭loading
        this.loading = false;
      },
      // 监听组件Pagination发送回来的事件 监听pagesize改变，分页切显示多少条的事件
      handleSizeChange(newSize){
        // 改变每页显示的条数
        this.queryInfo.pagesize = newSize;
        // 获取对应数据
        this.getGoodsCategories();
      },
      // 监听组件Pagination发送回来的事件 监听页码改变触发的事件
      handleCurrentChange(newPage){
        // 修改为最新的页码
        this.queryInfo.pagenum = newPage;
        // 重新获取数据
        this.getGoodsCategories();
      },
      // 添加分类按钮的点击事件
      async addBtn(){
        // 获取数据
        const result = await this.$http.get('/categories', { params: { type: 2 } });
        console.log(result);
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg);
        this.options = result.data;
        // 打开添加分类dialog
        this.addCateVisible = true;
      },
      // 编辑
      handleEdit(info){
        const { cat_id, cat_name } = info;
        this.categorieInfo = {
          cat_id,
          currentName: cat_name
        };
        // 打开dialog
        this.modifyCateVisible = true;
      },
      // 删除
      async handleDelete(id, name){
        // 弹出警告，确定就执行删除的网络请求
        this.$confirm(`此操作将永久删除该分类 '${name}', 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 发送网络请求删除该分类
          const { meta } = await this.$http.delete(`categories/${id}`);
          // 判断是否删除成功
          if (meta.status !== 200) return this.$message.error(meta.msg);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 更新分类列表
          this.getGoodsCategories();
        }).catch(() => {
          // 点击取消是弹出提示
          this.$message({
            type: 'info',
            message: '已取消删除~'
          });          
        });
      },
      // 添加分类确定触发的事件
      async handleConfirm(){
        // 表单的预校验
        this.$refs.addFormRef.validate(async (valid) => {
          // 为false是为校验不通过，不能继续执行
          if(!valid) return;
          const { cat_name, cascaderValue } = this.categorieInfo;
          // 获取请求数据的参数
          const data = {
            // 分类父 ID
            cat_pid: cascaderValue[cascaderValue.length - 1] || 0,
            // 分类名称
            cat_name,
            // 分类层级
            cat_level: cascaderValue.length
          }
          // 发送网络请求添加分类
          const { meta } = await this.$http.post('categories', data);
          // 判断是否添加成功
          if (meta.status !== 201) return this.$message.error(meta.msg);
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
          // 更新分类列表
          this.getGoodsCategories();
          // 关闭添加分类的dialog开关
          this.addCateVisible = false;
        });
      },
      // 添加分类关闭回调的函数
      handleClose(){
        // 清空选中的值
        this.categorieInfo = {};
        this.$refs.addFormRef.resetFields();
      },
      // 修改分类信息
      async handleConfirmModify(){
        // 发送网络请求修改分类
        const { meta, data:res } = await this.$http.put(`categories/${this.categorieInfo.cat_id}`, {cat_name: this.categorieInfo.cat_name});
        // 判断是否修改成功
        if (meta.status !== 200) return this.$message.error(meta.msg);
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
        // 更新分类列表
        this.getGoodsCategories();
        // 关闭dialog开关
        this.modifyCateVisible = false;
      }
    },
    components: {
      Pagination 
    },
    filters: {
      level(value){
        let levelName = '一级';
        switch (value) {
          case 1:
            levelName = '二级'
            break;
          case 2:
            levelName = '三级'
            break;
        }
        return levelName;
      },
      // tag type
      levelType(value){
        let levelName = '';
        switch (value) {
          case 1:
            levelName = 'success'
            break;
          case 2:
            levelName = 'warning'
            break;
        }
        return levelName;
      }
    }
  }
</script>

<style lang="less" scoped>
.categories{
  .el-table{
    margin-top: 15px;
    .el-icon-success{
      color: lightgreen;
    }
    .el-icon-error{
      color: red;
    }
  }
}
</style>