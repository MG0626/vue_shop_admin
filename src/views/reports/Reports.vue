<template>
  <div class="report">
    <el-card>
      <div id="main" ref="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import _ from 'lodash';
export default {
  data() {
    return {
      option: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ]
      }
    };
  },
  mounted() {
    // 渲染echarts
    this.renderEcharts();
  },
  methods: {
    async renderEcharts() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.main);

      
      // 获取数据
      const result = await this.$http.get('reports/type/1');
      if (result.meta.status !== 200) return this.$message.error('获取折线图数据失败！');

      // 指定图表的配置项和数据
      const data = _.merge(result.data, this.option);
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(data);
    }
  },
};
</script>

<style lang="less" scoped></style>
