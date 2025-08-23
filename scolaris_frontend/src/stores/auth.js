import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  // Données de démonstration
  const demoUsers = {
    admin: { username: 'admin', password: 'admin', name: 'Administrateur', role: 'admin' },
    secretaire: { username: 'secretaire', password: 'secretaire', name: 'Secrétaire', role: 'secretaire' },
    comptable: { username: 'comptable', password: 'comptable', name: 'Comptable', role: 'comptable' }
  }

  const login = (credentials) => {
    const foundUser = Object.values(demoUsers).find(
      u => u.username === credentials.username && u.password === credentials.password
    )
    
    if (foundUser) {
      user.value = foundUser
      localStorage.setItem('user', JSON.stringify(foundUser))
      return { success: true }
    }
    
    return { success: false, message: 'Identifiants incorrects' }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  const checkAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
      return true
    }
    return false
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
})