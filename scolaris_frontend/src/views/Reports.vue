<template>
  <div class="layout-container">
    <Sidebar :collapsed="sidebarCollapsed" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    
    <div class="main-content">
      <Header />
      
      <main class="p-6 space-y-6">
        <!-- Filters -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Génération des Bulletins</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <!-- Student Info -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <span class="text-sm text-gray-500">Nom complet:</span>
                <p class="font-medium">{{ report.student.firstName }} {{ report.student.lastName }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-500">Date de naissance:</span>
                <p class="font-medium">{{ formatDate(report.student.birthDate) }}</p>
              </div>
              <div>
                <span class="text-sm text-gray-500">Classe:</span>
                <p class="font-medium">{{ getClassName(report.student.classId) }}</p>
              </div>
            </div>

            <!-- Grades Table -->
            <div class="overflow-x-auto mb-6">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matière
                    </th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coefficient
                    </th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Note
                    </th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Note × Coeff
                    </th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Appréciation
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="grade in report.grades"
                    :key="grade.subjectId"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ grade.subjectName }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {{ grade.coefficient }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <span :class="getGradeClass(grade.average)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                        {{ grade.average ? grade.average.toFixed(2) : '-' }}/20
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {{ grade.average ? (grade.average * grade.coefficient).toFixed(2) : '-' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {{ getAppreciation(grade.average) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-100">
                  <tr>
                    <td colspan="2" class="px-6 py-4 text-sm font-semibold text-gray-900">
                      MOYENNE GÉNÉRALE
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span :class="getGradeClass(report.generalAverage)" class="inline-flex px-3 py-1 text-sm font-bold rounded-full">
                        {{ report.generalAverage.toFixed(2) }}/20
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Total: {{ report.totalPoints.toFixed(2) }}
                    </td>
                    <td class="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      {{ getAppreciation(report.generalAverage) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <!-- Class Ranking -->
            <div class="flex justify-between items-center p-4 bg-primary-50 rounded-lg">
              <div>
                <span class="text-sm text-primary-600">Rang dans la classe:</span>
                <span class="ml-2 text-lg font-bold text-primary-800">{{ report.classRank }}e / {{ report.totalStudents }}</span>
              </div>
              <div>
                <span class="text-sm text-primary-600">Moyenne de classe:</span>
                <span class="ml-2 text-lg font-bold text-primary-800">{{ report.classAverage.toFixed(2) }}/20</span>
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

onMounted(() => {
  authStore.initAuth()
})

function generateReports() {
  if (!selectedPeriod.value) return

  const students = selectedClassId.value 
    ? studentsStore.getStudentsByClass(selectedClassId.value)
    : studentsStore.students

  const reports = []

  students.forEach(student => {
    const studentGrades = gradesStore.getGradesByStudent(student.id, selectedPeriod.value)
    
    if (studentGrades.length === 0) return

    // Group grades by subject and calculate averages
    const subjectGrades = {}
    studentGrades.forEach(grade => {
      if (!subjectGrades[grade.subjectId]) {
        subjectGrades[grade.subjectId] = {
          subjectId: grade.subjectId,
          subjectName: getSubjectName(grade.subjectId),
          coefficient: getSubjectCoefficient(grade.subjectId),
          grades: []
        }
      }
      subjectGrades[grade.subjectId].grades.push(grade.grade)
    })

    // Calculate averages for each subject
    const gradeDetails = Object.values(subjectGrades).map(subject => {
      const average = subject.grades.reduce((sum, grade) => sum + grade, 0) / subject.grades.length
      return {
        ...subject,
        average
      }
    })

    // Calculate general average
    let totalPoints = 0
    let totalCoefficients = 0
    
    gradeDetails.forEach(subject => {
      totalPoints += subject.average * subject.coefficient
      totalCoefficients += subject.coefficient
    })

    const generalAverage = totalPoints / totalCoefficients

    reports.push({
      student,
      grades: gradeDetails,
      generalAverage,
      totalPoints,
      classRank: 1, // Will be calculated later
      totalStudents: students.length,
      classAverage: 0 // Will be calculated later
    })
  })

  // Sort by general average for ranking
  reports.sort((a, b) => b.generalAverage - a.generalAverage)
  
  // Assign ranks and calculate class average
  const classTotal = reports.reduce((sum, report) => sum + report.generalAverage, 0)
  const classAverage = classTotal / reports.length

  reports.forEach((report, index) => {
    report.classRank = index + 1
    report.classAverage = classAverage
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