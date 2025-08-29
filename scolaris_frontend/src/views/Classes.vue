<template>
  <div class="layout-container">
    <Sidebar :collapsed="sidebarCollapsed" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    
    <div class="main-content flex flex-col overflow-auto">
      <Header />
      
      <main class="p-6 flex-1 overflow-auto">
        <!-- Filtres par niveau -->
        <div class="mb-6 flex gap-4">
          <button 
            @click="selectedNiveau = null" 
            :class="selectedNiveau === null ? 'bg-blue-600 text-white' : 'bg-gray-200'"
            class="px-4 py-2 rounded"
          >
            Toutes
          </button>
          <button 
            @click="selectedNiveau = 'Primaire'" 
            :class="selectedNiveau === 'Primaire' ? 'bg-blue-600 text-white' : 'bg-gray-200'"
            class="px-4 py-2 rounded"
          >
            Primaire
          </button>
          <button 
            @click="selectedNiveau = 'Secondaire'" 
            :class="selectedNiveau === 'Secondaire' ? 'bg-blue-600 text-white' : 'bg-gray-200'"
            class="px-4 py-2 rounded"
          >
            Secondaire
          </button>
        </div>

        <BaseTable
          :data="filteredClasses"
          :columns="columns"
          title="Liste des Classes"
        >
          <template #actions>
            <button @click="openAddModal" class="btn-primary">
              <i class="fas fa-plus mr-2"></i>
              Nouvelle Classe
            </button>
            <button @click="exportClassesPDF" :disabled="isExporting" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
              <i v-if="isExporting" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-file-pdf mr-2"></i>
              Exporter PDF
            </button>
          </template>
          
          <template #cell-studentCount="{ value }">
            <span class="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm font-medium">
              {{ value }} élèves
            </span>
          </template>
          <template #cell-niveau="{ value }">
            <span :class="value === 'Primaire' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'" 
                  class="px-2 py-1 rounded-full text-xs">
              {{ value }}
            </span>
          </template>
          <template #cell-subjects="{ item }">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="subjectName in getSubjectNames(item.Subjects)"
                :key="subjectName"
                class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs"
              >
                {{ subjectName }}
              </span>
            </div>
          </template>
          
          <template #row-actions="{ item }">
            <div class="flex gap-2">
              <button
                @click="editClass(item)"
                class="text-primary-600 hover:text-primary-900 transition-colors"
                title="Modifier"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="viewStudents(item)"
                class="text-success-600 hover:text-success-900 transition-colors"
                title="Voir les élèves"
              >
                <i class="fas fa-users"></i>
              </button>
              <button
                @click="manageCoefficients(item)"
                class="text-purple-600 hover:text-purple-900 transition-colors"
                title="Gérer les coefficients"
              >
                <i class="fas fa-calculator"></i>
              </button>
              <button
                @click="deleteClass(item)"
                class="text-danger-600 hover:text-danger-900 transition-colors"
                title="Supprimer"
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
                autocomplete="off"
              >
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Niveau Scolaire</label>
                <select v-model="classForm.level" required class="input-field">
                  <option value="">Sélectionner</option>
                  <option value="CI">CI</option>
                  <option value="CP">CP</option>
                  <option value="CE1">CE1</option>
                  <option value="CE2">CE2</option>
                  <option value="CM1">CM1</option>
                  <option value="CM2">CM2</option>
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
                <select v-model="classForm.section" class="input-field">
                  <option value="">Optionnel</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                <select v-model="classForm.niveau" required class="input-field">
                  <option value="">Sélectionner niveau</option>
                  <option value="Primaire">Primaire</option>
                  <option value="Secondaire">Secondaire</option>
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
                    v-model="classForm.subjects"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  >
                  <span class="text-sm">{{ subject.name }}</span>
                </label>
              </div>
            </div>
          </form>
        </BaseModal>

        <!-- Coefficients Modal -->
        <BaseModal
          :show="showCoefficientsModal"
          :title="`Coefficients - ${selectedClass?.name || ''}`"
          @close="showCoefficientsModal = false"
          @confirm="saveCoefficients"
          :loading="loadingCoefficients"
        >
          <div class="space-y-4 max-h-96 overflow-auto">
            <div
              v-for="subject in subjectsStore.subjects"
              :key="subject.id"
              class="flex items-center justify-between p-3 rounded-lg border-l-4"
              :class="getSubjectCardClass(subject.id)"
            >
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <h4 class="font-medium text-gray-900">{{ subject.name }}</h4>
                  <span 
                    v-if="coefficients[subject.id] > 0"
                    class="px-2 py-1 text-xs rounded-full font-medium"
                    :class="getCoefficientBadgeClass(coefficients[subject.id])"
                  >
                    Coeff: {{ coefficients[subject.id] }}
                  </span>
                </div>
                <p class="text-sm text-gray-600">{{ subject.category }}</p>
                <div class="text-xs text-gray-500 mt-1">
                  <span class="font-medium">{{ getClassesUsingSubject(subject.id) }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">Coefficient:</label>
                <input
                  v-model.number="coefficients[subject.id]"
                  type="number"
                  min="0"
                  step="0.5"
                  class="w-20 px-2 py-1 border rounded text-center"
                  :class="getCoefficientInputClass(coefficients[subject.id])"
                  placeholder="0"
                >
              </div>
            </div>
          </div>
        </BaseModal>

        <!-- Students List Modal -->
        <BaseModal
          :show="showStudentsModal"
          :title="`Élèves de ${selectedClass?.name || ''}`"
          :show-footer="false"
          @close="showStudentsModal = false"
        >
          <div v-if="classStudents.length > 0" class="space-y-3 max-h-96 overflow-auto">
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
          title="Chargement des classes" 
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
import { useClassesStore } from '@/stores/classes'
import { useStudentsStore } from '@/stores/students'
import { useAuthStore } from '@/stores/auth'
import { useSubjectsStore } from '@/stores/subjects'
import { usePDFExport } from '@/composables/usePDFExport'
import { useAlert } from '@/composables/useAlert'
import axios from 'axios'

const sidebarCollapsed = ref(false)
const classesStore = useClassesStore()
const studentsStore = useStudentsStore()
const authStore = useAuthStore()
const subjectsStore = useSubjectsStore()
const { isExporting, exportToPDF } = usePDFExport()
const { showAlert, alertConfig, showSuccess, showError, showConfirm, closeAlert, confirmAlert } = useAlert()

function getSubjectNames(subjects) {
  if (!subjects || !Array.isArray(subjects)) return []
  return subjects.map(s => s.name)
}

const showAddModal = ref(false)
const showEditModal = ref(false)
const showStudentsModal = ref(false)
const showCoefficientsModal = ref(false)
const loading = ref(false)
const loadingCoefficients = ref(false)
const pageLoading = ref(true)
const editingClass = ref(null)
const selectedClass = ref(null)
const coefficients = ref({})
const allClassCoefficients = ref({})

const classForm = ref({
  name: '',
  level: '',
  section: '',
  capacity: 30,
  niveau: '',
  subjects: []
})

const filteredClasses = computed(() => {
  if (!selectedNiveau.value) return classesStore.classesWithStats
  return classesStore.classesWithStats.filter(c => c.niveau === selectedNiveau.value)
})

onMounted(async () => {
  try {
    await authStore.initAuth()
    await classesStore.fetchClasses()
  } finally {
    setTimeout(() => {
      pageLoading.value = false
    }, 800)
  }
})

const selectedNiveau = ref(null)

const columns = [
  { key: 'name', label: 'Nom' },
  { key: 'level', label: 'Niveau Scolaire' },
  { key: 'section', label: 'Section' },
  { key: 'niveau', label: 'Niveau' },
  { key: 'capacity', label: 'Capacité' },
  { key: 'studentCount', label: 'Élèves inscrits' },
  {key: 'subjects', label: 'Matières'}
]

const classStudents = computed(() => {
  if (!selectedClass.value) return []
  return studentsStore.getStudentsByClass(selectedClass.value.id)
})

function openAddModal() {
  resetForm()
  editingClass.value = null
  showAddModal.value = true
}

function editClass(classe) {
  editingClass.value = classe
  classForm.value = {
    name: classe.name,
    level: classe.level,
    section: classe.section,
    capacity: classe.capacity,
    niveau: classe.niveau,
    subjects: classe.Subjects ? classe.Subjects.map(s => s.id) : []
  }
  showEditModal.value = true
  showAddModal.value = false
}

function viewStudents(classe) {
  selectedClass.value = classe
  showStudentsModal.value = true
}

async function manageCoefficients(classe) {
  selectedClass.value = classe
  loadingCoefficients.value = true
  
  try {
    // Charger les coefficients existants pour cette classe
    const response = await axios.get(`http://localhost:3000/api/coefficients/class/${classe.id}`)
    const existingCoeffs = response.data
    
    // Charger tous les coefficients pour toutes les classes
    const allClassesPromises = classesStore.classes.map(async (c) => {
      try {
        const coeffsResponse = await axios.get(`http://localhost:3000/api/coefficients/class/${c.id}`)
        return { classId: c.id, className: c.name, coefficients: coeffsResponse.data }
      } catch (error) {
        return { classId: c.id, className: c.name, coefficients: [] }
      }
    })
    
    const allClassesData = await Promise.all(allClassesPromises)
    
    allClassCoefficients.value = {}
    allClassesData.forEach(classData => {
      allClassCoefficients.value[classData.classId] = {
        name: classData.className,
        coefficients: classData.coefficients
      }
    })
    
    // Initialiser les coefficients
    coefficients.value = {}
    subjectsStore.subjects.forEach(subject => {
      const existing = existingCoeffs.find(c => c.subjectId === subject.id)
      coefficients.value[subject.id] = existing ? existing.coefficient : 0
    })
    
    showCoefficientsModal.value = true
  } catch (error) {
    console.error('Erreur lors du chargement des coefficients:', error)
  } finally {
    loadingCoefficients.value = false
  }
}

async function saveCoefficients() {
  loadingCoefficients.value = true
  
  try {
    // Sauvegarder chaque coefficient
    for (const [subjectId, coefficient] of Object.entries(coefficients.value)) {
      if (coefficient > 0) {
        await axios.post('http://localhost:3000/api/coefficients', {
          classId: selectedClass.value.id,
          subjectId: parseInt(subjectId),
          coefficient: parseFloat(coefficient)
        })
      }
    }
    
    showSuccess('Succès', 'Coefficients sauvegardés avec succès')
    showCoefficientsModal.value = false
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    showError('Erreur', 'Erreur lors de la sauvegarde des coefficients')
  } finally {
    loadingCoefficients.value = false
  }
}

function getSubjectCardClass(subjectId) {
  const coeff = coefficients.value[subjectId] || 0
  if (coeff === 0) return 'bg-gray-50 border-gray-300'
  if (coeff <= 1) return 'bg-green-50 border-green-400'
  if (coeff <= 2) return 'bg-blue-50 border-blue-400'
  if (coeff <= 3) return 'bg-yellow-50 border-yellow-400'
  if (coeff <= 4) return 'bg-orange-50 border-orange-400'
  return 'bg-red-50 border-red-400'
}

function getCoefficientBadgeClass(coefficient) {
  if (coefficient <= 1) return 'bg-green-100 text-green-800'
  if (coefficient <= 2) return 'bg-blue-100 text-blue-800'
  if (coefficient <= 3) return 'bg-yellow-100 text-yellow-800'
  if (coefficient <= 4) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

function getCoefficientInputClass(coefficient) {
  if (!coefficient || coefficient === 0) return 'border-gray-300'
  if (coefficient <= 1) return 'border-green-400 bg-green-50'
  if (coefficient <= 2) return 'border-blue-400 bg-blue-50'
  if (coefficient <= 3) return 'border-yellow-400 bg-yellow-50'
  if (coefficient <= 4) return 'border-orange-400 bg-orange-50'
  return 'border-red-400 bg-red-50'
}

function getClassesUsingSubject(subjectId) {
  const classesUsing = []
  const coefficientsUsed = new Set()
  
  Object.entries(allClassCoefficients.value).forEach(([classId, classData]) => {
    const subjectCoeff = classData.coefficients.find(c => c.subjectId === subjectId)
    if (subjectCoeff && subjectCoeff.coefficient > 0) {
      classesUsing.push(`${classData.name} (${subjectCoeff.coefficient})`)
      coefficientsUsed.add(subjectCoeff.coefficient)
    }
  })
  
  if (classesUsing.length === 0) return 'Aucune'
  
  // Afficher les coefficients uniques en premier
  const uniqueCoeffs = Array.from(coefficientsUsed).sort((a, b) => a - b)
  const coeffsText = uniqueCoeffs.length > 1 
    ? `Coefficients: ${uniqueCoeffs.join(', ')} | ` 
    : `Coefficient: ${uniqueCoeffs[0]} | `
  
  return coeffsText + classesUsing.join(', ')
}

function deleteClass(classe) {
  const studentsInClass = studentsStore.getStudentsByClass(classe.id)
  if (studentsInClass.length > 0) {
    showError('Erreur', 'Impossible de supprimer une classe qui contient des élèves.')
    return
  }
  
  showConfirm(
    'Supprimer la classe',
    `Êtes-vous sûr de vouloir supprimer la classe ${classe.name} ?`,
    () => confirmDeleteClass(classe)
  )
}

async function confirmDeleteClass(classe) {
  try {
    await classesStore.deleteClass(classe.id)
    showSuccess('Succès', 'Classe supprimée avec succès')
  } catch (error) {
    showError('Erreur', 'Erreur lors de la suppression de la classe')
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
    capacity: 30,
    niveau: '',
    subjects: []
  }
}

async function saveClass() {
  loading.value = true
  
  try {
    const data = {
      name: classForm.value.name,
      level: classForm.value.level,
      section: classForm.value.section,
      capacity: classForm.value.capacity,
      niveau: classForm.value.niveau,
      subjectIds: classForm.value.subjects
    }
    
    if (editingClass.value) {
      await classesStore.updateClass(editingClass.value.id, data)
      showSuccess('Succès', 'Classe modifiée avec succès')
    } else {
      await classesStore.addClass(data)
      showSuccess('Succès', 'Classe ajoutée avec succès')
    }
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    showError('Erreur', 'Erreur lors de la sauvegarde de la classe')
  } finally {
    loading.value = false
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

function exportClassesPDF() {
  const classesData = filteredClasses.value.map(classe => ({
    ...classe,
    subjectNames: getSubjectNames(classe.Subjects).join(', ')
  }))
  
  const title = selectedNiveau.value ? `CLASSES - ${selectedNiveau.value}` : 'TOUTES LES CLASSES'
  const filename = selectedNiveau.value ? `classes_${selectedNiveau.value.toLowerCase()}` : 'toutes_classes'
  
  const pdfColumns = [
    { key: 'name', label: 'Nom' },
    { key: 'level', label: 'Niveau Scolaire' },
    { key: 'section', label: 'Section' },
    { key: 'niveau', label: 'Niveau' },
    { key: 'capacity', label: 'Capacite' },
    { key: 'studentCount', label: 'Eleves' },
    { key: 'subjectNames', label: 'Matieres' }
  ]
  
  exportToPDF(
    classesData,
    title,
    pdfColumns,
    filename
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

main {
  /* Permet au main de prendre tout l'espace restant et scrollable */
  @apply flex-1 overflow-auto;
}

.input-field {
  @apply w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary-500;
}

.btn-primary {
  @apply bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors;
}
</style>
