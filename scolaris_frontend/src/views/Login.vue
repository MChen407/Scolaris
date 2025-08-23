<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <!-- Login Form -->
    <div v-if="!showSchoolSetup" class="max-w-md w-full bg-white rounded-lg shadow-xl p-8 animate-fade-in">
      <div class="text-center mb-8">
        <div class="bg-primary-600 text-white rounded-lg p-4 inline-block mb-4 animate-bounce-slow">
          <i class="fas fa-graduation-cap text-3xl"></i>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Scolaris</h2>
        <p class="text-gray-600 mt-2">Système de gestion scolaire</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="animate-slide-up" style="animation-delay: 0.1s">
          <label for="username" class="block text-sm font-medium text-gray-700">
            Nom d'utilisateur
          </label>
          <input
            id="username"
            v-model="credentials.username"
            type="text"
            required
            class="mt-1 input-field transition-all duration-300 focus:scale-105"
            placeholder="Entrez votre nom d'utilisateur"
          >
        </div>

        <div class="animate-slide-up" style="animation-delay: 0.2s">
          <label for="password" class="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            required
            class="mt-1 input-field transition-all duration-300 focus:scale-105"
            placeholder="Entrez votre mot de passe"
          >
        </div>

        <div v-if="error" class="bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded-lg animate-shake">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full btn-primary py-3 text-lg transition-all duration-300 hover:scale-105 animate-slide-up"
          style="animation-delay: 0.3s"
        >
          <i v-if="authStore.loading" class="fas fa-spinner fa-spin mr-2"></i>
          Se connecter
        </button>
      </form>

      <div class="mt-8 pt-6 border-t border-gray-200 animate-slide-up" style="animation-delay: 0.4s">
        <p class="text-xs text-center text-gray-500">
          Connectez-vous avec vos identifiants d'établissement
        </p>
      </div>
    </div>

    <!-- School Setup Form -->
    <div v-if="showSchoolSetup" class="max-w-lg w-full bg-white rounded-lg shadow-xl p-8 animate-fade-in">
      <div class="text-center mb-8">
        <div class="bg-green-600 text-white rounded-lg p-4 inline-block mb-4 animate-pulse">
          <i class="fas fa-school text-3xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-900">Configuration de l'établissement</h2>
        <p class="text-gray-600 mt-2">Configurez les informations de votre établissement</p>
      </div>

      <form @submit.prevent="saveSchoolConfig" class="space-y-6">
        <div class="animate-slide-up" style="animation-delay: 0.1s">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'établissement</label>
          <input
            v-model="schoolConfig.name"
            type="text"
            required
            class="input-field transition-all duration-300 focus:scale-105"
            placeholder="Ex: Lycée Jean Dupont"
          >
        </div>

        <div class="animate-slide-up" style="animation-delay: 0.2s">
          <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <textarea
            v-model="schoolConfig.address"
            required
            rows="3"
            class="input-field transition-all duration-300 focus:scale-105"
            placeholder="Adresse complète de l'établissement"
          ></textarea>
        </div>

        <div class="animate-slide-up" style="animation-delay: 0.3s">
          <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            v-model="schoolConfig.phone"
            type="tel"
            required
            class="input-field transition-all duration-300 focus:scale-105"
            placeholder="Ex: +225 01 02 03 04 05"
          >
        </div>

        <div class="animate-slide-up" style="animation-delay: 0.4s">
          <label class="block text-sm font-medium text-gray-700 mb-1">Logo de l'établissement</label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors duration-300">
            <div class="space-y-1 text-center">
              <div v-if="!logoPreview">
                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                <div class="flex text-sm text-gray-600">
                  <label class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                    <span>Télécharger un fichier</span>
                    <input @change="handleLogoUpload" type="file" accept="image/*" class="sr-only">
                  </label>
                  <p class="pl-1">ou glisser-déposer</p>
                </div>
                <p class="text-xs text-gray-500">PNG, JPG jusqu'à 2MB</p>
              </div>
              <div v-else class="relative">
                <img :src="logoPreview" alt="Logo" class="mx-auto h-32 w-32 object-contain rounded-lg">
                <button @click="removeLogo" type="button" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors">
                  <i class="fas fa-times text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          :disabled="savingConfig"
          class="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105 animate-slide-up"
          style="animation-delay: 0.5s"
        >
          <i v-if="savingConfig" class="fas fa-spinner fa-spin mr-2"></i>
          Sauvegarder et continuer
        </button>
      </form>
    </div>

    <!-- Loading Overlay -->
    <div v-if="authStore.loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 text-center animate-pulse">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Connexion en cours...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSchoolStore } from '@/stores/school'

const router = useRouter()
const authStore = useAuthStore()
const schoolStore = useSchoolStore()

const credentials = ref({
  username: '',
  password: ''
})

const error = ref('')
const showSchoolSetup = ref(false)
const savingConfig = ref(false)
const logoPreview = ref('')

const schoolConfig = ref({
  name: '',
  address: '',
  phone: '',
  logo: null
})

onMounted(() => {
  authStore.initAuth()
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})

async function handleLogin() {
  error.value = ''

  try {
    const success = await authStore.login(credentials.value.username, credentials.value.password)
    
    if (success) {
      router.push('/')
    } else {
      error.value = authStore.error || 'Nom d\'utilisateur ou mot de passe incorrect'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue lors de la connexion'
  }
}

function handleLogoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      error.value = 'Le fichier est trop volumineux (max 2MB)'
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target.result
      schoolConfig.value.logo = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function removeLogo() {
  logoPreview.value = ''
  schoolConfig.value.logo = null
}

async function saveSchoolConfig() {
  savingConfig.value = true
  
  try {
    const success = await schoolStore.createSchoolInfo({
      name: schoolConfig.value.name,
      address: schoolConfig.value.address,
      phone: schoolConfig.value.phone,
      logo: schoolConfig.value.logo
    })
    
    if (success) {
      router.push('/')
    } else {
      error.value = 'Erreur lors de la sauvegarde de la configuration'
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    error.value = 'Erreur lors de la sauvegarde de la configuration'
  } finally {
    savingConfig.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce-slow {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out both;
}

.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style>