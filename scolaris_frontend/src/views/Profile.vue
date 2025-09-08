<template>
  <div class="layout-container">
    <Sidebar :collapsed="sidebarCollapsed" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    
    <div class="main-content flex flex-col overflow-auto">
      <Header />
      
      <main class="p-6 flex-1 overflow-auto">
        <div class="max-w-4xl mx-auto">
          <div class="bg-white rounded-lg shadow-lg p-8">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">Profil de l'établissement</h1>
                <p class="text-gray-600 mt-1">Configurez les informations de votre établissement</p>
              </div>
              <button
                @click="toggleEdit"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <i :class="isEditing ? 'fas fa-times' : 'fas fa-edit'" class="mr-2"></i>
                {{ isEditing ? 'Annuler' : 'Modifier' }}
              </button>
            </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Logo -->
          <div class="text-center mb-8">
            <div class="w-32 h-32 mx-auto mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <img v-if="form.logo" :src="form.logo" alt="Logo" class="w-full h-full object-contain rounded-lg">
              <i v-else class="fas fa-image text-4xl text-gray-400"></i>
            </div>
            <input
              v-if="isEditing"
              type="file"
              @change="handleLogoUpload"
              accept="image/*"
              class="hidden"
              ref="logoInput"
            >
            <button
              v-if="isEditing"
              type="button"
              @click="$refs.logoInput.click()"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Changer le logo
            </button>
          </div>

          <!-- Informations -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom de l'établissement</label>
              <input
                v-model="form.name"
                type="text"
                :disabled="!isEditing"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="Nom de l'établissement"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                v-model="form.email"
                type="email"
                :disabled="!isEditing"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="email@etablissement.com"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              <input
                v-model="form.phone"
                type="tel"
                :disabled="!isEditing"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="+33 1 23 45 67 89"
              >
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
              <textarea
                v-model="form.address"
                :disabled="!isEditing"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="Adresse complète de l'établissement"
              ></textarea>
            </div>
          </div>

          <!-- Boutons -->
          <div v-if="isEditing" class="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              @click="cancelEdit"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
              Enregistrer
            </button>
          </div>
        </form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import { useRoute } from 'vue-router'
import { useSchoolStore } from '@/stores/school'

const route = useRoute()
const schoolStore = useSchoolStore()
const { schoolInfo, loading } = schoolStore

const sidebarCollapsed = ref(false)
const isEditing = ref(false)
const form = ref({
  name: '',
  logo: '',
  phone: '',
  address: '',
  email: ''
})

onMounted(async () => {
  await schoolStore.fetchSchoolInfo()
  resetForm()
})

// Rafraîchir les données quand on revient sur la vue
watch(() => route.path, async (newPath) => {
  if (newPath === '/profile') {
    await schoolStore.fetchSchoolInfo()
    resetForm()
    isEditing.value = false
  }
}, { immediate: true })

function resetForm() {
  form.value = { ...schoolInfo.value }
}

function toggleEdit() {
  isEditing.value = !isEditing.value
  if (!isEditing.value) {
    resetForm()
  }
}

function cancelEdit() {
  isEditing.value = false
  resetForm()
}

function handleLogoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.logo = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

async function handleSubmit() {
  const success = await schoolStore.updateSchoolInfo(form.value)
  if (success) {
    isEditing.value = false
  }
}
</script>

<style scoped>
.layout-container {
  @apply flex h-screen bg-gray-50;
}

.main-content {
  @apply flex-1 flex flex-col overflow-hidden;
}
</style>