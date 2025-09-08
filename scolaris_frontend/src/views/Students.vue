<template>
  <div class="layout-container">
    <Sidebar :collapsed="sidebarCollapsed" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    
    <div class="main-content">
      <Header />
      
      <main class="p-6 overflow-y-auto flex-1">
        <!-- Filtres -->
        <div class="bg-white rounded-lg shadow-sm border mb-6 p-4">
          <div class="flex gap-4 items-end">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Filtrer par niveau</label>
              <select v-model="selectedNiveauFilter" class="input-field">
                <option value="">Tous les niveaux</option>
                <option value="Primaire">Primaire</option>
                <option value="Secondaire">Secondaire</option>
              </select>
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Filtrer par classe</label>
              <select v-model="selectedClassFilter" class="input-field">
                <option value="">Toutes les classes</option>
                <option v-for="classe in filteredClasses" :key="classe.id" :value="classe.id">
                  {{ classe.name }} ({{ classe.niveau }})
                </option>
              </select>
            </div>
            <div>
              <button @click="resetFilters" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        <BaseTable
          :data="filteredStudents"
          :columns="columns"
          title="Liste des Élèves"
          @search="handleSearch"
        >
          <template #actions>
            <button @click="showAddModal = true" class="btn-primary">
              <i class="fas fa-plus mr-2"></i>
              Nouvel Élève
            </button>
            <button @click="exportStudentsPDF" :disabled="isExporting" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
              <i v-if="isExporting" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-file-pdf mr-2"></i>
              Exporter PDF {{ selectedClassFilter ? '(Classe filtrée)' : '(Tous)' }}
            </button>
          </template>
          
          <template #cell-gender="{ value }">
            <span :class="value === 'M' ? 'text-blue-600' : 'text-pink-600'">
              {{ value === 'M' ? 'Masculin' : 'Féminin' }}
            </span>
          </template>
          
          <template #cell-birthDate="{ value }">
            {{ formatDate(value) }}
          </template>
          
          <template #cell-enrollmentStatus="{ value }">
            <span :class="getStatusClass(value)" class="px-2 py-1 rounded-full text-sm font-medium">
              {{ getStatusLabel(value) }}
            </span>
          </template>
          
          <template #row-actions="{ item }">
            <div class="flex gap-2">
              <button
                @click="editStudent(item)"
                class="text-primary-600 hover:text-primary-900 transition-colors"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="viewStudent(item)"
                class="text-success-600 hover:text-success-900 transition-colors"
              >
                <i class="fas fa-eye"></i>
              </button>
              <button
                @click="deleteStudent(item)"
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
          :title="editingStudent ? 'Modifier l\'Élève' : 'Nouvel Élève'"
          @close="closeModal"
          @confirm="saveStudent"
          :loading="loading"
        >
          <form @submit.prevent="saveStudent" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  v-model="studentForm.firstName"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Entrez le prénom"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  v-model="studentForm.lastName"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Entrez le nom"
                >
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                <select v-model="studentForm.gender" required class="input-field">
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                <input
                  v-model="studentForm.birthDate"
                  type="date"
                  required
                  class="input-field"
                >
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tuteur</label>
                <input
                  v-model="studentForm.guardian"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Nom du tuteur"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  v-model="studentForm.phone"
                  type="tel"
                  required
                  class="input-field"
                  placeholder="Numéro de téléphone"
                >
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                <select v-model="selectedNiveauForm" @change="onNiveauChange" required class="input-field">
                  <option value="">Sélectionner niveau</option>
                  <option value="Primaire">Primaire</option>
                  <option value="Secondaire">Secondaire</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                <select v-model="studentForm.classId" required class="input-field" :disabled="!selectedNiveauForm">
                  <option value="">Sélectionner une classe</option>
                  <option
                    v-for="classe in classesByNiveau"
                    :key="classe.id"
                    :value="classe.id"
                  >
                    {{ classe.name }}
                  </option>
                </select>
              </div>
            </div>

            <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Statut d'inscription</label>
    <select v-model="studentForm.enrollmentStatus" required class="input-field">
      <option value="pending">En attente</option>
      <option value="active">Actif</option>
      <option value="suspended">Suspendu</option>
      <option value="graduated">Diplômé</option>
    </select>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Documents requis</label>
    <div class="space-y-2">
      <label class="flex items-center">
        <input type="checkbox" v-model="studentForm.documents.birthCertificate" class="mr-2">
        Acte de naissance
      </label>
      <label class="flex items-center">
        <input type="checkbox" v-model="studentForm.documents.medicalCertificate" class="mr-2">
        Certificat médical
      </label>
      <label class="flex items-center">
        <input type="checkbox" v-model="studentForm.documents.photos" class="mr-2">
        Photos d'identité
      </label>
      <label class="flex items-center">
        <input type="checkbox" v-model="studentForm.documents.previousSchoolReport" class="mr-2">
        Bulletin école précédente
      </label>
    </div>
  </div>
          </form>
        </BaseModal>

        <!-- Student Details Modal -->
        <BaseModal
          :show="showDetailsModal"
          title="Détails de l'Élève"
          :show-footer="false"
          @close="showDetailsModal = false"
          class="max-w-3xl"
        >
          <div v-if="selectedStudent" class="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            <!-- Student Info -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-semibold text-gray-900 mb-3">Informations Personnelles</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">Nom complet:</span>
                  <p class="font-medium">{{ selectedStudent.firstName }} {{ selectedStudent.lastName }}</p>
                </div>
                <div>
                  <span class="text-gray-500">Sexe:</span>
                  <p class="font-medium">{{ selectedStudent.gender === 'M' ? 'Masculin' : 'Féminin' }}</p>
                </div>
                <div>
                  <span class="text-gray-500">Date de naissance:</span>
                  <p class="font-medium">{{ formatDate(selectedStudent.birthDate) }}</p>
                </div>
                <div>
                  <span class="text-gray-500">Classe:</span>
                  <p class="font-medium">{{ getClassName(selectedStudent.classId) }}</p>
                </div>
                <div>
                  <span class="text-gray-500">Tuteur:</span>
                  <p class="font-medium">{{ selectedStudent.guardian }}</p>
                </div>
                <div>
                  <span class="text-gray-500">Téléphone:</span>
                  <p class="font-medium">{{ selectedStudent.phone }}</p>
                </div>
              </div>
            </div>

            <!-- Payment History -->
            <div>
              <h4 class="font-semibold text-gray-900 mb-3">Historique des Paiements</h4>
              <div class="space-y-2">
                <div
                  v-for="payment in selectedStudent.payments || []"
                  :key="payment.id"
                  class="flex justify-between items-center p-3 bg-green-50 rounded-lg"
                >
                  <div>
                    <p class="font-medium text-gray-900">{{ payment.type }}</p>
                    <p class="text-sm text-gray-600">{{ formatDate(payment.date) }}</p>
                  </div>
                  <span class="font-bold text-green-600">{{ formatCurrency(payment.amount) }}</span>
                </div>
                <div v-if="!selectedStudent.payments || selectedStudent.payments.length === 0" class="text-center py-4 text-gray-500">
                  Aucun paiement enregistré
                </div>
              </div>
            </div>
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
          title="Chargement des élèves" 
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
import { useStudentsStore } from '@/stores/students'
import { useClassesStore } from '@/stores/classes'
import { useAuthStore } from '@/stores/auth'
import { usePDFExport } from '@/composables/usePDFExport'
import { useAlert } from '@/composables/useAlert'

