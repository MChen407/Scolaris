<template>
  <div class="layout-container">
    <Sidebar :collapsed="sidebarCollapsed" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    
    <div class="main-content">
      <Header />
      
      <main class="p-6">
        <BaseTable
          :data="subjectsStore.subjects"
          :columns="columns"
          title="Liste des Matières"
        >
          <template #actions>
            <button @click="showAddModal = true" class="btn-primary">
              <i class="fas fa-plus mr-2"></i>
              Nouvelle Matière
            </button>
          </template>
          
          <template #cell-coefficient="{ value }">
            <span class="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm font-medium">
              Coeff. {{ value }}
            </span>
          </template>
          
          <template #cell-category="{ value }">
            <span :class="getCategoryClass(value)" class="px-2 py-1 rounded-full text-sm font-medium">
              {{ value }}
            </span>
          </template>
          
          <template #row-actions="{ item }">
            <div class="flex gap-2">
              <button
                @click="editSubject(item)"
                class="text-primary-600 hover:text-primary-900 transition-colors"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="deleteSubject(item)"
                class="text-danger-600 hover:text-danger-900 transition-colors"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </template>
        </BaseTable>

        <!-- Add/Edit Modal -->
        <BaseModal
          :show="showAddModal || showEditModal"
          :title="editingSubject ? 'Modifier la Matière' : 'Nouvelle Matière'"
          @close="closeModal"
          @confirm="saveSubject"
          :loading="loading"
        >
          <form @submit.prevent="saveSubject" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom de la matière</label>
              <input
                v-model="subjectForm.name"
                type="text"
                required
                class="input-field"
                placeholder="Ex: Mathématiques"
              >
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Coefficient</label>
                <input
                  v-model.number="subjectForm.coefficient"
                  type="number"
                  required
                  min="1"
                  max="10"
                  class="input-field"
                  placeholder="1-10"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select v-model="subjectForm.category" required class="input-field">
                  <option value="">Sélectionner</option>
                  <option value="Sciences">Sciences</option>
                  <option value="Lettres">Lettres</option>
                  <option value="Sciences Humaines">Sciences Humaines</option>
                  <option value="Langues">Langues</option>
                  <option value="Sport">Sport</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>
            </div>
          </form>
        </BaseModal>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import BaseTable from '@/components/common/BaseTable.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { useSubjectsStore } from '@/stores/subjects'
import { useAuthStore } from '@/stores/auth'

const sidebarCollapsed = ref(false)
const subjectsStore = useSubjectsStore()
const authStore = useAuthStore()

const showAddModal = ref(false)
const showEditModal = ref(false)
const loading = ref(false)
const editingSubject = ref(null)

const subjectForm = ref({
  name: '',
  coefficient: 1,
  category: ''
})

onMounted(() => {
  authStore.initAuth()
})

const columns = [
  { key: 'name', label: 'Nom' },
  { key: 'coefficient', label: 'Coefficient' },
  { key: 'category', label: 'Catégorie' }
]

function getCategoryClass(category) {
  const classes = {
    'Sciences': 'bg-blue-100 text-blue-800',
    'Lettres': 'bg-green-100 text-green-800',
    'Sciences Humaines': 'bg-yellow-100 text-yellow-800',
    'Langues': 'bg-purple-100 text-purple-800',
    'Sport': 'bg-red-100 text-red-800',
    'Arts': 'bg-pink-100 text-pink-800'
  }
  return classes[category] || 'bg-gray-100 text-gray-800'
}

function editSubject(subject) {
  editingSubject.value = subject
  subjectForm.value = { ...subject }
  showEditModal.value = true
}

function deleteSubject(subject) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la matière ${subject.name} ?`)) {
    subjectsStore.deleteSubject(subject.id)
  }
}

function closeModal() {
  showAddModal.value = false
  showEditModal.value = false
  editingSubject.value = null
  resetForm()
}

function resetForm() {
  subjectForm.value = {
    name: '',
    coefficient: 1,
    category: ''
  }
}

async function saveSubject() {
  loading.value = true
  
  try {
    if (editingSubject.value) {
      subjectsStore.updateSubject(editingSubject.value.id, { ...subjectForm.value })
    } else {
      subjectsStore.addSubject({ ...subjectForm.value })
    }
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    loading.value = false
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