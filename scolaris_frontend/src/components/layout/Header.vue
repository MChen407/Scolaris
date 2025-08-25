<template>
  <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
        <p class="text-sm text-gray-500">{{ pageDescription }}</p>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- Notifications -->
        <button class="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <i class="fas fa-bell text-xl"></i>
          <span class="absolute top-0 right-0 bg-danger-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </button>
        
        <!-- User Menu -->
        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="bg-primary-600 text-white rounded-full p-2">
              <i class="fas fa-user"></i>
            </div>
            <div class="text-left">
              <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
              <p class="text-xs text-gray-500 capitalize">{{ authStore.user?.role }}</p>
            </div>
            <i class="fas fa-chevron-down text-gray-400"></i>
          </button>
          
          <Transition name="fade">
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
              @click.away="showUserMenu = false"
            >
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <i class="fas fa-user mr-2"></i> Profil
              </a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <i class="fas fa-cog mr-2"></i> Paramètres
              </a>
              <hr class="my-2">
              <button
                @click="logout"
                class="block w-full text-left px-4 py-2 text-sm text-danger-700 hover:bg-danger-50"
              >
                <i class="fas fa-sign-out-alt mr-2"></i> Déconnexion
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const showUserMenu = ref(false)

const pageTitle = computed(() => {
  const titles = {
    '/': 'Tableau de bord',
    '/students': 'Gestion des élèves',
    '/classes': 'Gestion des classes',
    '/teachers': 'Gestion des enseignants',
    '/subjects': 'Gestion des matières',
    '/grades': 'Saisie des notes',
    '/reports': 'Bulletins scolaires',
    '/finance': 'Gestion financière',
    '/statistics': 'Statistiques'
  }
  return titles[route.path] || 'Page'
})

const pageDescription = computed(() => {
  const descriptions = {
    '/': 'Vue d\'ensemble de l\'établissement',
    '/students': 'Gérer les informations des élèves',
    '/classes': 'Organiser les classes et niveaux',
    '/teachers': 'Administrer le personnel enseignant',
    '/subjects': 'Configurer les matières et coefficients',
    '/grades': 'Enregistrer et modifier les notes',
    '/reports': 'Générer et consulter les bulletins',
    '/finance': 'Suivi des paiements et finances',
    '/statistics': 'Analyses et rapports statistiques'
  }
  return descriptions[route.path] || ''
})

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>