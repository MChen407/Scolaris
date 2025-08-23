/**
 * STORE D'AUTHENTIFICATION (AUTH STORE)
 * 
 * Gère l'authentification des utilisateurs, les sessions et les rôles.
 * Utilise Pinia pour la gestion d'état global de l'application.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // ÉTAT RÉACTIF
  const user = ref(null) // Utilisateur actuellement connecté
  
  // PROPRIÉTÉS CALCULÉES
  // Vérifie si un utilisateur est connecté (user n'est pas null)
  const isAuthenticated = computed(() => !!user.value)

  const loading = ref(false)
  const error = ref(null)

  /**
   * FONCTION DE CONNEXION
   * 
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe
   * @returns {boolean} - True si la connexion réussit, false sinon
   */
  async function login(username, password) {
    loading.value = true
    error.value = null
    
    try {
      const response = await authAPI.login({ username, password })
      
      if (response.success && response.user) {
        user.value = response.user
        
        // Sauvegarder le token et les infos utilisateur
        if (response.token) {
          localStorage.setItem('auth_token', response.token)
        }
        localStorage.setItem('scolaris_user', JSON.stringify(response.user))
        localStorage.setItem('current_school_id', response.user.schoolId)
        
        return true
      } else {
        error.value = response.message || 'Identifiants incorrects'
        return false
      }
    } catch (err) {
      console.error('Erreur de connexion:', err)
      // Fallback vers données de démo si API indisponible
      const demoUsers = [
        { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Administrateur', email: 'admin@lycee-dupont.edu', schoolId: 'school_1' },
        { id: 2, username: 'secretaire', password: 'secret123', role: 'secretaire', name: 'Marie Dubois', email: 'secretaire@lycee-dupont.edu', schoolId: 'school_1' },
        { id: 3, username: 'comptable', password: 'compta123', role: 'comptable', name: 'Pierre Martin', email: 'comptable@lycee-dupont.edu', schoolId: 'school_1' },
        { id: 4, username: 'admin2', password: 'admin123', role: 'admin', name: 'Directeur Kouassi', email: 'directeur@college-abidjan.edu', schoolId: 'school_2' }
      ]
      
      const foundUser = demoUsers.find(u => u.username === username && u.password === password)
      if (foundUser) {
        user.value = { ...foundUser }
        localStorage.setItem('scolaris_user', JSON.stringify(foundUser))
        localStorage.setItem('current_school_id', foundUser.schoolId)
        return true
      }
      
      error.value = 'Erreur de connexion au serveur'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * FONCTION DE DÉCONNEXION
   * 
   * Efface l'utilisateur de l'état et du localStorage
   */
  async function logout() {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err)
    } finally {
      user.value = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('scolaris_user')
      localStorage.removeItem('current_school_id')
      localStorage.removeItem('schoolConfig')
    }
  }

  /**
   * INITIALISATION DE L'AUTHENTIFICATION
   * 
   * Vérifie s'il y a un utilisateur sauvegardé dans le localStorage
   * au démarrage de l'application pour maintenir la session.
   */
  async function initAuth() {
    const token = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('scolaris_user')
    
    if (token && savedUser) {
      try {
        // Vérifier la validité du token avec l'API
        const response = await authAPI.me()
        if (response.success && response.user) {
          user.value = response.user
          localStorage.setItem('current_school_id', response.user.schoolId)
        } else {
          // Token invalide, nettoyer
          await logout()
        }
      } catch (err) {
        console.error('Erreur lors de la vérification du token:', err)
        // Fallback vers les données sauvegardées
        user.value = JSON.parse(savedUser)
        if (user.value.schoolId) {
          localStorage.setItem('current_school_id', user.value.schoolId)
        }
      }
    }
  }

  // Obtenir l'ID de l'établissement actuel
  const currentSchoolId = computed(() => user.value?.schoolId || null)

  // EXPORT DES PROPRIÉTÉS ET MÉTHODES PUBLIQUES
  return {
    user,
    isAuthenticated,
    currentSchoolId,
    loading,
    error,
    login,
    logout,
    initAuth
  }
})