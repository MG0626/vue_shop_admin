<template>
  <div class="check">
    <!-- 基本信息 -->
    <el-card shadow="never">
      <template v-slot:header>
        <span>基本信息</span>
      </template>
      <el-row>
        <el-col>商品名称: {{info.goods_name}}</el-col>
        <el-col>商品价格: {{info.goods_price}}</el-col>
        <el-col>商品重量: {{info.goods_weight}}</el-col>
        <el-col>商品数量: {{info.goods_number}}</el-col>
        <el-col>商品分类: {{catName}}</el-col>
      </el-row>
    </el-card>

    <!-- 商品参数 -->
    <el-card shadow="never">
      <template v-slot:header>
        <span>商品参数</span>
      </template>
      <el-row>
        <el-col v-for="item in manyTableData" :key="item.attr_id">{{item.attr_name}}: {{item.attr_vals.toString()}}</el-col>
      </el-row>
    </el-card>

    <!-- 商品属性 -->
    <el-card shadow="never">
      <template v-slot:header>
        <span>商品属性</span>
      </template>
      <el-row>
        <el-col v-for="item in onlyTableData" :key="item.attr_id">{{item.attr_name}}: {{item.attr_vals}}</el-col>
      </el-row>
    </el-card>

    <!-- 商品图片 -->
    <el-card shadow="never">
      <template v-slot:header>
        <span>商品图片</span>
      </template>
      <el-row class="good-img">
        <el-col :span="12" v-for="(item, index) in info.pics" :key="index">
          <img :src="'http://cenmingguang.top:8888/' + item.pic" width="80%"/>
        </el-col>
      </el-row>
    </el-card>

    <!-- 商品内容 -->
    <el-card shadow="never">
      <template v-slot:header>
        <span>商品内容</span>
      </template>
      <div v-html="info.goods_introduce"></div>
    </el-card>
  </div>
</template>

<script>
  export default {
    props: {
      info: {
        type: Object,
        default(){
          return {}
        }
      },
      catName: {
        type: String,
        default: ''
      },
      // 动态参数列表数据
      manyTableData: {
        type: Array,
        default: []
      },
      // 静态参数列表数据
      onlyTableData: {
        type: Array,
        default: []
      },
    }
  }
</script>

<style lang="less" scoped>
.check{
  .el-card{
    .el-row{
      .el-col{
        &:first-child{
          margin-top: 0;
        }
        margin-top: 15px;
      }
    }
    .good-img{
      .el-col{
        margin-top: 0;
        text-align: center;
      }
    }
  }
}
</style>