import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Warehouse from '../views/Warehouse.vue'
import Pond from '../views/Pond.vue'
import Monitoring from '../views/Monitoring.vue'
import Equipment from '../views/Equipment.vue'
import Feeding from '../views/Feeding.vue'
import Alarm from '../views/Alarm.vue'
import Report from '../views/Report.vue'
import User from '../views/User.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'warehouse',
        name: 'Warehouse',
        component: Warehouse
      },
      {
        path: 'pond',
        name: 'Pond',
        component: Pond
      },
      {
        path: 'monitoring',
        name: 'Monitoring',
        component: Monitoring
      },
      {
        path: 'equipment',
        name: 'Equipment',
        component: Equipment
      },
      {
        path: 'feeding',
        name: 'Feeding',
        component: Feeding
      },
      {
        path: 'alarm',
        name: 'Alarm',
        component: Alarm
      },
      {
        path: 'report',
        name: 'Report',
        component: Report
      },
      {
        path: 'user',
        name: 'User',
        component: User
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const whiteList = ['/login']
  
  if (whiteList.includes(to.path)) {
    next()
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router