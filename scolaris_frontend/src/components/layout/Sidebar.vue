<!--
  COMPOSANT SIDEBAR (BARRE LATÉRALE DE NAVIGATION)
  
  Barre de navigation principale de l'application avec :
  - Logo et titre de l'application
  - Menu de navigation filtré par rôle utilisateur
  - Informations utilisateur connecté
  - Bouton de réduction/expansion
  - Animations et transitions fluides
-->

<template>
  <!-- Conteneur principal de la sidebar avec animation de largeur -->
  <div :class="[
    'bg-white shadow-lg h-full flex flex-col transition-all duration-300',
    collapsed ? 'w-16' : 'w-64' // Largeur dynamique selon l'état
  ]">
    
    <!-- SECTION LOGO ET TITRE -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center">
        <!-- Icône de l'application -->
        <div class="bg-primary-600 text-white rounded-lg p-2">
          <i class="fas fa-graduation-cap text-xl"></i>
        </div>
        
        <!-- Titre avec animation de fondu -->
        <Transition name="fade">
          <div v-if="!collapsed" class="ml-3">
            <h1 class="text-xl font-bold text-gray-900">Scolaris</h1>
            <p class="text-sm text-gray-500">Gestion Scolaire</p>
          </div>
        </Transition>
      </div>
    </div>

    <!-- SECTION NAVIGATION PRINCIPALE -->
    <nav class="flex-1 p-4">
      <ul class="space-y-2">
        <!-- Boucle sur les éléments de menu filtrés par rôle -->
        <li v-for="item in filteredMenuItems" :key="item.name">
          <router-link
            :to="item.path"
            :class="[
              'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
              // Style conditionnel selon l'état actif
              isActive(item.path)
                ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            ]"
          >
            <!-- Icône du menu -->
            <i :class="item.icon" class="text-lg"></i>
            
            <!-- Texte du menu avec animation -->
            <Transition name="fade">
              <span v-if="!collapsed" class="ml-3">{{ item.name }}</span>
            </Transition>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- SECTION INFORMATIONS UTILISATEUR -->
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center">
        <!-- Avatar utilisateur -->
        <div class="bg-gray-200 rounded-full p-2">
          <i class="fas fa-user text-gray-600"></i>
        </div>
        
        <!-- Informations utilisateur avec animation -->
        <Transition name="fade">
          <div v-if="!collapsed" class="ml-3">
            <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
            <p class="text-xs text-gray-500 capitalize">{{ authStore.user?.role }}</p>
          </div>
        </Transition>
      </div>
    </div>

    <!-- BOUTON DE RÉDUCTION/EXPANSION -->
    <button
      @click="$emit('toggle-sidebar')"
      class="absolute -right-3 top-20 bg-primary-600 text-white rounded-full p-1 shadow-md hover:bg-primary-700 transition-colors"
    >
      <!-- Icône qui change selon l'état -->
      <i :class="collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'" class="text-xs"></i>
    </button>
  </div>
</template>

<script setup>
/**
 * LOGIQUE DU COMPOSANT SIDEBAR
 * 
 * Gère la navigation, le filtrage par rôle et les états d'affichage
 */

import { computed } from 'vue'
import { useRoute } from 'vue-router' // Pour détecter la route active
import { useAuthStore } from '@/stores/auth' // Pour les informations utilisateur

// PROPRIÉTÉS REÇUES DU COMPOSANT PARENT
defineProps({
  collapsed: Boolean // État de réduction de la sidebar
})

// ÉVÉNEMENTS ÉMIS VERS LE COMPOSANT PARENT
defineEmits(['toggle-sidebar']) // Événement de basculement d'état

// HOOKS ET STORES
const route = useRoute() // Route actuelle
const authStore = useAuthStore() // Store d'authentification

/**
 * CONFIGURATION DU MENU DE NAVIGATION
 * 
 * Chaque élément contient :
 * - name : Nom affiché
 * - path : Route de destination
 * - icon : Classe CSS de l'icône FontAwesome
 * - roles : Rôles autorisés à voir cet élément
 */
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

/**
 * PROPRIÉTÉ CALCULÉE : MENU FILTRÉ PAR RÔLE
 * 
 * Ne montre que les éléments de menu auxquels l'utilisateur
 * connecté a accès selon son rôle.
 */
const filteredMenuItems = computed(() => {
  return menuItems.filter(item => 
    item.roles.includes(authStore.user?.role)
  )
})

/**
 * FONCTION DE VÉRIFICATION DE ROUTE ACTIVE
 * 
 * @param {string} path - Chemin de la route à vérifier
 * @returns {boolean} - True si la route est active
 */
function isActive(path) {
  return route.path === path
}
</script>

<!--
  STYLES CSS POUR LES ANIMATIONS
  
  Les transitions 'fade' sont définies globalement dans style.css
  pour créer des effets de fondu fluides lors du collapse/expand
-->