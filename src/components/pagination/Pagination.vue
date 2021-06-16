<template>
  <!-- 
    分页 
      => @size-change 监听一页显示多少条数据，改变就触发，接收最新的每一页显示条数pagesize
      => @current-change 监听页码的改变，接收最新的页码
      => current-page 当前显示的第几页
      => page-sizes 显示条数的选项
      => page-size 当前每页显示的条数
      => total 总共多少条数据
  -->
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="info.pagenum"
    :page-sizes="pageSizes"
    :page-size="info.pagesize"
    :layout="layout"
    :total="total"
  >
  </el-pagination>
</template>

<script>
export default {
  props: {
    // 包含当前页码，当前每页显示的条数
    info: {
      type: Object,
      default(){
        return {}
      }
    },
    // 总条数
    total: {
      type: Number,
      default(){
        return 0
      }
    },
    // 显示条数的选项
    pageSizes: {
      type: Array,
      default(){
        return [1, 2, 5, 10]
      }
    },
    // 分页功能，字符串用逗号隔开
    layout: {
      type: String,
      default(){
        return "total, sizes, prev, pager, next, jumper"
      }
    }
  },
  methods: {
    // 监听pagesize改变，分页切显示多少条的事件
    handleSizeChange(newSize){
      // 发射出去给父组件
      this.$emit('handleSizeChange', newSize);
    },
    // 监听页码改变触发的事件
    handleCurrentChange(newPage){
      // 发射出去给父组件
      this.$emit('handleCurrentChange', newPage);
    }
  }
};
</script>

<style lang="less" scoped>
.el-pagination{
  margin-top: 15px;
  text-align: center;
}
</style>
