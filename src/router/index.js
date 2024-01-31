import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Payrolls',
    component: ()=>import('@/views/Payrolls.vue')
  },
  {
    path: '/account',
    name: 'Account',
    component: ()=>import('@/views/Account.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