const sidebarCollapsed = ref(false)
const studentsStore = useStudentsStore()
const classesStore = useClassesStore()
const authStore = useAuthStore()
const { isExporting, exportToPDF } = usePDFExport()
const { showAlert, alertConfig, showSuccess, showError, showConfirm, closeAlert, confirmAlert } = useAlert()

const showAddModal = ref(false)
const showEditModal = ref(false)
const showDetailsModal = ref(false)
const loading = ref(false)
const pageLoading = ref(true)
const editingStudent = ref(null)
const selectedStudent = ref(null)

const studentForm = ref({
  firstName: '',
  lastName: '',
  gender: '',
  birthDate: '',
  guardian: '',
  phone: '',
  address: '',
  parentName: '',
  parentPhone: '',
  classId: '',
  enrollmentStatus: 'active',
  documents: {
    birthCertificate: false,
    medicalCertificate: false,
    photos: false,
    previousSchoolReport: false
  }
})

const searchTerm = ref('')
const selectedClassFilter = ref('')
const selectedNiveauFilter = ref('')
const selectedNiveauForm = ref('')

onMounted(async () => {
  try {
    await authStore.initAuth()
    await studentsStore.fetchStudents()
    await classesStore.fetchClasses()
  } finally {
    // Simuler un délai pour montrer l'animation
    setTimeout(() => {
      pageLoading.value = false
    }, 1000)
  }
})

