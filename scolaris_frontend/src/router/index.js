/**
 * CONFIGURATION DU ROUTEUR VUE ROUTER
 * 
 * Ce fichier définit toutes les routes de l'application Scolaris
 * et gère l'authentification et les autorisations par rôle.
 */

// Importation des dépendances Vue Router
import { createRouter, createWebHistory } from 'vue-router'
// Store d'authentification pour vérifier les permissions
import { useAuthStore } from '@/stores/auth.js'

// Importation de tous les composants de pages
import Dashboard from '@/views/Dashboard.vue' // Tableau de bord principal
import Login from '@/views/Login.vue' // Page de connexion
import Students from '@/views/Students.vue' // Gestion des élèves
import Classes from '@/views/Classes.vue' // Gestion des classes
import Teachers from '@/views/Teachers.vue' // Gestion des enseignants
import Subjects from '@/views/Subjects.vue' // Gestion des matières
import Grades from '@/views/Grades.vue' // Gestion des notes
import Reports from '@/views/Reports.vue' // Génération de bulletins
import Finance from '@/views/Finance.vue' // Gestion financière
import Statistics from '@/views/Statistics.vue' // Statistiques et analyses


/**
 * DÉFINITION DES ROUTES
 * 
 * Chaque route contient :
 * - path : URL de la route
 * - name : Nom unique de la route
 * - component : Composant à afficher
 * - meta : Métadonnées (authentification, rôles autorisés)
 */
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

// Création de l'instance du routeur avec l'historique HTML5
const router = createRouter({
  history: createWebHistory(), // Utilise l'API History du navigateur
  routes
})

/**
 * GARDE DE NAVIGATION (Navigation Guard)
 * 
 * Exécutée avant chaque changement de route pour :
 * 1. Vérifier l'authentification de l'utilisateur
 * 2. Vérifier les autorisations par rôle
 * 3. Rediriger vers la page appropriée si nécessaire
 */
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

// Export du routeur pour utilisation dans main.js
export default router