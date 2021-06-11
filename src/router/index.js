import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Login.vue'),
  },
];

const router = new VueRouter({
  routes,
});

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 获取token
  const token = window.localStorage.getItem('token');

  // 如果访问的是登录页面，则进入判断
  if (to.path === '/login') {
    // 已经存在token，则说明已经登录，这个时候不允许访问登录页面
    if (token) return next('/');
    // 没有登录。则放行
    return next();
  } 

  // 没有token，就跳转到登录页面
  if (!token) return next('/login');
  // 没有问题，放行
  next();
});

export default router;
