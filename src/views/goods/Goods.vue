<template>
  <div class="list">
    <el-card>
      <!--  搜索和添加商品 -->
      <el-row  :gutter="20">
        <el-col :span="7">
          <el-input 
            placeholder="请输入内容" 
            size="mini" 
            v-model="queryInfo.query" 
            clearable 
            @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" size="mini" @click="handleAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goods" border stripe v-loading="loading">
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column align="center" prop="goods_price" label="商品价格(元)" width="120"></el-table-column>
        <el-table-column align="center" prop="goods_weight" label="商品重量" width="120"></el-table-column>
        <el-table-column align="center" prop="add_time" label="创建时间" width="200">
          <template v-slot="scope">
            <span>{{ scope.row.add_time | timeFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template v-slot="scope">
            <el-button 
              type="primary" 
              size="mini">编辑</el-button>
            <el-button 
              type="danger" 
              size="mini"
              @click="handleDetele(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域，自定义组件 -->
      <pagination 
        :info="queryInfo"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :pageSizes="[1, 2, 5, 10, 20, 50]"
        :total="total"/>
    </el-card>
  </div>
</template>

<script>
// 分页组件
import Pagination from '../../components/pagination/Pagination.vue';
  export default {
    data(){
      return {
        // 获取商品列表的请求参数
        queryInfo: {
          // 查询参数，可以为空
          query: '',
          // 当前页码，不能为空
          pagenum: 1,
          // 每页显示条数，不能为空
          pagesize: 5
        },
        // 商品列表总条数
        total: 0,
        // 商品列表
        goods: [],
        // loading开关
        loading: false,
      }
    },
    created(){
      // 获取商品列表
      this.getGoodsList();
    },
    methods: {
      // 发起网络请求获取商品列表
      async getGoodsList(){
        // 打开loading提示
        this.loading = true;
        const result = await this.$http.get('/goods', { params: this.queryInfo });
        // 商品列表
        this.goods = result.data.goods;
        // 商品列表总条数
        this.total = result.data.total;
        // 数据加载完成，关闭loading
        this.loading = false;
      },
      // 监听pagesize改变，分页切显示多少条的事件
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize;
        // 请求对应的条数的数据
        this.getGoodsList();
      },
      // 监听页码改变触发的事件
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage;
        // 请求对应的页数数据
        this.getGoodsList();
      },
      // 删除商品按钮的事件
      handleDetele(id){
        // 弹出警告，确定就执行删除的网络请求
        this.$confirm(`此操作将永久删除该商品, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { meta } = await this.$http.delete(`goods/${id}`);
          // 判断是否删除成功
          if (meta.status !== 200) return this.$message.error(meta.msg);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 重新获取列表数据
          this.getGoodsList();
        }).catch(() => {
          // 点击取消是弹出提示
          this.$message({
            type: 'info',
            message: '已取消删除~'
          });          
        })
      },
      // 添加商品按钮响应事件
      handleAddGoods(){
        // 跳转到添加商品页面
        this.$router.push('/goods/add');
      }
    },
    filters: {
      timeFormat(value){
        const time = new Date(value * 1000);
        // 年
        const y = time.getFullYear();
        // 月
        const m = time.getMonth() + 1;
        // 日
        const d = time.getDate();
        // 时
        const hh = time.getHours() + 1;
        // 分
        const mm = time.getMinutes() + 1;
        // 秒
        const ss = time.getSeconds() + 1;
        // 判断时间是否为一位数，是就格式化为两位, 
        // padStart方法有两个参数，第一个为位数，第二个为添加的字符串，表示当不满足当前的位数是，在其前面添加第二个参数定义的字符串
        const format = (value) => value.toString().padStart(2, '0');
        // 返回 
        return `${y}-${m}-${d} ${format(hh)}:${format(mm)}:${format(ss)}`;
      }
    },
    components: {
      Pagination
    }
  }
</script>

<style lang="less" scoped>
.list{
  
}
</style>