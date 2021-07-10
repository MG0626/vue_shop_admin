<template>
  <div class="order">
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="6">
          <el-input 
            placeholder="请输入内容" 
            size="mini" 
            v-model="queryInfo.query" 
            clearable 
            @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orders" border stripe v-loading="loading">
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="order_number" label="订单编号"></el-table-column>
        <el-table-column align="center" prop="order_price" label="订单价格(元)" width="120"></el-table-column>
        <el-table-column align="center" prop="pay_status" label="是否付款" width="120">
          <template v-slot="scope">
            <el-tag :type="scope.row.pay_status === '0' ? 'danger' : 'primary'">{{scope.row.pay_status === '0' ? '未付款' : '已付款'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="is_send" label="是否发货" width="120"></el-table-column>
        <el-table-column align="center" prop="create_time" label="下单时间" width="200">
          <template v-slot="scope">
            <span>{{ scope.row.create_time | timeFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template>
            <el-button 
              type="primary" 
              size="mini"
              @click="dialogVisible = true">编辑</el-button>
            <el-button 
              type="success" 
              size="mini"
              @click="showProgressBox">物流</el-button>
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

    <!-- 修改地址区域 -->
    <el-dialog title="修改地址" :visible.sync="dialogVisible" width="50%" @close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="省市区/县" prop="address">
          <el-cascader :options="citys" v-model="ruleForm.address" :props="{expandTrigger: 'hover'}"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="fullAddress">
          <el-input v-model="ruleForm.fullAddress"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 物流信息区域 -->
    <el-dialog title="物流信息" :visible.sync="logisticsVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 分页组件
import Pagination from '../../components/pagination/Pagination.vue';
// 省市区/县数据
import cityData from './citydata';
  export default {
    data(){
      return {
        // 获取订单列表的请求参数
        queryInfo: {
          // 查询参数，可以为空
          query: '',
          // 当前页码，不能为空
          pagenum: 1,
          // 每页显示条数，不能为空
          pagesize: 5
        },
        // 订单列表总条数
        total: 0,
        // 订单列表
        orders: [],
        // loading开关
        loading: false,
        // dialog开关
        dialogVisible: false,
        // 表单数据
        ruleForm: {
          address: []
        },
        // 表单验证规则
        rules: {
          address: [{required: true, message: '请选择省市区/县', trigger: 'blur'}],
          fullAddress: [{required: true, message: '请输入详细地址', trigger: 'blur'}]
        },
        // 省市区/县数据
        citys: cityData,
        // 物流dialog开关
        logisticsVisible: false,
        // 物流信息
        progressInfo: [
          {
            "time": "2018-05-10 09:39:00",
            "ftime": "2018-05-10 09:39:00",
            "context": "已签收,感谢使用顺丰,期待再次为您服务",
            "location": ""
          },
          {
            "time": "2018-05-10 08:23:00",
            "ftime": "2018-05-10 08:23:00",
            "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
            "location": ""
          },
          {
            "time": "2018-05-10 07:32:00",
            "ftime": "2018-05-10 07:32:00",
            "context": "快件到达 [北京海淀育新小区营业点]",
            "location": ""
          },
          {
            "time": "2018-05-10 02:03:00",
            "ftime": "2018-05-10 02:03:00",
            "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
            "location": ""
          },
          {
            "time": "2018-05-09 23:05:00",
            "ftime": "2018-05-09 23:05:00",
            "context": "快件到达 [北京顺义集散中心]",
            "location": ""
          },
          {
            "time": "2018-05-09 21:21:00",
            "ftime": "2018-05-09 21:21:00",
            "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
            "location": ""
          },
          {
            "time": "2018-05-09 13:07:00",
            "ftime": "2018-05-09 13:07:00",
            "context": "顺丰速运 已收取快件",
            "location": ""
          },
          {
            "time": "2018-05-09 12:25:03",
            "ftime": "2018-05-09 12:25:03",
            "context": "卖家发货",
            "location": ""
          },
          {
            "time": "2018-05-09 12:22:24",
            "ftime": "2018-05-09 12:22:24",
            "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
            "location": ""
          },
          {
            "time": "2018-05-08 21:36:04",
            "ftime": "2018-05-08 21:36:04",
            "context": "商品已经下单",
            "location": ""
          }
        ]
      }
    },
    created(){
      this.getOrderList();
    },
    methods: {
      // 获取订单列表数据
      async getOrderList(){
        // 打开loading开关
        this.loading = true;
        const result = await this.$http.get('/orders', { params: this.queryInfo });
        if( result.meta.status !== 200 ) return this.$message.error('获取订单列表数据失败！');
        this.orders = result.data.goods;
        // 列表总数
        this.total = result.data.total;
        // 获取到数据，关闭loading
        this.loading = false;
      },
      // 监听pagesize改变，分页切显示多少条的事件
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize;
        // 请求对应的条数的数据
        this.getOrderList();
      },
      // 监听页码改变触发的事件
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage;
        // 请求对应的页数数据
        this.getOrderList();
      },
      // 关闭dialog回调
      handleClose(){
        // 清空数据
        this.$refs.ruleForm.resetFields();
      },
      // 打开物流信息
      showProgressBox(){
        this.logisticsVisible = true;
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
.el-cascader{
  width: 50%;
}
.el-timeline{
  padding-left: 5px;
}
</style>