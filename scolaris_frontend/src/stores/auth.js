import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  // Utilisateurs de démonstration
  const demoUsers = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Administrateur' },
    { id: 2, username: 'secretaire', password: 'secret123', role: 'secretaire', name: 'Secrétaire' },
    { id: 3, username: 'comptable', password: 'compta123', role: 'comptable', name: 'Comptable' }
  ]

  function login(username, password) {
    const foundUser = demoUsers.find(u => u.username === username && u.password === password)
    if (foundUser) {
      user.value = { ...foundUser }
      localStorage.setItem('scolaris_user', JSON.stringify(foundUser))
      return true
    }
    return false
  }

  function logout() {
    user.value = null
    localStorage.removeItem('scolaris_user')
  }

  function initAuth() {
    const savedUser = localStorage.getItem('scolaris_user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    initAuth
  }
})