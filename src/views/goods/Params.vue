<template>
  <div class="params">
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon>
      </el-alert>
      <!-- 级联选择器区域 -->
      <el-row  type="flex" align="middle" >
        <el-col :span="2.5" >选择商品分类：</el-col>
        <el-col :span="5">
          <el-cascader
          v-model="selectKeys"
            style="width: 100%"
            :options="options"
            :props="props"
            placeholder="请选择，为空默认为一级分类"
            :show-all-levels="false"
            clearable
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>

      <!-- 标签页 -->
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many" :disabled="isDisabled">
          <el-button type="primary" size="mini" @click="dialogVisible = true" :disabled="isDisabled">添加参数</el-button>
          <!-- 动态表格区域 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column align="center" type="expand">
              <template v-slot="scope">
                <el-row>
                  <el-col 
                    :span="5" 
                    v-for="(item, index) in scope.row.attr_vals" 
                    :key="index"
                    style="margin: 5px 0">
                    <el-tag closable @close="handleTagClose(scope.row, index)">{{item}}</el-tag>
                  </el-col>
                  
                  <el-col :span="2" style="margin: 5px 0">
                    <el-input
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button v-else type="primary" size="small" @click="showInput(scope.row)">添加属性值</el-button>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
            <el-table-column align="center" label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column align="center" label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="handleDelete(scope.row.attr_id, scope.row.attr_name)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only" :disabled="isDisabled">
          <el-button type="primary" size="mini" @click="dialogVisible = true" :disabled="isDisabled">添加参数</el-button>
          <!-- 静态表格区域 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column align="center" type="expand">
              <template v-slot="scope">
                <el-row>
                  <el-col 
                    :span="5" 
                    v-for="(item, index) in scope.row.attr_vals" 
                    :key="index"
                    style="margin: 5px 0">
                    <el-tag closable @close="handleTagClose(scope.row, index)">{{item}}</el-tag>
                  </el-col>
                  
                  <el-col :span="2" style="margin: 5px 0">
                    <el-input
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button v-else type="primary" size="small" @click="showInput(scope.row)">添加属性值</el-button>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
            <el-table-column align="center" label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column align="center" label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="handleDelete(scope.row.attr_id, scope.row.attr_name)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加/编辑参数 -->
    <el-dialog width="30%" :title="isEdit ? '编辑参数' : '添加参数'" :visible.sync="dialogVisible" @close="handleClose">
      <el-form :model="attributeInfo" ref="addFormRef">
        <el-form-item 
          label="参数名" 
          label-width="80px"
          prop="attributeName"
          :rules="[{required: true, message: '名称不能为空！', trigger: 'blur'}]">
          <el-input v-model="attributeInfo.attributeName"></el-input>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        // 级联选择器的配置
        props: { 
          expandTrigger: 'hover', 
          value: 'cat_id', 
          label: 'cat_name'
        },
        // 级联选择器的options
        options: [],
        // 级联选择器双向绑定的数据
        selectKeys: [],
        // 被激活的标签页
        activeName: 'many',
        // 动态参数列表数据
        manyTableData: [],
        // 静态参数列表数据
        onlyTableData: [],
        // dialog开关
        dialogVisible: false,
        // 添加的参数名
        attributeInfo: {
          attributeName: '',
          // 属性id
          attrId: 0
        },
        // 是否为编辑参数
        isEdit: false,
      }
    },
    created(){
      // 获取商品分类的列表
      this.getCategories();
    },
    methods: {
      async getCategories(){
        // 获取数据
        const result = await this.$http.get('/categories', { params: { type: 3 } });
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg);
        this.options = result.data;
      },
      // 获取参数列表数据
      async getParamsData(){
        // 如果分类id不为undefined才发起网络请求
        if (!this.categorieId) return ;
        const result = await this.$http.get(`categories/${this.categorieId}/attributes`, { params: { sel: this.activeName }});       
        console.log(result);
        if(result.meta.status !== 200) return this.$message.error(result.meta.msg);
        // 把参数属性值从字符串转化为数组，通过逗号分割
        result.data.forEach(item => {
          // 判断参数中的attr_vals是否为空，为空就返回空数组
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
          // 显示添加参数属性值输入框的开关
          item.inputVisible = false;
          // 输入的属性值
          item.inputValue = ''
        })
        if (this.activeName === 'only') {
          this.onlyTableData = result.data;
        } else{
          this.manyTableData = result.data;
        }
      },
      // 级联选择器选中时的回调
      handleChange(value){
        // 判断是否为清空选项，如果为清空选项，则清空原来的列表数据
        if(value.length === 0) {
          this.onlyTableData = this.manyTableData = null;
          this.activeName = 'many';
          return;
        }
        /**
         * 由于我们只需要第三级分类，所以当selectKeys的length不为3
         * (selectKeys为数组，索引0为第一级，以此类推)时,就不符合要求
         */
        if (this.selectKeys.length !== 3) {
          this.selectKeys = [];
          this.$message.error('只能选择第三级分类！');
        }
        // 获取tab数据
        this.getParamsData();
      },
      // tab页被点击后的回调
      handleTabClick(){
        // 获取tab数据
        this.getParamsData();
      },
      // dialog点击确认触发
      handleConfirm(){
        // 表单的预校验
        this.$refs.addFormRef.validate(async (valid) => {
          // 为false是为校验不通过，不能继续执行
          if(!valid) return;
          // 获取请求数据的参数
          console.log(this.attributeInfo.attr_val);
          const data = {
            // 参数名称
            attr_name: this.attributeInfo.attributeName,
            // 参数类型
            attr_sel: this.activeName
          }
          if (this.isEdit) {
            data. attr_vals = this.attributeInfo.attr_vals.toString();
            // 发送网络请求添加参数
            const { meta } = await this.$http.put(`categories/${this.categorieId}/attributes/${this.attributeInfo.attrId}`, data);
            // 判断是否添加成功
            if (meta.status !== 200) return this.$message.error(meta.msg);
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          }else{
            // 发送网络请求添加参数
            const { meta } = await this.$http.post(`categories/${this.categorieId}/attributes`, data);
            // 判断是否添加成功
            if (meta.status !== 201) return this.$message.error(meta.msg);
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
          }
          // 更新参数列表
          this.getParamsData();
          // 关闭添加参数的dialog开关
          this.dialogVisible = false;
        });
      },
      // 关闭dialog回调的事件
      handleClose(){
        // 清空数据
        this.attributeInfo = { attributeName: ''};
        // 重置表单
        this.$refs.addFormRef.resetFields();
        // 修改当前不为编辑参数
        this.isEdit = false;
      },
      // 删除参数
      handleDelete(id, name){
        // 弹出警告，确定就执行删除的网络请求
        this.$confirm(`此操作将永久删除该参数 '${name}', 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 发送网络请求添加参数
          const { meta } = await this.$http.delete(`categories/${this.categorieId}/attributes/${id}`);
          // 判断是否添加成功
          if (meta.status !== 200) return this.$message.error(meta.msg);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 更新参数列表
          this.getParamsData();
        }).catch(() => {
          // 点击取消是弹出提示
          this.$message({
            type: 'info',
            message: '已取消删除~'
          });          
        })
      },
      // 编辑参数
      handleEdit(row){
        // 显示当前名称和属性值
        this.attributeInfo.attributeName = row.attr_name;
        this.attributeInfo.attr_vals = row.attr_vals;
        // 保存当前属性id
        this.attributeInfo.attrId = row.attr_id;
        // 当前为编辑参数
        this.isEdit = true;
        // 打开开关
        this.dialogVisible = true;
      },
      // 显示添加参数属性值的输入框
      showInput(item){
        item.inputVisible = true;
        // 自动获取焦点
        // $nextTick方法的作用，就是当页面上的元素被重新渲染之后，才会执行回调函数中的代码  bn

        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      async handleInputConfirm(item) {
        // trim方法用于清除字符串前后的空格
        let inputValue = item.inputValue.trim();
        if (inputValue) {
          let attr_vals = [...item.attr_vals];
          attr_vals.push(inputValue);
          // 获取请求数据的参数
          const data = {
            // 参数名称
            attr_name: item.attr_name,
            // 参数类型
            attr_sel: this.activeName,
            // 输入的属性值
            attr_vals: attr_vals.toString()
          }
          // 发送网络请求添加参数
          const { meta } = await  this.$http.put(`categories/${this.categorieId}/attributes/${item.attr_id}`, data);
          // 判断是否添加成功
          if (meta.status !== 200) return this.$message.error(meta.msg);
          this.$message({
            type: 'success',
            message: '添加成功!'
          });

          // 添加数据到对应位置，页面渲染出来
          item.attr_vals.push(inputValue);
        }
        item.inputVisible = false;
        item.inputValue = '';
      },
      // 删除参数属性的事件
      async handleTagClose(row, index){
        // 删除当前的属性
        let attr_vals = row.attr_vals;
        attr_vals.splice(index, 1);
        // 获取请求数据的参数
        const data = {
          // 参数名称
          attr_name: row.attr_name,
          // 参数类型
          attr_sel: this.activeName,
          // 输入的属性值
          attr_vals: attr_vals.toString()
        }
        // 发送网络请求添加参数
        const { meta } = await  this.$http.put(`categories/${this.categorieId}/attributes/${row.attr_id}`, data);
        // // 判断是否添加成功
        if (meta.status !== 200) return this.$message.error(meta.msg);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        // 重新渲染出来
        row.attr_vals.splice(index, 1);
      }
    },
    computed: {
      // 当级联选择器没有被选中第三级时，tab页应该被禁用
      isDisabled(){
        // tabs的disabled属性为true时生效
        return this.selectKeys.length !== 3;
      },
      // 选中的分类id
      categorieId(){
        return this.selectKeys[2];
      },
      attributeValue(){

      }
    }
  }
</script>

<style lang="less" scoped>
.params{
  .el-card{
    .el-row{
      padding: 10px 0;
    }

    .el-table{
      margin: 15px 0;
    }
  }
}
</style>