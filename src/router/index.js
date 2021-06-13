import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/home/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('../views/welcome/Welcome.vue'),
      },
      // 用户管理
      {
        path: '/users',
        component: () => import('../views/users/Users.vue'),
      },
      // 权限管理
      {
        path: '/roles',
        component: () => import('../views/rights/Roles.vue'),
      },
      {
        path: '/rights',
        component: () => import('../views/rights/Rights.vue'),
      },
      // 商品管理
      {
        path: '/goods',
        component: () => import('../views/goods/Goods.vue')
      },
      {
        path: '/goods',
        component: () => import('../views/goods/Goods.vue')
      },
      {
        path: '/params',
        component: () => import('../views/goods/Params.vue')
      },
      {
        path: '/categories',
        component: () => import('../views/goods/Categories.vue')
      },
      // 订单管理
      {
        path: '/orders',
        component: () => import('../views/orders/Orders.vue'),
      },
      // 数据统计
      {
        path: '/reports',
        component: () => import('../views/reports/Reports.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Login.vue'),
  },
  {
    path: '/404',
    component: () => import('../views/notFound/NotFound.vue')
  },
  {
    path: '*',
    redirect: '/404',
  }
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
