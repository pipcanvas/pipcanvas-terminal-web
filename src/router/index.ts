import { RouteRecordRaw } from 'vue-router'
import Trading from '@/views/Trading.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'trading',
    component: Trading
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export default routes
