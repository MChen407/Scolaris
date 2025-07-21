<template>
  <div class="layout-container">
    <Sidebar :collapsed="sidebarCollapsed" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    
    <div class="main-content">
      <Header />
      
      <main class="p-6">
        <BaseTable
          :data="teachersWithDetails"
          :columns="columns"
          title="Liste des Enseignants"
        >
          <template #actions>
            <button @click="showAddModal = true" class="btn-primary">
              <i class="fas fa-plus mr-2"></i>
              Nouvel Enseignant
            </button>
          </template>
          
          <template #cell-subjectNames="{ value }">
            <span class="text-sm">{{ value }}</span>
          </template>
          
          <template #cell-classNames="{ value }">
            <span class="text-sm text-gray-600">{{ value }}</span>
          </template>
          
          <template #row-actions="{ item }">
            <div class="flex gap-2">
              <button
                @click="editTeacher(item)"
                class="text-primary-600 hover:text-primary-900 transition-colors"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="deleteTeacher(item)"
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
          :title="editingTeacher ? 'Modifier l\'Enseignant' : 'Nouvel Enseignant'"
          @close="closeModal"
          @confirm="saveTeacher"
          :loading="loading"
        >
          <form @submit.prevent="saveTeacher" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  v-model="teacherForm.firstName"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Entrez le prénom"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  v-model="teacherForm.lastName"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Entrez le nom"
                >
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  v-model="teacherForm.email"
                  type="email"
                  required
                  class="input-field"
                  placeholder="email@exemple.com"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  v-model="teacherForm.phone"
                  type="tel"
                  required
                  class="input-field"
                  placeholder="Numéro de téléphone"
                >
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Matières enseignées</label>
              <div class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                <label
                  v-for="subject in subjectsStore.subjects"
                  :key="subject.id"
                  class="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    :value="subject.id"
                    v-model="teacherForm.subjects"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  >
                  <span class="text-sm">{{ subject.name }}</span>
                </label>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Classes assignées</label>
              <div class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                <label
                  v-for="classe in classesStore.classes"
                  :key="classe.id"
                  class="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    :value="classe.id"
                    v-model="teacherForm.classes"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  >
                  <span class="text-sm">{{ classe.name }}</span>
                </label>
              </div>
            </div>
          </form>
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
import { useTeachersStore } from '@/stores/teachers'
import { useSubjectsStore } from '@/stores/subjects'
import { useClassesStore } from '@/stores/classes'
import { useAuthStore } from '@/stores/auth'

const sidebarCollapsed = ref(false)
const teachersStore = useTeachersStore()
const subjectsStore = useSubjectsStore()
const classesStore = useClassesStore()
const authStore = useAuthStore()

const showAddModal = ref(false)
const showEditModal = ref(false)
const loading = ref(false)
const editingTeacher = ref(null)

const teacherForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subjects: [],
  classes: []
})

onMounted(() => {
  authStore.initAuth()
})

const columns = [
  { key: 'firstName', label: 'Prénom' },
  { key: 'lastName', label: 'Nom' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Téléphone' },
  { key: 'subjectNames', label: 'Matières' },
  { key: 'classNames', label: 'Classes' }
]

const teachersWithDetails = computed(() => {
  return teachersStore.teachers.map(teacher => ({
    ...teacher,
    subjectNames: teacher.subjects
      .map(id => subjectsStore.getSubjectById(id)?.name)
      .filter(Boolean)
      .join(', '),
    classNames: teacher.classes
      .map(id => classesStore.getClassById(id)?.name)
      .filter(Boolean)
      .join(', ')
  }))
})

function editTeacher(teacher) {
  editingTeacher.value = teacher
  teacherForm.value = { ...teacher }
  showEditModal.value = true
}

function deleteTeacher(teacher) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'enseignant ${teacher.firstName} ${teacher.lastName} ?`)) {
    teachersStore.deleteTeacher(teacher.id)
  }
}

function closeModal() {
  showAddModal.value = false
  showEditModal.value = false
  editingTeacher.value = null
  resetForm()
}

function resetForm() {
  teacherForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subjects: [],
    classes: []
  }
}

async function saveTeacher() {
  loading.value = true
  
  try {
    if (editingTeacher.value) {
      teachersStore.updateTeacher(editingTeacher.value.id, { ...teacherForm.value })
    } else {
      teachersStore.addTeacher({ ...teacherForm.value })
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