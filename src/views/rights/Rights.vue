<template>
  <div class="rights">
    <el-card>
      <el-table :data="list" border stripe>
        <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
        <el-table-column align="center" prop="authName" label="权限名称"></el-table-column>
        <el-table-column align="center" prop="path" label="路径"></el-table-column>
        <el-table-column align="center" label="权限等级">
          <template slot-scope="scope">
            <el-tag  :type="scope.row.level | type">{{scope.row.level | level}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        // 权限列表数据
        list: null
      }
    },
    created(){
      // 获取权限列表数据
      this.getRightList();
    },
    methods: {
      // 发起获取权限列表数据的网络请求
      async getRightList(){
        const result = await this.$http.get('rights/list');
        // 验证是否获取成功
        if (result.meta.status !== 200) return this.$message.error('获取权限列表失败！')
        this.list = result.data;
      }
    },
    filters: {
      level(value){
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
      type(value){
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
      }
    }
  }
</script>

<style lang="less" scoped>

</style>