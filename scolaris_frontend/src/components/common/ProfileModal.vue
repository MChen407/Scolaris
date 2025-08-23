<template>
  <BaseModal
    :show="show"
    title="Profil utilisateur"
    @close="$emit('close')"
    :show-footer="false"
    class="max-w-4xl"
  >
    <div class="space-y-6">
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'profile'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <i class="fas fa-user mr-2"></i>
            Mon Profil
          </button>
          <button
            @click="activeTab = 'school'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'school'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <i class="fas fa-school mr-2"></i>
            Établissement
          </button>
        </nav>
      </div>

      <!-- Profile Tab -->
      <div v-if="activeTab === 'profile'" class="space-y-6">
        <div class="flex items-center space-x-6">
          <div class="flex-shrink-0">
            <div class="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl">
              <i class="fas fa-user"></i>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">{{ userProfile.name }}</h3>
            <p class="text-sm text-gray-500 capitalize">{{ userProfile.role }}</p>
            <p class="text-sm text-gray-500">{{ userProfile.email }}</p>
          </div>
        </div>

        <form @submit.prevent="updateProfile" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <input
                v-model="userProfile.name"
                type="text"
                required
                class="input-field"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="userProfile.email"
                type="email"
                required
                class="input-field"
              >
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
              <input
                v-model="userProfile.newPassword"
                type="password"
                class="input-field"
                placeholder="Laisser vide pour ne pas changer"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
              <input
                v-model="userProfile.confirmPassword"
                type="password"
                class="input-field"
                placeholder="Confirmer le nouveau mot de passe"
              >
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="updatingProfile"
              class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <i v-if="updatingProfile" class="fas fa-spinner fa-spin mr-2"></i>
              Mettre à jour le profil
            </button>
          </div>
        </form>
      </div>

      <!-- School Tab -->
      <div v-if="activeTab === 'school'" class="space-y-6">
        <div class="flex items-center space-x-6">
          <div class="flex-shrink-0">
            <div class="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              <img v-if="schoolProfile.logo" :src="schoolProfile.logo" alt="Logo" class="w-full h-full object-contain">
              <i v-else class="fas fa-school text-gray-400 text-2xl"></i>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">{{ schoolProfile.name || 'Nom de l\'établissement' }}</h3>
            <p class="text-sm text-gray-500">{{ schoolProfile.address || 'Adresse non définie' }}</p>
            <p class="text-sm text-gray-500">{{ schoolProfile.phone || 'Téléphone non défini' }}</p>
          </div>
        </div>

        <form @submit.prevent="updateSchool" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'établissement</label>
            <input
              v-model="schoolProfile.name"
              type="text"
              required
              class="input-field"
              placeholder="Ex: Lycée Jean Dupont"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <textarea
              v-model="schoolProfile.address"
              required
              rows="3"
              class="input-field"
              placeholder="Adresse complète de l'établissement"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                v-model="schoolProfile.phone"
                type="tel"
                required
                class="input-field"
                placeholder="Ex: +225 01 02 03 04 05"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="schoolProfile.email"
                type="email"
                class="input-field"
                placeholder="contact@etablissement.com"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Logo de l'établissement</label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors duration-300">
              <div class="space-y-1 text-center">
                <div v-if="!logoPreview">
                  <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                  <div class="flex text-sm text-gray-600">
                    <label class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
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

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="updatingSchool"
              class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <i v-if="updatingSchool" class="fas fa-spinner fa-spin mr-2"></i>
              Mettre à jour l'établissement
            </button>
          </div>
        </form>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import { useAuthStore } from '@/stores/auth'
import { useSchoolStore } from '@/stores/school'
import { useAlert } from '@/composables/useAlert'
import { usersAPI } from '@/services/api'

const emit = defineEmits(['close'])
const props = defineProps({
  show: { type: Boolean, default: false }
})

const authStore = useAuthStore()
const schoolStore = useSchoolStore()
const { showSuccess, showError } = useAlert()

const activeTab = ref('profile')
const updatingProfile = ref(false)
const updatingSchool = ref(false)
const logoPreview = ref('')

const userProfile = ref({
  name: '',
  email: '',
  role: '',
  newPassword: '',
  confirmPassword: ''
})

const schoolProfile = ref({
  name: '',
  address: '',
  phone: '',
  email: '',
  logo: null
})

onMounted(() => {
  loadUserProfile()
  loadSchoolProfile()
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    loadUserProfile()
    loadSchoolProfile()
  }
})

function loadUserProfile() {
  if (authStore.user) {
    userProfile.value = {
      name: authStore.user.name || '',
      email: authStore.user.email || '',
      role: authStore.user.role || '',
      newPassword: '',
      confirmPassword: ''
    }
  }
}

async function loadSchoolProfile() {
  await schoolStore.fetchSchoolInfo()
  const info = schoolStore.schoolInfo
  schoolProfile.value = {
    name: info.name || '',
    address: info.address || '',
    phone: info.phone || '',
    email: info.email || '',
    logo: info.logo || null
  }
  logoPreview.value = info.logo || ''
}

async function updateProfile() {
  if (userProfile.value.newPassword && userProfile.value.newPassword !== userProfile.value.confirmPassword) {
    showError('Erreur', 'Les mots de passe ne correspondent pas')
    return
  }

  updatingProfile.value = true
  try {
    const updateData = {
      name: userProfile.value.name,
      email: userProfile.value.email
    }
    
    if (userProfile.value.newPassword) {
      updateData.password = userProfile.value.newPassword
    }
    
    const response = await usersAPI.updateProfile(updateData)
    
    if (response.success) {
      // Mettre à jour le store auth
      authStore.user = {
        ...authStore.user,
        name: userProfile.value.name,
        email: userProfile.value.email
      }
      
      showSuccess('Succès', 'Profil mis à jour avec succès')
      userProfile.value.newPassword = ''
      userProfile.value.confirmPassword = ''
    } else {
      showError('Erreur', response.message || 'Erreur lors de la mise à jour')
    }
  } catch (error) {
    console.error('Erreur API:', error)
    showError('Erreur', 'Erreur lors de la mise à jour du profil')
  } finally {
    updatingProfile.value = false
  }
}

async function updateSchool() {
  updatingSchool.value = true
  try {
    const success = await schoolStore.updateSchoolInfo({
      name: schoolProfile.value.name,
      address: schoolProfile.value.address,
      phone: schoolProfile.value.phone,
      email: schoolProfile.value.email,
      logo: schoolProfile.value.logo
    })
    
    if (success) {
      showSuccess('Succès', 'Informations de l\'établissement mises à jour')
      window.dispatchEvent(new CustomEvent('schoolConfigUpdated'))
    } else {
      showError('Erreur', 'Erreur lors de la mise à jour')
    }
  } catch (error) {
    showError('Erreur', 'Erreur lors de la mise à jour')
  } finally {
    updatingSchool.value = false
  }
}

function handleLogoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      showError('Erreur', 'Le fichier est trop volumineux (max 2MB)')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target.result
      schoolProfile.value.logo = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function removeLogo() {
  logoPreview.value = ''
  schoolProfile.value.logo = null
}
</script>