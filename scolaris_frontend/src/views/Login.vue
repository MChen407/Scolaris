<template>

 <!-- Loading overlay après connexion -->
  <LoadingSpinner 
    :show="loadingData" 
    title="Connexion réussie !" 
    message="Chargement de vos données en cours..." 
  />

  <div class="h-screen grid grid-cols-1 lg:grid-cols-2 animate-fade-in">
    
    <!-- Carte Gauche - Carrousel avec Logo -->
    <div class="bg-white overflow-hidden animate-slide-left h-full">
      <div class="relative h-full">
        <!-- Carrousel d'images -->
        <div class="absolute inset-0">
          <div 
            v-for="(image, index) in backgroundImages" 
            :key="index"
            :class="[
              'absolute inset-0 bg-cover bg-center transition-opacity duration-1000',
              currentImageIndex === index ? 'opacity-100' : 'opacity-0'
            ]"
            :style="{ backgroundImage: `url(${image})` }"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-600/40 to-transparent"></div>
          </div>
        </div>
        
        <!-- Contenu superposé -->
        <div class="relative z-10 h-full flex flex-col justify-center items-center text-center p-8">
          <div class="mb-6 animate-bounce-gentle">
            <img src="@/assets/logo.png" alt="Scolaris" class="w-30 h-40 rounded-xl mx-auto">
          </div>
          <h1 class="text-5xl font-bold text-white mb-4 drop-shadow-2xl">Scolaris</h1>
          <p class="text-xl text-white/90 drop-shadow-lg mb-8">Votre partenaire sûr de gestion scolaire</p>
          <div class="flex space-x-2">
            <div 
              v-for="(_, index) in backgroundImages" 
              :key="index"
              :class="[
                'w-3 h-3 rounded-full transition-all duration-300',
                currentImageIndex === index ? 'bg-white' : 'bg-white/50'
              ]"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Carte Droite - Formulaire -->
    <div class="bg-white p-8 animate-slide-right h-full">
      <div class="h-full flex flex-col justify-center">
        <div class="text-center mb-4">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Connexion</h2>
          <p class="text-gray-600">Accédez à votre espace de gestion</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="username" class="block text-left max-w-sm mx-auto text-sm font-medium text-gray-700 mb-2">
              Nom d'utilisateur
            </label>
            <input
              id="username"
              v-model="credentials.username"
              type="text"
              required
              class="w-full max-w-sm mx-auto block px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Entrez votre nom d'utilisateur"
            >
          </div>

          <div>
            <label for="password" class="block text-left max-w-sm mx-auto text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="credentials.password"
              type="password"
              required
              class="w-full max-w-sm mx-auto block px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Entrez votre mot de passe"
            >
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full max-w-sm mx-auto block bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            Se connecter
          </button>
        </form>
        
        <!-- <div class="mt-8 pt-6 border-t border-gray-200">
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
          </div> -->
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()

const credentials = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const loadingData = ref(false)
const error = ref('')
const currentImageIndex = ref(0)

import imgScolaris from '@/assets/imgScolaris.jpg'
import imgScolaris1 from '@/assets/imgScolaris1.jpg'
import imgScolaris2 from '@/assets/imgScolaris2.jpg'

const backgroundImages = [
  imgScolaris,
  imgScolaris1,
  imgScolaris2
]

let imageInterval = null

onMounted(() => {
  authStore.initAuth()
  if (authStore.isAuthenticated) {
    router.push('/')
  }

  imageInterval = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % backgroundImages.length
  }, 4000)
  
   
})

onUnmounted(() => {
  if (imageInterval) {
    clearInterval(imageInterval)
  }
})

async function handleLogin() {
  loading.value = true
  error.value = ''

 try {
    const success = authStore.login(credentials.value.username, credentials.value.password)
    
    if (success) {
      loading.value = false
      loadingData.value = true // Démarrer le loading des données
      
      // Simuler le chargement des données (2-3 secondes)
      setTimeout(() => {
        loadingData.value = false
        router.push('/')
      }, 2500)
    } else {
      error.value = 'Nom d\'utilisateur ou mot de passe incorrect'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue lors de la connexion'
  } finally {
    if (!loadingData.value) {
      loading.value = false
    }
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounceGentle {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-slide-left {
  animation: slideLeft 0.8s ease-out;
}

.animate-slide-right {
  animation: slideRight 0.8s ease-out 0.2s both;
}

.animate-bounce-gentle {
  animation: bounceGentle 3s ease-in-out infinite;
}
</style>
