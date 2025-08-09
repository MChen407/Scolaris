/**
 * STORE D'AUTHENTIFICATION (AUTH STORE)
 * 
 * Gère l'authentification des utilisateurs, les sessions et les rôles.
 * Utilise Pinia pour la gestion d'état global de l'application.
 */

import { defineStore } from 'pinia' // Framework de gestion d'état
import { ref, computed } from 'vue' // Composition API de Vue 3

export const useAuthStore = defineStore('auth', () => {
  // ÉTAT RÉACTIF
  const user = ref(null) // Utilisateur actuellement connecté
  
  // PROPRIÉTÉS CALCULÉES
  // Vérifie si un utilisateur est connecté (user n'est pas null)
  const isAuthenticated = computed(() => !!user.value)

  /**
   * UTILISATEURS DE DÉMONSTRATION
   * 
   * Dans une vraie application, ces données viendraient d'une API/base de données.
   * Trois rôles définis :
   * - admin : Accès complet à toutes les fonctionnalités
   * - secretaire : Gestion des élèves, classes, notes et bulletins
   * - comptable : Gestion financière et tableau de bord
   */
  const demoUsers = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Administrateur' },
    { id: 2, username: 'secretaire', password: 'secret123', role: 'secretaire', name: 'Secrétaire' },
    { id: 3, username: 'comptable', password: 'compta123', role: 'comptable', name: 'Comptable' }
  ]

  /**
   * FONCTION DE CONNEXION
   * 
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe
   * @returns {boolean} - True si la connexion réussit, false sinon
   */
  function login(username, password) {
    // Recherche de l'utilisateur dans la liste des utilisateurs de démo
    const foundUser = demoUsers.find(u => u.username === username && u.password === password)
    
    if (foundUser) {
      // Stockage de l'utilisateur dans l'état réactif
      user.value = { ...foundUser }
      // Sauvegarde dans le localStorage pour la persistance de session
      localStorage.setItem('scolaris_user', JSON.stringify(foundUser))
      return true // Connexion réussie
    }
    return false // Échec de la connexion
  }

  /**
   * FONCTION DE DÉCONNEXION
   * 
   * Efface l'utilisateur de l'état et du localStorage
   */
  function logout() {
    user.value = null // Suppression de l'utilisateur de l'état
    localStorage.removeItem('scolaris_user') // Suppression du localStorage
  }

  /**
   * INITIALISATION DE L'AUTHENTIFICATION
   * 
   * Vérifie s'il y a un utilisateur sauvegardé dans le localStorage
   * au démarrage de l'application pour maintenir la session.
   */
  function initAuth() {
    const savedUser = localStorage.getItem('scolaris_user')
    if (savedUser) {
      // Restauration de l'utilisateur depuis le localStorage
      user.value = JSON.parse(savedUser)
    }
  }

  // EXPORT DES PROPRIÉTÉS ET MÉTHODES PUBLIQUES
  return {
    user, // Utilisateur actuel
    isAuthenticated, // Statut de connexion
    login, // Fonction de connexion
    logout, // Fonction de déconnexion
    initAuth // Fonction d'initialisation
  }
})