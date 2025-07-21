<template>
  <div :class="[
    'bg-white shadow-lg h-full flex flex-col transition-all duration-300',
    collapsed ? 'w-16' : 'w-64'
  ]">
    <!-- Logo -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center">
        <div class="bg-primary-600 text-white rounded-lg p-2">
          <i class="fas fa-graduation-cap text-xl"></i>
        </div>
        <Transition name="fade">
          <div v-if="!collapsed" class="ml-3">
            <h1 class="text-xl font-bold text-gray-900">Scolaris</h1>
            <p class="text-sm text-gray-500">Gestion Scolaire</p>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4">
      <ul class="space-y-2">
        <li v-for="item in filteredMenuItems" :key="item.name">
          <router-link
            :to="item.path"
            :class="[
              'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
              isActive(item.path)
                ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            ]"
          >
            <i :class="item.icon" class="text-lg"></i>
            <Transition name="fade">
              <span v-if="!collapsed" class="ml-3">{{ item.name }}</span>
            </Transition>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- User Info -->
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center">
        <div class="bg-gray-200 rounded-full p-2">
          <i class="fas fa-user text-gray-600"></i>
        </div>
        <Transition name="fade">
          <div v-if="!collapsed" class="ml-3">
            <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
            <p class="text-xs text-gray-500 capitalize">{{ authStore.user?.role }}</p>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Collapse Button -->
    <button
      @click="$emit('toggle-sidebar')"
      class="absolute -right-3 top-20 bg-primary-600 text-white rounded-full p-1 shadow-md hover:bg-primary-700 transition-colors"
    >
      <i :class="collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'" class="text-xs"></i>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineProps({
  collapsed: Boolean
})

defineEmits(['toggle-sidebar'])

const route = useRoute()
const authStore = useAuthStore()

const menuItems = [
  { name: 'Tableau de bord', path: '/', icon: 'fas fa-home', roles: ['admin', 'secretaire', 'comptable'] },
  { name: 'Élèves', path: '/students', icon: 'fas fa-user-graduate', roles: ['admin', 'secretaire'] },
  { name: 'Classes', path: '/classes', icon: 'fas fa-chalkboard', roles: ['admin', 'secretaire'] },
  { name: 'Enseignants', path: '/teachers', icon: 'fas fa-chalkboard-teacher', roles: ['admin'] },
  { name: 'Matières', path: '/subjects', icon: 'fas fa-book', roles: ['admin'] },
  { name: 'Notes', path: '/grades', icon: 'fas fa-clipboard-list', roles: ['admin', 'secretaire'] },
  { name: 'Bulletins', path: '/reports', icon: 'fas fa-file-alt', roles: ['admin', 'secretaire'] },
  { name: 'Finances', path: '/finance', icon: 'fas fa-money-bill-wave', roles: ['admin', 'comptable'] },
  { name: 'Statistiques', path: '/statistics', icon: 'fas fa-chart-bar', roles: ['admin'] }
]

const filteredMenuItems = computed(() => {
  return menuItems.filter(item => 
    item.roles.includes(authStore.user?.role)
  )
})

function isActive(path) {
  return route.path === path
}
</script>