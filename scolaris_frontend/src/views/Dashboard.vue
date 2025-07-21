<template>
  <div class="layout-container">
    <Sidebar :collapsed="sidebarCollapsed" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    
    <div class="main-content">
      <Header />
      
      <main class="p-6 space-y-6">
        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="stat-card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm">Total Élèves</p>
                <p class="text-3xl font-bold text-white">{{ studentsStore.students.length }}</p>
              </div>
              <i class="fas fa-user-graduate text-white/60 text-3xl"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-success-500 to-success-600 text-white rounded-lg p-6 shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm">Classes Actives</p>
                <p class="text-3xl font-bold text-white">{{ classesStore.classes.length }}</p>
              </div>
              <i class="fas fa-chalkboard text-white/60 text-3xl"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-warning-500 to-warning-600 text-white rounded-lg p-6 shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm">Enseignants</p>
                <p class="text-3xl font-bold text-white">{{ teachersStore.teachers.length }}</p>
              </div>
              <i class="fas fa-chalkboard-teacher text-white/60 text-3xl"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-danger-500 to-danger-600 text-white rounded-lg p-6 shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm">Revenus Total</p>
                <p class="text-3xl font-bold text-white">{{ formatCurrency(financeStore.totalRevenue) }}</p>
              </div>
              <i class="fas fa-money-bill-wave text-white/60 text-3xl"></i>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
            <div class="grid grid-cols-2 gap-4">
              <router-link
                v-for="action in quickActions"
                :key="action.name"
                :to="action.path"
                class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <i :class="action.icon" class="text-2xl text-primary-600 mb-2"></i>
                <span class="text-sm font-medium text-gray-900">{{ action.name }}</span>
              </router-link>
            </div>
          </div>
          
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Classes les plus importantes</h3>
            <div class="space-y-3">
              <div
                v-for="classe in classesWithMostStudents"
                :key="classe.id"
                class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 class="font-medium text-gray-900">{{ classe.name }}</h4>
                  <p class="text-sm text-gray-600">{{ classe.level }} - {{ classe.section }}</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-primary-600">{{ classe.studentCount }}</p>
                  <p class="text-xs text-gray-500">élèves</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Activités Récentes</h3>
          <div class="space-y-4">
            <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div class="bg-primary-100 text-primary-600 rounded-full p-2">
                <i class="fas fa-user-plus"></i>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">Nouvel élève inscrit</p>
                <p class="text-xs text-gray-600">Sophie Martin a été ajoutée en 6ème A</p>
              </div>
              <span class="text-xs text-gray-500">Il y a 2h</span>
            </div>
            
            <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div class="bg-success-100 text-success-600 rounded-full p-2">
                <i class="fas fa-money-bill"></i>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">Paiement reçu</p>
                <p class="text-xs text-gray-600">Mensualité de Jean Dupont - 25 000 FCFA</p>
              </div>
              <span class="text-xs text-gray-500">Il y a 1j</span>
            </div>
            
            <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div class="bg-warning-100 text-warning-600 rounded-full p-2">
                <i class="fas fa-clipboard-list"></i>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">Notes saisies</p>
                <p class="text-xs text-gray-600">Mathématiques - 5ème B - Trimestre 1</p>
              </div>
              <span class="text-xs text-gray-500">Il y a 2j</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import { useStudentsStore } from '@/stores/students'
import { useClassesStore } from '@/stores/classes'
import { useTeachersStore } from '@/stores/teachers'
import { useFinanceStore } from '@/stores/finance'
import { useAuthStore } from '@/stores/auth'

const sidebarCollapsed = ref(false)
const studentsStore = useStudentsStore()
const classesStore = useClassesStore()
const teachersStore = useTeachersStore()
const financeStore = useFinanceStore()
const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})

const quickActions = computed(() => {
  const allActions = [
    { name: 'Nouvel Élève', path: '/students', icon: 'fas fa-user-plus' },
    { name: 'Nouvelle Classe', path: '/classes', icon: 'fas fa-plus' },
    { name: 'Saisir Notes', path: '/grades', icon: 'fas fa-edit' },
    { name: 'Voir Bulletins', path: '/reports', icon: 'fas fa-file-alt' },
    { name: 'Paiement', path: '/finance', icon: 'fas fa-money-bill' },
    { name: 'Statistiques', path: '/statistics', icon: 'fas fa-chart-bar' }
  ]
  
  const userRole = authStore.user?.role
  if (userRole === 'secretaire') {
    return allActions.filter(action => 
      ['Nouvel Élève', 'Nouvelle Classe', 'Saisir Notes', 'Voir Bulletins'].includes(action.name)
    )
  } else if (userRole === 'comptable') {
    return allActions.filter(action => 
      ['Paiement'].includes(action.name)
    )
  }
  
  return allActions
})

const classesWithMostStudents = computed(() => {
  return classesStore.classesWithStats
    .sort((a, b) => b.studentCount - a.studentCount)
    .slice(0, 4)
})

function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount).replace('XOF', 'FCFA')
}
</script>

<style scoped>
.layout-container {
  @apply flex h-screen bg-gray-50;
}

.main-content {
  @apply flex-1 flex flex-col overflow-hidden;
}
</style>