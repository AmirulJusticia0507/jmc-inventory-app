import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/',
      redirect: '/incoming-goods',
    },
    {
      path: '/incoming-goods',
      name: 'IncomingGoodsList',
      component: () => import('@/views/IncomingGoodsListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/incoming-goods/create',
      name: 'IncomingGoodsCreate',
      component: () => import('@/views/IncomingGoodsFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/incoming-goods/:id/edit',
      name: 'IncomingGoodsEdit',
      component: () => import('@/views/IncomingGoodsFormView.vue'),
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: '/incoming-goods/:id/print',
      name: 'IncomingGoodsPrint',
      component: () => import('@/views/IncomingGoodsPrintView.vue'),
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: '/categories',
      name: 'Categories',
      component: () => import('@/views/CategoriesView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/sub-categories',
      name: 'SubCategories',
      component: () => import('@/views/SubCategoriesView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('@/views/UsersView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
    return;
  }
  
  if (to.meta.guest && authStore.isAuthenticated) {
    next('/incoming-goods');
    return;
  }
  
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/incoming-goods');
    return;
  }
  
  next();
});

export default router;