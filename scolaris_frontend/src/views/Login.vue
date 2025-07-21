<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
      <div class="text-center mb-8">
        <div class="bg-primary-600 text-white rounded-lg p-4 inline-block mb-4">
          <i class="fas fa-graduation-cap text-3xl"></i>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Scolaris</h2>
        <p class="text-gray-600 mt-2">Système de gestion scolaire</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">
            Nom d'utilisateur
          </label>
          <input
            id="username"
            v-model="credentials.username"
            type="text"
            required
            class="mt-1 input-field"
            placeholder="Entrez votre nom d'utilisateur"
          >
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            required
            class="mt-1 input-field"
            placeholder="Entrez votre mot de passe"
          >
        </div>

        <div v-if="error" class="bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded-lg">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full btn-primary py-3 text-lg"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          Se connecter
        </button>
      </form>

      <div class="mt-8 pt-6 border-t border-gray-200">
        <h3 class="text-sm font-medium text-gray-700 mb-3">Comptes de démonstration :</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Admin:</span>
            <span class="font-medium">admin / admin123</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Secrétaire:</span>
            <span class="font-medium">secretaire / secret123</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Comptable:</span>
            <span class="font-medium">comptable / compta123</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const credentials = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

onMounted(() => {
  authStore.initAuth()
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    const success = authStore.login(credentials.value.username, credentials.value.password)
    
    if (success) {
      router.push('/')
    } else {
      error.value = 'Nom d\'utilisateur ou mot de passe incorrect'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue lors de la connexion'
  } finally {
    loading.value = false
  }
}
</script>