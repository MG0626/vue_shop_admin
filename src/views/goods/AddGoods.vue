<template>
  <div class="add">
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        :closable="false"
        show-icon>
      </el-alert>

      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页区域 -->
      <el-form :model="goodInfo" :rules="goodInfoRules" ref="ruleForm" label-position="top">
        <el-tabs tab-position="left" v-model="tabsActiveName" :before-leave="beforeTabLeave" @tab-click="handleTabClick">
          <el-tab-pane label="基本信息" name="1">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="goodInfo.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="goodInfo.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="goodInfo.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="goodInfo.goods_cat"
                :options="options"
                :props="props"
                placeholder="请选择商品分类"
                :show-all-levels="false"
                clearable
                ref="cascader"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="2">
            <el-form-item :label="item.attr_name"  v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="val" v-for="(val, i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="3">
            <el-form-item :label="item.attr_name"  v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="4">
            <el-upload
              :action="uploadUrl + '/api/private/v1/upload'"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headers">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="5">
            <div id="editor"></div>
          </el-tab-pane>
          <el-tab-pane label="完成" name="6">
            <check-add-info 
              :info="goodInfo" 
              :catName="catName" 
              :manyTableData="manyTableData" 
              :onlyTableData="onlyTableData"/>
            <el-button type="primary" @click="add">点击添加</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览的dialog -->
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="60%"
      @close="handleClose">
      <img :src="currentPic" width="100%"/>
    </el-dialog>
  </div>
</template>

