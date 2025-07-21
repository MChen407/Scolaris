<template>
  <div class="layout-container">
    <Sidebar :collapsed="sidebarCollapsed" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    
    <div class="main-content">
      <Header />
      
      <main class="p-6">
        <BaseTable
          :data="classesStore.classesWithStats"
          :columns="columns"
          title="Liste des Classes"
        >
          <template #actions>
            <button @click="showAddModal = true" class="btn-primary">
              <i class="fas fa-plus mr-2"></i>
              Nouvelle Classe
            </button>
          </template>
          
          <template #cell-studentCount="{ value }">
            <span class="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm font-medium">
              {{ value }} élèves
            </span>
          </template>
          
          <template #row-actions="{ item }">
            <div class="flex gap-2">
              <button
                @click="editClass(item)"
                class="text-primary-600 hover:text-primary-900 transition-colors"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="viewStudents(item)"
                class="text-success-600 hover:text-success-900 transition-colors"
              >
                <i class="fas fa-users"></i>
              </button>
              <button
                @click="deleteClass(item)"
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
          :title="editingClass ? 'Modifier la Classe' : 'Nouvelle Classe'"
          @close="closeModal"
          @confirm="saveClass"
          :loading="loading"
        >
          <form @submit.prevent="saveClass" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom de la classe</label>
              <input
                v-model="classForm.name"
                type="text"
                required
                class="input-field"
                placeholder="Ex: 6ème A"
              >
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                <select v-model="classForm.level" required class="input-field">
                  <option value="">Sélectionner</option>
                  <option value="6ème">6ème</option>
                  <option value="5ème">5ème</option>
                  <option value="4ème">4ème</option>
                  <option value="3ème">3ème</option>
                  <option value="2nde">2nde</option>
                  <option value="1ère">1ère</option>
                  <option value="Tle">Terminale</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <select v-model="classForm.section" required class="input-field">
                  <option value="">Sélectionner</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Capacité d'accueil</label>
              <input
                v-model.number="classForm.capacity"
                type="number"
                required
                min="1"
                max="50"
                class="input-field"
                placeholder="Nombre maximum d'élèves"
              >
            </div>
          </form>
        </BaseModal>

        <!-- Students List Modal -->
        <BaseModal
          :show="showStudentsModal"
          :title="`Élèves de ${selectedClass?.name}`"
          :show-footer="false"
          @close="showStudentsModal = false"
        >
          <div v-if="classStudents.length > 0" class="space-y-3">
            <div
              v-for="student in classStudents"
              :key="student.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 class="font-medium text-gray-900">{{ student.firstName }} {{ student.lastName }}</h4>
                <p class="text-sm text-gray-600">{{ student.gender === 'M' ? 'Masculin' : 'Féminin' }} - {{ formatDate(student.birthDate) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ student.guardian }}</p>
                <p class="text-xs text-gray-500">{{ student.phone }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <i class="fas fa-users text-4xl mb-3"></i>
            <p>Aucun élève dans cette classe</p>
          </div>
        </BaseModal>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import BaseTable from '@/components/common/BaseTable.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { useClassesStore } from '@/stores/classes'
import { useStudentsStore } from '@/stores/students'
import { useAuthStore } from '@/stores/auth'

const sidebarCollapsed = ref(false)
const classesStore = useClassesStore()
const studentsStore = useStudentsStore()
const authStore = useAuthStore()

const showAddModal = ref(false)
const showEditModal = ref(false)
const showStudentsModal = ref(false)
const loading = ref(false)
const editingClass = ref(null)
const selectedClass = ref(null)

const classForm = ref({
  name: '',
  level: '',
  section: '',
  capacity: 30
})

onMounted(() => {
  authStore.initAuth()
})

const columns = [
  { key: 'name', label: 'Nom' },
  { key: 'level', label: 'Niveau' },
  { key: 'section', label: 'Section' },
  { key: 'capacity', label: 'Capacité' },
  { key: 'studentCount', label: 'Élèves inscrits' }
]

const classStudents = computed(() => {
  if (!selectedClass.value) return []
  return studentsStore.getStudentsByClass(selectedClass.value.id)
})

function editClass(classe) {
  editingClass.value = classe
  classForm.value = { ...classe }
  showEditModal.value = true
}

function viewStudents(classe) {
  selectedClass.value = classe
  showStudentsModal.value = true
}

function deleteClass(classe) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la classe ${classe.name} ?`)) {
    const studentsInClass = studentsStore.getStudentsByClass(classe.id)
    if (studentsInClass.length > 0) {
      alert('Impossible de supprimer une classe qui contient des élèves.')
      return
    }
    classesStore.deleteClass(classe.id)
  }
}

function closeModal() {
  showAddModal.value = false
  showEditModal.value = false
  editingClass.value = null
  resetForm()
}

function resetForm() {
  classForm.value = {
    name: '',
    level: '',
    section: '',
    capacity: 30
  }
}

async function saveClass() {
  loading.value = true
  
  try {
    if (editingClass.value) {
      classesStore.updateClass(editingClass.value.id, { ...classForm.value })
    } else {
      classesStore.addClass({ ...classForm.value })
    }
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    loading.value = false
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('fr-FR')
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