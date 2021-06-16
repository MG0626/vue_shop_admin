<template>
  <div class="rights">
    <el-card>
      <el-table :data="list" border stripe v-loading="loading">
        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="80"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="authName"
          label="权限名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="path"
          label="路径"
        ></el-table-column>
        <el-table-column align="center" label="权限等级">
          <template v-slot="scope">
            <el-tag :type="scope.row.level | type">{{
              scope.row.level | level
            }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表数据
      list: null,
      // 触发loading的开关
      loading: true,
    };
  },
  created() {
    // 获取权限列表数据
    this.getRightList();
  },
  methods: {
    // 发起获取权限列表数据的网络请求
    async getRightList() {
      // 打开loading开关
      this.loading = true;
      const result = await this.$http.get('rights/list');
      // 验证是否获取成功
      if (result.meta.status !== 200)
        return this.$message.error('获取权限列表失败！');
      this.list = result.data;
      // 获取数据完成，关闭loading
      this.loading = false;
    },
  },
  filters: {
    level(value) {
      let levelName = '一级';
      switch (value) {
        case '1':
          levelName = '二级';
          break;
        case '2':
          levelName = '三级';
          break;
      }
      return levelName;
    },
    type(value) {
      let type = '';
      switch (value) {
        case '1':
          type = 'success';
          break;
        case '2':
          type = 'warning';
          break;
      }
      return type;
    },
  },
};
</script>

<style lang="less" scoped></style>