<script>
// 引入 wangEditor
import wangEditor from 'wangeditor';
// 导入检查汇总商品信息组件
import CheckAddInfo from './childrenComponent/CheckAddInfo';

  export default {
    data(){
      return {
        // 步骤条索引
        activeIndex: 0,
        // 标签页索引
        tabsActiveName: '1',
        // 级联选择器的配置
        props: { 
          expandTrigger: 'hover', 
          value: 'cat_id', 
          label: 'cat_name'
        },
        // 级联选择器的options，存放商品分类
        options: [],
        // 商品信息
        goodInfo: {
          // 商品名称
          goods_name: '',
          // 分类
          goods_cat: [],
          // 价格
          goods_price: 0,
          // 数量
          goods_number: 0,
          // 重量
          goods_weight: 0,
          // 介绍
          goods_introduce: '',
          // 上传的图片临时路径
          pics: [],
          // 商品的参数
          attrs: []
        },
        // 商品信息表单验证规则
        goodInfoRules: {
          // 商品名称
          goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
          ],
          // 分类
          goods_cat: [
            { required: true, message: '请选择分类', trigger: 'blur' },
          ],
          // 价格
          goods_price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' },
            { type: 'number', message: '商品价格必须为数字值'}
          ],
          // 数量
          goods_number: [
            { required: true, message: '请输入商品数量', trigger: 'blur' },
            { type: 'number', message: '商品数量必须为数字值'}
          ],
          // 重量
          goods_weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' },
            { type: 'number', message: '商品重量必须为数字值'}
          ],
        },
        // 动态参数列表数据
        manyTableData: [],
        // 静态参数列表数据
        onlyTableData: [],
        // 上传图片的地址
        uploadUrl: 'http://cenmingguang.top:8888',
        // 图片上传的请求头
        headers: {
          Authorization: ''
        },
        // 图片预览dialog开关
        dialogVisible: false,
        // 当前点击预览的图片数据
        currentPic: '',
        // 富文本编辑器对象
        editor: null,
        // 当前选择的分类名称
        catName: ''
      }
    },
    created(){
      this.$emit('additional', '添加商品');
      // 发起请求商品分类
      this.getCategories();
      // 获取token
      this.headers.Authorization = JSON.parse(window.localStorage.getItem('info')).token;
    },
    mounted() {
      const editor = new wangEditor(`#editor`);
      // 配置 onchange 回调函数，将数据同步到 商品信息 中
      editor.config.onchange = (newHtml) => {
        this.goodInfo.goods_introduce = newHtml;
      }
      editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法

        //创建formdata对象
        const file = new FormData();
        //给formdata对象中放入数据(键值对的方式)
        file.append('file', resultFiles[0]);
        const result = await this.$http.post('/upload', file);

        // 上传图片，返回结果，将图片插入到编辑器中
        insertImgFn(this.uploadUrl + '/' + result.data.tmp_path)
      }
      // 创建编辑器
      editor.create();
      this.editor = editor;
    },
    beforeDestroy() {
      // 调用销毁 API 对当前编辑器实例进行销毁
      this.editor.destroy();
      this.editor = null;
    },
    methods:{
      beforeTabLeave(activeName, oldActiveName){
        // 控制是否阻止标签页切换的开关
        let flag = true;

        // 基本信息的内容是必填项
        this.$refs.ruleForm.validateField(['goods_name', 'goods_cat', 'goods_price', 'goods_number', 'goods_weight'], (msg) => {
          if (msg) {
            // 回调函数会多次调用，所以当flag为false，就不再提示了，第一次验证不通过就会提示
            flag && this.$message.error('请输入必选项');
            flag = false;
          }
        });
        
        // 修改步骤条
        if (flag) {
          this.activeIndex = Number(activeName) - 1;
        }
        // 根据flag是否放行切换
        return flag;
      },
      // 获取所有商品分类
      async getCategories(){
        // 获取数据
        const result = await this.$http.get('/categories', { params: { type: 3 } });
        if (result.meta.status !== 200) return this.$message.error(result.meta.msg);
        this.options = result.data;
      },
      // 获取动态参数列表
      async getManyParams(sel){
        const result = await this.$http.get(`/categories/${this.categorieId}/attributes`, { params: { sel } });
        if (sel === 'many') {
          // 把参数属性值从字符串转化为数组，通过逗号分割
          result.data.forEach(item => {
            // 判断参数中的attr_vals是否为空，为空就返回空数组
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
          })
          this.manyTableData = result.data;
        }else{
          this.onlyTableData = result.data;
        }
      },
      // 级联选择器选中时的回调
      handleChange(value){
        /**
         * 由于我们只需要第三级分类，所以当selectKeys的length不为3
         * (selectKeys为数组，索引0为第一级，以此类推)时,就不符合要求
         */
        if (this.goodInfo.goods_cat.length !== 3) {
          this.goodInfo.goods_cat = [];
          this.$message.error('只能选择第三级分类！');
        }
        // 保存当前选择的分类名称
        this.catName = this.$refs.cascader.getCheckedNodes()[0].label;
      },
      // 标签页被点击的回调函数
      handleTabClick(){
        switch (this.activeIndex) {
          case 1:
            this.getManyParams('many');
            break;
          case 2:
            this.getManyParams('only');
            break;
          default:
            break;
        }
      },
      // 处理图片预览效果
      handlePreview(file){
        // 获取上传后的图片路径
        const picPath = file.response.data.url.replace('http://127.0.0.1:8888', this.uploadUrl);
        // 保存到data
        this.currentPic = picPath;
        // 打开预览组件
        this.dialogVisible = true;
      },
      // 处理移除图片的操作
      handleRemove(file){
        // 获取需要删除的图片临时路径
        const filePath = file.response.data.tmp_path;
        // 从pics数组中找到图片对应的索引值
        let fileIndex = null;
        this.goodInfo.pics.forEach((item, index) => {
          if ( item.pic === filePath ) {
            fileIndex = index;
          }
        });
        // 从pics数组中删除当前图片
        this.goodInfo.pics.splice(fileIndex, 1);
      },
      // 监听图片上传成功的回调
      handleSuccess(res){
        // 拼接一个图片对象
        const picsInfo = {
          pic: res.data.tmp_path
        }
        // 保存到pics数组中
        this.goodInfo.pics.push(picsInfo);
      },
      // 关闭预览图片前的回调
      handleClose(){
        // 清空图片路径
        this.currentPic = ''
      },
      // 发起网络请求添加商品
      async add(){
        // 请求参数
        const data = {...this.goodInfo};
        // 请求参数的格式化
        data.goods_cat = [];
        data.attrs = [];
        data.goods_cat = this.goodInfo.goods_cat.toString() 
        data.attrs.push(...this.manyTableData.map(item => ({ attr_id: item.attr_id, attr_value: item.attr_vals.toString() })));
        data.attrs.push(...this.onlyTableData.map(item => ({ attr_id: item.attr_id, attr_value: item.attr_vals })));
        // 发起请求
        const result = await this.$http.post('goods', data);
        if (result.meta.status !== 201) return this.$message.error('添加商品失败，' + result.meta.msg);
        this.$message.success('商品添加成功!');
        // 返回商品列表
        this.$router.push('/goods');
      }
    },
    computed: {
      categorieId(){
        if (this.goodInfo.goods_cat.length === 3) {
          return this.goodInfo.goods_cat[2];
        }
        return null;
      }
    },
    components:{
      CheckAddInfo
    }
  }
</script>

<style lang="less" scoped>
.add{
  .el-tabs{
    margin-top: 15px;
    .el-button{
      margin-top: 15px;
    }
  }
}


</style>