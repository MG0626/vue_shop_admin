<template>
  <!-- 面包屑导航栏 -->
  <el-breadcrumb separator-class="el-icon-arrow-right" v-if="$route.path !== '/welcome'">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ menuName.parentMenu }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ menuName.currentMenu }}</el-breadcrumb-item>
    <el-breadcrumb-item v-if=" menuName.additionalName && menuName.additionalName !== ''">{{ menuName.additionalName }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  props: {
    menuName: {
      type: Object,
      default: null
    }
  }
};
</script>