// Colonnes de la table
const columns = [
  { key: 'firstName', label: 'Prénom' },
  { key: 'lastName', label: 'Nom' },
  { key: 'gender', label: 'Sexe' },
  { key: 'birthDate', label: 'Date de naissance' },
  { key: 'className', label: 'Classe' },
  { key: 'niveau', label: 'Niveau' },
  { key: 'enrollmentStatus', label: 'Statut' },
  { key: 'guardian', label: 'Tuteur' },
  { key: 'phone', label: 'Téléphone' }
]

// Ajout du nom de classe pour chaque élève
const studentsWithClassNames = computed(() => {
  return studentsStore.students.map(student => {
    const classe = classesStore.getClassById(student.classId)
    return {
      ...student,
      className: classe ? classe.name : 'Non assigné',
      niveau: classe ? classe.niveau : 'Non défini'
    }
  })
})

// Classes filtrées par niveau pour le formulaire
const classesByNiveau = computed(() => {
  if (!selectedNiveauForm.value) return []
  return classesStore.classes.filter(c => c.niveau === selectedNiveauForm.value)
})

// Classes filtrées pour le filtre
const filteredClasses = computed(() => {
  if (!selectedNiveauFilter.value) return classesStore.classes
  return classesStore.classes.filter(c => c.niveau === selectedNiveauFilter.value)
})

// Filtrage par recherche, niveau et classe
const filteredStudents = computed(() => {
  let students = studentsWithClassNames.value
  
  // Filtre par niveau
  if (selectedNiveauFilter.value) {
    students = students.filter(student => student.niveau === selectedNiveauFilter.value)
  }
  
  // Filtre par classe
  if (selectedClassFilter.value) {
    students = students.filter(student => student.classId === parseInt(selectedClassFilter.value))
  }
  
  // Filtre par recherche
  if (searchTerm.value) {
    students = students.filter(student =>
      Object.values(student).some(val =>
        String(val).toLowerCase().includes(searchTerm.value.toLowerCase())
      )
    )
  }
  
  return students
})

// Récupérer le nom d'une classe par id
function getClassName(classId) {
  const classe = classesStore.getClassById(classId)
  return classe ? classe.name : 'Non assigné'
}

function editStudent(student) {
  editingStudent.value = student
  const classe = classesStore.getClassById(student.classId)
  selectedNiveauForm.value = classe?.niveau || ''
  
  studentForm.value = {
    firstName: student.firstName,
    lastName: student.lastName,
    gender: student.gender,
    birthDate: student.birthDate,
    guardian: student.guardian,
    phone: student.phone,
    address: student.address,
    parentName: student.parentName,
    parentPhone: student.parentPhone,
    classId: student.classId,
    enrollmentStatus: student.enrollmentStatus || 'active',
    documents: student.documents || {
      birthCertificate: false,
      medicalCertificate: false,
      photos: false,
      previousSchoolReport: false
    }
  }
  showEditModal.value = true
}

function viewStudent(student) {
  selectedStudent.value = student
  showDetailsModal.value = true
}

