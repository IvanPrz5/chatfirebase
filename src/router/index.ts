// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    meta: {
      requiresAuth: true
    },
    component: () => import('@/views/Home.vue'),
    children: [
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  if(to.matched.some((record) => record.meta.requiresAuth)) {
    if(localStorage.getItem("token") != undefined){
      next();
    }else{
      next({ path: "/login" })
    }
  }else{
    next();
  }
})

export default router
