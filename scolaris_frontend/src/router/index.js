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
    meta: { requiresAuth: false } // Accessible sans authentification
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    // Accessible à tous les utilisateurs connectés
    meta: { requiresAuth: true, roles: ['admin', 'secretaire', 'comptable'] }
  },
  {
    path: '/students',
    name: 'Students',
    component: Students,
    // Gestion des élèves : admin et secrétaire uniquement
    meta: { requiresAuth: true, roles: ['admin', 'secretaire'] }
  },
  {
    path: '/classes',
    name: 'Classes',
    component: Classes,
    // Gestion des classes : admin et secrétaire uniquement
    meta: { requiresAuth: true, roles: ['admin', 'secretaire'] }
  },
  {
    path: '/teachers',
    name: 'Teachers',
    component: Teachers,
    // Gestion des enseignants : admin uniquement
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/subjects',
    name: 'Subjects',
    component: Subjects,
    // Gestion des matières : admin uniquement
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/grades',
    name: 'Grades',
    component: Grades,
    // Gestion des notes : admin et secrétaire
    meta: { requiresAuth: true, roles: ['admin', 'secretaire'] }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    // Génération de bulletins : admin et secrétaire
    meta: { requiresAuth: true, roles: ['admin', 'secretaire'] }
  },
  {
    path: '/finance',
    name: 'Finance',
    component: Finance,
    // Gestion financière : admin et comptable
    meta: { requiresAuth: true, roles: ['admin', 'comptable'] }
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics,
    // Statistiques : admin uniquement
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
  // Récupération du store d'authentification
  const authStore = useAuthStore()
  
  // Vérification de l'authentification
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirection vers la page de connexion si non connecté
    next('/login')
  } else if (to.meta.roles && !to.meta.roles.includes(authStore.user?.role)) {
    // Redirection vers le dashboard si rôle non autorisé
    next('/')
  } else {
    // Autorisation d'accès à la route
    next()
  }
})

// Export du routeur pour utilisation dans main.js
export default router