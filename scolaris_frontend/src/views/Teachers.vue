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
            <button @click="exportTeachersPDF" :disabled="isExporting" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
              <i v-if="isExporting" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-file-pdf mr-2"></i>
              Exporter PDF
            </button>
          </template>
          
          <template #cell-subjectNames="{ value }">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="subjectName in value.split(', ').filter(Boolean)"
                :key="subjectName"
                class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs"
              >
                {{ subjectName }}
              </span>
            </div>
          </template>
          
          <template #cell-classNames="{ value }">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="className in value.split(', ').filter(Boolean)"
                :key="className"
                class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs"
              >
                {{ className }}
              </span>
            </div>
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
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Charge horaire (heures/semaine)</label>
                <input
                  v-model.number="teacherForm.weeklyHours"
                  type="number"
                  required
                  min="0"
                  max="40"
                  class="input-field"
                  placeholder="Nombre d'heures par semaine"
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

        <!-- Alert Modal -->
        <AlertModal
          :show="showAlert"
          :type="alertConfig.type"
          :title="alertConfig.title"
          :message="alertConfig.message"
          @close="closeAlert"
          @confirm="confirmAlert"
        />
        
        <!-- Loading Spinner -->
        <LoadingSpinner 
          :show="pageLoading" 
          title="Chargement des enseignants" 
          message="Récupération des données..."
        />
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
import AlertModal from '@/components/common/AlertModal.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useTeachersStore } from '@/stores/teachers'
import { useSubjectsStore } from '@/stores/subjects'
import { useClassesStore } from '@/stores/classes'
import { useAuthStore } from '@/stores/auth'
import { usePDFExport } from '@/composables/usePDFExport'
import { useAlert } from '@/composables/useAlert'

const sidebarCollapsed = ref(false)
const teachersStore = useTeachersStore()
const subjectsStore = useSubjectsStore()
const classesStore = useClassesStore()
const authStore = useAuthStore()
const { isExporting, exportToPDF } = usePDFExport()
const { showAlert, alertConfig, showSuccess, showError, showConfirm, closeAlert, confirmAlert } = useAlert()

const showAddModal = ref(false)
const showEditModal = ref(false)
const loading = ref(false)
const pageLoading = ref(true)
const editingTeacher = ref(null)

const teacherForm = ref({
 firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subjects: [],
  classes: [],
  weeklyHours: 0
})

onMounted(async () => {
  try {
    await authStore.initAuth()
    await teachersStore.fetchTeachers()
  } finally {
    setTimeout(() => {
      pageLoading.value = false
    }, 900)
  }
})

const columns = [
  { key: 'firstName', label: 'Prénom' },
  { key: 'lastName', label: 'Nom' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Téléphone' },
  { key: 'weeklyHours', label: 'Heures/semaine' },
  { key: 'subjectNames', label: 'Matières' },
  { key: 'classNames', label: 'Classes' }
]

const teachersWithDetails = computed(() => {
  return teachersStore.teachers.map(teacher => ({
    ...teacher,
    subjectNames: (teacher.Subjects || [])
      .map(subject => subject.name)
      .join(', '),
    classNames: (teacher.Classes || [])
      .map(classe => classe.name)
      .join(', ')
  }))
})

function editTeacher(teacher) {
  editingTeacher.value = teacher
  teacherForm.value = {
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    email: teacher.email,
    phone: teacher.phone,
    weeklyHours: teacher.weeklyHours,
    subjects: teacher.Subjects ? teacher.Subjects.map(s => s.id) : [],
    classes: teacher.Classes ? teacher.Classes.map(c => c.id) : []
  }
  showEditModal.value = true
}

function deleteTeacher(teacher) {
  showConfirm(
    'Supprimer l\'enseignant',
    `Êtes-vous sûr de vouloir supprimer l'enseignant ${teacher.firstName} ${teacher.lastName} ?`,
    () => confirmDeleteTeacher(teacher)
  )
}

async function confirmDeleteTeacher(teacher) {
  try {
    await teachersStore.deleteTeacher(teacher.id)
    showSuccess('Succès', 'Enseignant supprimé avec succès')
  } catch (error) {
    showError('Erreur', 'Erreur lors de la suppression de l\'enseignant')
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
    classes: [],
    weeklyHours: 0
  }
}

async function saveTeacher() {
  loading.value = true
  
  try {
    const data = {
      firstName: teacherForm.value.firstName,
      lastName: teacherForm.value.lastName,
      email: teacherForm.value.email,
      phone: teacherForm.value.phone,
      subjectIds: teacherForm.value.subjects,
      classIds: teacherForm.value.classes,
      weeklyHours: teacherForm.value.weeklyHours
    }

    if (editingTeacher.value) {
      await teachersStore.updateTeacher(editingTeacher.value.id, data)
      showSuccess('Succès', 'Enseignant modifié avec succès')
    } else {
      await teachersStore.addTeacher(data)
      showSuccess('Succès', 'Enseignant ajouté avec succès')
    }
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    showError('Erreur', 'Erreur lors de la sauvegarde de l\'enseignant')
  } finally {
    loading.value = false
  }
}

function exportTeachersPDF() {
  const pdfColumns = [
    { key: 'firstName', label: 'Prenom' },
    { key: 'lastName', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Telephone' },
    { key: 'weeklyHours', label: 'Heures/sem' },
    { key: 'subjectNames', label: 'Matieres' }
  ]
  
  exportToPDF(
    teachersWithDetails.value,
    'LISTE DES ENSEIGNANTS',
    pdfColumns,
    'liste_enseignants'
  )
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