<template>
  <div class="home">
    <!-- 侧边导航栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <!-- 导航栏 -->
      <el-menu
        :default-active="indexPath"
        class="el-menu-vertical-demo"
        background-color="#263445"
        text-color="#bfcbd9"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        @select="handleMenuSelect"
      >
        <el-menu-item index="home" route="/welcome">
          <i class="el-icon-s-home"></i>
          <template #title>
            <span>首页</span>
          </template>
        </el-menu-item>

        <!-- 一级 -->
        <el-submenu v-for="item in menus" :key="item.id" :index="`${item.id}`">
          <template #title>
            <i :class="icons[item.id]"></i>
            <span>{{ item.authName }}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            v-for="menu in item.children"
            :key="menu.id"
            :index="menu.path"
          >
            <template #title>
              <i class="el-icon-menu"></i>
              <span>{{ menu.authName }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <!-- 右侧主体区域 -->
    <el-container>
      <!-- 主体头部 -->
      <el-header height="50px">
        <!-- 控制导航栏收缩 -->
        <div class="toggle-button" @click="isCollapse = !isCollapse">
          <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
        </div>
        <div class="exit">
          <el-dropdown trigger="click" size="mini">
            <div class="avatar">
              <el-avatar
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              ></el-avatar>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <span @click="LogOut">退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <!-- 主体内容 -->
      <el-main>
        <!-- 面包屑导航栏 -->
        <breadcrumb :menuName="menuName" />
        <!-- 这里还要监听路由子页面发射过来的事件 -->
        <router-view @additional="additional"></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb.vue'

export default {
  name: 'Home',
  data() {
    return {
      // 导航栏列表数据
      menus: [],
      // 导航栏图标
      icons: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju-tianchong',
        '145': 'iconfont icon-baobiao1',
      },
      // 控制导航栏是否收缩
      isCollapse: false,
      // 当前选择的一级和二级导航名称
      menuName: null,
      // 默认选中的菜单导航项
      indexPath: 'home'
    };
  },
  created() {
    this.getMenuList();
    // 获取当前路由地址改选中的菜单导航项和面包屑数据
    this.getMenuName();
  },
  methods: {
    // 获取导航栏数据
    async getMenuList() {
      const result = await this.$http.get('/menus');
      // 请求失败时返回错误，同时return不再继续执行下去
      if (result.meta.status !== 200)
        return this.$message.error(result.meta.msg);
      // 赋值到data
      this.menus = result.data;
    },
    LogOut() {
      // 清空token
      window.localStorage.removeItem('info');
      // 弹出提示
      this.$message({
        showClose: true,
        message: '退出成功，期待下一次见面~',
        type: 'success',
      });
      // 跳转到登录页面
      this.$router.push('/login');
    },

    // 菜单被选中时响应函数
    handleMenuSelect(index, indexPath){
      // 当选中的为home时不执行
      if(index === 'home') return;
      // 当前选择的一级菜单数据
      const parentMenu = this.menus.filter(item => item.id == indexPath[0])[0];
      // 获取二级菜单
      const currentMenu = parentMenu.children.filter(item => item.path == index)[0];

      // 获取对应的导航栏名称，用于面包屑
      this.menuName = {
        index,
        parentMenu: parentMenu.authName,
        currentMenu: currentMenu.authName
      }

      // 防止页面被刷新清空menuName数据，故缓存下来
      window.localStorage.setItem('menuName', JSON.stringify(this.menuName));
    },

    getMenuName(){
      // 如果为首页的话，不使用缓存
      if (this.$route.path === '/welcome') return this.indexPath = 'home';
      // 页面刷新时自动加载缓存下来的menuName数据
      this.menuName = JSON.parse(window.localStorage.getItem('menuName'));
      // 更改默认选中的菜单导航项
      this.indexPath = this.menuName.index;
    },
    // 路由子页面发射过来的事件，用于添加面包屑新一级名称
    additional(name){
      this.menuName.additionalName = name;
    }
  },
  components: {
    Breadcrumb
  }
};
</script>

<style lang="less" scoped>
.home {
  width: 100vw;
  height: 100vh;
  min-width: 1366px;
  display: flex;

  .el-aside {
    // background-color: #d3dce6;
    // background-color: #263445;
    // color: #8da1c0;
    width: auto;
    .el-menu {
      height: 100%;
      border: none;
      .iconfont {
        margin-left: 1px;
        margin-right: 10px;
      }
    }
  }
  .el-container {
    height: 100vh;
    .el-header {
      padding: 0;
      background-color: #fff;
      color: #333;
      text-align: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .toggle-button {
        width: 50px;
        line-height: 50px;
        &:hover {
          background-color: #f9f9f9;
        }
        i {
          font-size: 18px;
        }
      }
      .exit {
        display: flex;
        align-items: center;
        padding: 0 20px;
        .avatar {
          display: flex;
          align-items: center;
        }
      }
    }

    .el-main {
      background-color: #e9eef3;
      padding: 10px;
      // color: #333;
      .el-breadcrumb{
        padding: 5px 10px 15px 10px;
      }
    }
  }
}
</style>
