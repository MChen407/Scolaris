import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/Login.vue'
import Students from '@/views/Students.vue'
import Classes from '@/views/Classes.vue'
import Teachers from '@/views/Teachers.vue'
import Subjects from '@/views/Subjects.vue'
import Grades from '@/views/Grades.vue'
import Reports from '@/views/Reports.vue'
import Finance from '@/views/Finance.vue'
import Statistics from '@/views/Statistics.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, roles: ['admin', 'secretaire', 'comptable'] }
  },
  {
    path: '/students',
    name: 'Students',
    component: Students,
    meta: { requiresAuth: true, roles: ['admin', 'secretaire'] }
  },
  {
    path: '/classes',
    name: 'Classes',
    component: Classes,
    meta: { requiresAuth: true, roles: ['admin', 'secretaire'] }
  },
  {
    path: '/teachers',
    name: 'Teachers',
    component: Teachers,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/subjects',
    name: 'Subjects',
    component: Subjects,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/grades',
    name: 'Grades',
    component: Grades,
    meta: { requiresAuth: true, roles: ['admin', 'secretaire'] }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { requiresAuth: true, roles: ['admin', 'secretaire'] }
  },
  {
    path: '/finance',
    name: 'Finance',
    component: Finance,
    meta: { requiresAuth: true, roles: ['admin', 'comptable'] }
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics,
    meta: { requiresAuth: true, roles: ['admin'] }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.roles && !to.meta.roles.includes(authStore.user?.role)) {
    next('/')
  } else {
    next()
  }
})

export default router