function deleteStudent(student) {
  showConfirm(
    'Supprimer l\'élève',
    `Êtes-vous sûr de vouloir supprimer l'élève ${student.firstName} ${student.lastName} ?`,
    () => confirmDeleteStudent(student)
  )
}

async function confirmDeleteStudent(student) {
  try {
    await studentsStore.deleteStudent(student.id)
    showSuccess('Succès', 'Élève supprimé avec succès')
  } catch (error) {
    showError('Erreur', 'Erreur lors de la suppression de l\'élève')
  }
}

function closeModal() {
  showAddModal.value = false
  showEditModal.value = false
  editingStudent.value = null
  resetForm()
}

function resetForm() {
  studentForm.value = {
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    guardian: '',
    phone: '',
    classId: '',
    enrollmentStatus: 'pending',
    documents: {
      birthCertificate: false,
      medicalCertificate: false,
      photos: false,
      previousSchoolReport: false
    }
  }
}

async function saveStudent() {
  loading.value = true
  
  try {
    if (editingStudent.value) {
      await studentsStore.updateStudent(editingStudent.value.id, { ...studentForm.value })
      showSuccess('Succès', 'Élève modifié avec succès')
    } else {
      await studentsStore.addStudent({ ...studentForm.value })
      showSuccess('Succès', 'Élève ajouté avec succès')
    }
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    showError('Erreur', 'Erreur lors de la sauvegarde de l\'élève')
  } finally {
    loading.value = false
  }
}

// Gestion de la recherche
function handleSearch(term) {
  searchTerm.value = term
}

function formatDate(dateString) {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (isNaN(d)) return ''
  return d.toLocaleDateString('fr-FR')
}

function getStatusClass(status) {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'active': 'bg-green-100 text-green-800',
    'suspended': 'bg-red-100 text-red-800',
    'graduated': 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status) {
  const labels = {
    'pending': 'En attente',
    'active': 'Actif',
    'suspended': 'Suspendu',
    'graduated': 'Diplômé'
  }
  return labels[status] || status
        }

function formatCurrency(amount) {
  if (typeof amount !== 'number') return ''
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount).replace('XOF', 'FCFA')
}

function exportStudentsPDF() {
  const pdfColumns = [
    { key: 'firstName', label: 'Prenom' },
    { key: 'lastName', label: 'Nom' },
    { key: 'gender', label: 'Sexe' },
    { key: 'className', label: 'Classe' },
    { key: 'guardian', label: 'Tuteur' },
    { key: 'phone', label: 'Telephone' }
  ]
  
  const className = selectedClassFilter.value ? 
    classesStore.getClassById(parseInt(selectedClassFilter.value))?.name : ''
  const title = className ? `LISTE DES ELEVES - ${className}` : 'LISTE DES ELEVES'
  const filename = className ? `liste_eleves_${className.toLowerCase().replace(/\s+/g, '_')}` : 'liste_eleves'
  
  exportToPDF(
    filteredStudents.value,
    title,
    pdfColumns,
    filename
  )
}

function resetFilters() {
  selectedClassFilter.value = ''
  selectedNiveauFilter.value = ''
  searchTerm.value = ''
}

function onNiveauChange() {
  studentForm.value.classId = ''
}

function getExportLabel() {
  if (selectedNiveauFilter.value && selectedClassFilter.value) {
    const classe = classesStore.getClassById(parseInt(selectedClassFilter.value))
    return `(${classe?.name})`
  } else if (selectedNiveauFilter.value) {
    return `(${selectedNiveauFilter.value})`
  } else if (selectedClassFilter.value) {
    const classe = classesStore.getClassById(parseInt(selectedClassFilter.value))
    return `(${classe?.name})`
  }
  return '(Tous)'
}
</script>

<style scoped>
.layout-container {
  @apply flex h-screen bg-gray-50;
}

.main-content {
  @apply flex-1 flex flex-col overflow-hidden;
}

/* IMPORTANT : Autoriser le scroll sur le contenu principal */
main {
  @apply overflow-y-auto flex-1;
}
</style>
