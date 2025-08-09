<template>
  <div class="layout-container">
    <Sidebar :collapsed="sidebarCollapsed" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    
    <div class="main-content">
      <Header />
      
      <main class="p-6 space-y-6 overflow-y-auto max-h-screen">
        <!-- Filters -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Génération des Bulletins</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Classe</label>
              <select v-model="selectedClassId" class="input-field">
                <option value="">Toutes les classes</option>
                <option
                  v-for="classe in classesStore.classes"
                  :key="classe.id"
                  :value="classe.id"
                >
                  {{ classe.name }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Période</label>
              <select v-model="selectedPeriod" class="input-field">
                <option value="">Sélectionner une période</option>
                <option value="Trimestre 1">Trimestre 1</option>
                <option value="Trimestre 2">Trimestre 2</option>
                <option value="Trimestre 3">Trimestre 3</option>
              </select>
            </div>
            
            <div class="flex items-end">
              <button 
                @click="generateReports" 
                :disabled="!selectedPeriod"
                class="btn-primary w-full"
              >
                <i class="fas fa-file-alt mr-2"></i>
                Générer Bulletins
              </button>
            </div>
            
            <div class="flex items-end">
              <button 
                @click="showCustomization = !showCustomization" 
                class="btn-secondary w-full"
              >
                <i class="fas fa-palette mr-2"></i>
                Personnaliser
              </button>
            </div>
          </div>
        </div>

        <!-- Customization Panel -->
        <div v-if="showCustomization" class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Personnalisation du Bulletin</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Couleur principale</label>
              <select v-model="customization.primaryColor" class="input-field">
                <option value="blue">Bleu</option>
                <option value="green">Vert</option>
                <option value="purple">Violet</option>
                <option value="red">Rouge</option>
                <option value="indigo">Indigo</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'école</label>
              <input v-model="customization.schoolName" type="text" class="input-field" placeholder="Nom de l'école">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Logo</label>
              <input @change="handleLogoUpload" type="file" accept="image/*" class="input-field">
              <div v-if="customization.logoUrl" class="mt-2">
                <img :src="customization.logoUrl" alt="Logo" class="h-12 w-auto border rounded">
              </div>
            </div>
          </div>
        </div>

        <!-- Student Reports -->
        <div v-if="studentReports.length > 0" class="space-y-4">
          <div
            v-for="report in studentReports"
            :key="report.student.id"
            class="card"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ report.student.firstName }} {{ report.student.lastName }}
                </h3>
                <p class="text-sm text-gray-600">
                  {{ getClassName(report.student.classId) }} - {{ selectedPeriod }}
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="exportToPDF(report)"
                  class="btn-secondary"
                >
                  <i class="fas fa-download mr-2"></i>
                  PDF
                </button>
                <button
                  @click="printReport(report)"
                  class="btn-primary"
                >
                  <i class="fas fa-print mr-2"></i>
                  Imprimer
                </button>
              </div>
            </div>

            <!-- Bulletin Header -->
            <div :class="getHeaderClass()" class="text-white p-6 rounded-lg mb-6">
              <div class="text-center mb-4">
                <div v-if="customization.logoUrl" class="mb-4">
                  <img :src="customization.logoUrl" alt="Logo" class="h-16 mx-auto">
                </div>
                <h2 class="text-2xl font-bold">{{ customization.schoolName || 'BULLETIN SCOLAIRE' }}</h2>
                <p class="opacity-80">{{ selectedPeriod }} - Année Scolaire 2023-2024</p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white/10 p-3 rounded">
                  <span class="text-sm opacity-80">Élève:</span>
                  <p class="font-bold text-lg">{{ report.student.firstName }} {{ report.student.lastName }}</p>
                </div>
                <div class="bg-white/10 p-3 rounded">
                  <span class="text-sm opacity-80">Date de naissance:</span>
                  <p class="font-medium">{{ formatDate(report.student.birthDate) }}</p>
                </div>
                <div class="bg-white/10 p-3 rounded">
                  <span class="text-sm opacity-80">Classe:</span>
                  <p class="font-medium">{{ getClassName(report.student.classId) }}</p>
                </div>
              </div>
            </div>

            <!-- Grades Table -->
            <div class="overflow-x-auto mb-6 shadow-lg rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead :class="getTableHeaderClass()" class="text-white">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                      Matière
                    </th>
                    <th class="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      Coeff
                    </th>
                    <th class="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      Interro 1
                    </th>
                    <th class="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      Interro 2
                    </th>
                    <th class="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      Interro 3
                    </th>
                    <th class="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      Moy.Int
                    </th>
                    <th class="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      Dev 1
                    </th>
                    <th class="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      Dev 2
                    </th>
                    <th class="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      Moy.Mat
                    </th>
                    <th class="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      Moy.Coeff
                    </th>
                    <th class="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      Plus Forte
                    </th>
                    <th class="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      Appréciation
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr
                    v-for="(grade, index) in report.grades"
                    :key="grade.subjectId"
                    :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
                    class="hover:bg-blue-50 transition-colors"
                  >
                    <td class="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                      <div class="flex items-center">
                        <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        {{ grade.subjectName }}
                      </div>
                    </td>
                    <td class="px-2 py-3 whitespace-nowrap text-center">
                      <span class="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                        {{ grade.coefficient }}
                      </span>
                    </td>
                    <td class="px-2 py-3 whitespace-nowrap text-center text-xs">
                      {{ grade.interros[0] || '-' }}
                    </td>
                    <td class="px-2 py-3 whitespace-nowrap text-center text-xs">
                      {{ grade.interros[1] || '-' }}
                    </td>
                    <td class="px-2 py-3 whitespace-nowrap text-center text-xs">
                      {{ grade.interros[2] || '-' }}
                    </td>
                    <td class="px-2 py-3 whitespace-nowrap text-center">
                      <span :class="getGradeClass(grade.interroAvg)" class="px-2 py-1 text-xs font-bold rounded">
                        {{ grade.interroAvg ? grade.interroAvg.toFixed(2) : '-' }}
                      </span>
                    </td>
                    <td class="px-2 py-3 whitespace-nowrap text-center text-xs">
                      {{ grade.devoirs[0] || '-' }}
                    </td>
                    <td class="px-2 py-3 whitespace-nowrap text-center text-xs">
                      {{ grade.devoirs[1] || '-' }}
                    </td>
                    <td class="px-2 py-3 whitespace-nowrap text-center">
                      <span :class="getGradeClass(grade.average)" class="px-2 py-1 text-xs font-bold rounded">
                        {{ grade.average ? grade.average.toFixed(2) : '-' }}
                      </span>
                    </td>
                    <td class="px-2 py-3 whitespace-nowrap text-center">
                      <span class="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-bold rounded">
                        {{ grade.average ? (grade.average * grade.coefficient).toFixed(2) : '-' }}
                      </span>
                    </td>
                    <td class="px-2 py-3 whitespace-nowrap text-center">
                      <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">
                        {{ report.classBestAverages[grade.subjectId] ? report.classBestAverages[grade.subjectId].toFixed(2) : '-' }}
                      </span>
                    </td>
                    <td class="px-2 py-3 whitespace-nowrap text-center">
                      <span :class="getAppreciationClass(grade.average)" class="px-2 py-1 rounded text-xs font-medium">
                        {{ getAppreciation(grade.average) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
                <tfoot :class="getHeaderClass()" class="text-white">
                  <tr>
                    <td colspan="9" class="px-4 py-4 text-sm font-bold uppercase">
                      MOYENNE GÉNÉRALE
                    </td>
                    <td class="px-2 py-4 text-center">
                      <span class="bg-white text-blue-600 px-3 py-2 text-sm font-bold rounded shadow-lg">
                        {{ report.generalAverage.toFixed(2) }}/20
                      </span>
                    </td>
                    <td class="px-2 py-4 text-center text-xs font-semibold">
                      -
                    </td>
                    <td class="px-2 py-4 text-center">
                      <span class="bg-white/20 px-2 py-1 rounded text-xs font-bold">
                        {{ getAppreciation(report.generalAverage) }}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <!-- Class Ranking & Statistics -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-lg shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-green-100 text-sm">Rang dans la classe</p>
                    <p class="text-3xl font-bold">{{ report.classRank }}e</p>
                    <p class="text-green-100 text-sm">sur {{ report.totalStudents }} élèves</p>
                  </div>
                  <div class="text-4xl opacity-20">
                    <i class="fas fa-trophy"></i>
                  </div>
                </div>
              </div>
              <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-purple-100 text-sm">Moyenne de classe</p>
                    <p class="text-3xl font-bold">{{ report.classAverage.toFixed(2) }}</p>
                    <p class="text-purple-100 text-sm">sur 20</p>
                  </div>
                  <div class="text-4xl opacity-20">
                    <i class="fas fa-chart-line"></i>
                  </div>
                </div>
              </div>
              <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg shadow-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-orange-100 text-xs">Premier de classe</p>
                    <p class="text-lg font-bold">{{ report.firstStudentAverage.toFixed(2) }}/20</p>
                    <p class="text-orange-100 text-sm">Meilleure moyenne</p>
                  </div>
                  <div class="text-3xl opacity-20">
                    <i class="fas fa-crown"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="selectedPeriod" class="card text-center py-8">
          <i class="fas fa-file-alt text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">Aucun bulletin à afficher pour cette période</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import { useGradesStore } from '@/stores/grades'
import { useStudentsStore } from '@/stores/students'
import { useClassesStore } from '@/stores/classes'
import { useSubjectsStore } from '@/stores/subjects'
import { useAuthStore } from '@/stores/auth'

const sidebarCollapsed = ref(false)
const gradesStore = useGradesStore()
const studentsStore = useStudentsStore()
const classesStore = useClassesStore()
const subjectsStore = useSubjectsStore()
const authStore = useAuthStore()

const selectedClassId = ref('')
const selectedPeriod = ref('')
const studentReports = ref([])
const showCustomization = ref(false)
const customization = ref({
  primaryColor: 'blue',
  schoolName: '',
  logoUrl: ''
})

function handleLogoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      customization.value.logoUrl = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

onMounted(() => {
  authStore.initAuth()
})

function generateReports() {
  if (!selectedPeriod.value) return

  const students = selectedClassId.value 
    ? studentsStore.getStudentsByClass(selectedClassId.value)
    : studentsStore.students

  const reports = []
  const classBestAverages = {}

  students.forEach(student => {
    const studentGrades = gradesStore.getGradesByStudent(student.id, selectedPeriod.value)
    
    if (studentGrades.length === 0) return

    // Group grades by subject
    const subjectGrades = {}
    studentGrades.forEach(grade => {
      if (!subjectGrades[grade.subjectId]) {
        subjectGrades[grade.subjectId] = {
          subjectId: grade.subjectId,
          subjectName: getSubjectName(grade.subjectId),
          coefficient: getSubjectCoefficient(grade.subjectId),
          interros: [null, null, null],
          devoirs: [null, null]
        }
      }
      if (grade.type === 'Interro' && grade.index !== undefined && grade.index < 3) {
        subjectGrades[grade.subjectId].interros[grade.index] = grade.grade
      }
      if (grade.type === 'Devoir' && grade.index !== undefined && grade.index < 2) {
        subjectGrades[grade.subjectId].devoirs[grade.index] = grade.grade
      }
    })

    // Calculate averages for each subject
    const gradeDetails = Object.values(subjectGrades).map(subject => {
      const validInterros = subject.interros.filter(g => g !== null)
      const interroAvg = validInterros.length ? validInterros.reduce((a, b) => a + b, 0) / validInterros.length : null
      
      const validDevoirs = subject.devoirs.filter(g => g !== null)
      let average = null
      
      if (interroAvg !== null && validDevoirs.length === 2) {
        average = (interroAvg + validDevoirs[0] + validDevoirs[1]) / 3
      } else if (interroAvg !== null && validDevoirs.length === 1) {
        average = (interroAvg + validDevoirs[0]) / 2
      } else if (interroAvg !== null) {
        average = interroAvg
      } else if (validDevoirs.length > 0) {
        average = validDevoirs.reduce((a, b) => a + b, 0) / validDevoirs.length
      }
      
      // Track best average for each subject across all students
      if (average !== null) {
        if (!classBestAverages[subject.subjectId] || average > classBestAverages[subject.subjectId]) {
          classBestAverages[subject.subjectId] = average
        }
      }
      
      return {
        ...subject,
        interroAvg,
        average
      }
    })

    // Calculate general average
    let totalPoints = 0
    let totalCoefficients = 0
    
    gradeDetails.forEach(subject => {
      if (subject.average !== null) {
        totalPoints += subject.average * subject.coefficient
        totalCoefficients += subject.coefficient
      }
    })

    const generalAverage = totalCoefficients > 0 ? totalPoints / totalCoefficients : 0

    reports.push({
      student,
      grades: gradeDetails,
      generalAverage,
      totalPoints,
      classRank: 1,
      totalStudents: students.length,
      classAverage: 0
    })
  })

  // Sort by general average for ranking
  reports.sort((a, b) => b.generalAverage - a.generalAverage)
  
  // Assign ranks and calculate class average
  const classTotal = reports.reduce((sum, report) => sum + report.generalAverage, 0)
  const classAverage = classTotal / reports.length
  const firstStudentAverage = reports.length > 0 ? reports[0].generalAverage : 0

  reports.forEach((report, index) => {
    report.classRank = index + 1
    report.classAverage = classAverage
    report.firstStudentAverage = firstStudentAverage
    report.classBestAverages = classBestAverages
  })

  studentReports.value = reports
}

function getClassName(classId) {
  const classe = classesStore.getClassById(classId)
  return classe ? classe.name : 'Classe inconnue'
}

function getSubjectName(subjectId) {
  const subject = subjectsStore.getSubjectById(subjectId)
  return subject ? subject.name : 'Matière inconnue'
}

function getSubjectCoefficient(subjectId) {
  const subject = subjectsStore.getSubjectById(subjectId)
  return subject ? subject.coefficient : 1
}

function getGradeClass(grade) {
  if (!grade) return 'bg-gray-100 text-gray-800'
  if (grade >= 16) return 'bg-green-100 text-green-800'
  if (grade >= 14) return 'bg-blue-100 text-blue-800'
  if (grade >= 10) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

function getAppreciation(grade) {
  if (!grade) return '-'
  if (grade >= 16) return 'Très Bien'
  if (grade >= 14) return 'Bien'
  if (grade >= 12) return 'Assez Bien'
  if (grade >= 10) return 'Passable'
  return 'Insuffisant'
}

function getAppreciationClass(grade) {
  if (!grade) return 'bg-gray-100 text-gray-600'
  if (grade >= 16) return 'bg-green-100 text-green-800'
  if (grade >= 14) return 'bg-blue-100 text-blue-800'
  if (grade >= 12) return 'bg-yellow-100 text-yellow-800'
  if (grade >= 10) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

function exportToPDF(report) {
  // This would implement PDF generation
  // For now, just show an alert
  alert(`Export PDF pour ${report.student.firstName} ${report.student.lastName} - Non implémenté dans cette démo`)
}

function printReport(report) {
  // This would implement printing
  alert(`Impression pour ${report.student.firstName} ${report.student.lastName} - Non implémenté dans cette démo`)
}

function getHeaderClass() {
  const colors = {
    blue: 'bg-gradient-to-r from-blue-600 to-purple-600',
    green: 'bg-gradient-to-r from-green-600 to-teal-600',
    purple: 'bg-gradient-to-r from-purple-600 to-pink-600',
    red: 'bg-gradient-to-r from-red-600 to-orange-600',
    indigo: 'bg-gradient-to-r from-indigo-600 to-blue-600'
  }
  return colors[customization.value.primaryColor] || colors.blue
}

function getTableHeaderClass() {
  const colors = {
    blue: 'bg-gradient-to-r from-gray-800 to-blue-700',
    green: 'bg-gradient-to-r from-gray-800 to-green-700',
    purple: 'bg-gradient-to-r from-gray-800 to-purple-700',
    red: 'bg-gradient-to-r from-gray-800 to-red-700',
    indigo: 'bg-gradient-to-r from-gray-800 to-indigo-700'
  }
  return colors[customization.value.primaryColor] || colors.blue
}
</script>

<style scoped>
.layout-container {
  @apply flex h-screen bg-gray-50;
}

.main-content {
  @apply flex-1 flex flex-col overflow-hidden;
}

@media print {
  .no-print {
    display: none !important;
  }
}
</style>