<template>
  <div class="layout-container">
    <Sidebar :collapsed="sidebarCollapsed" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    
    <div class="main-content">
      <Header />
      
      <main class="p-6 space-y-6">
        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="stat-card">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm">Total Élèves</p>
                <p class="text-3xl font-bold text-white">{{ totalStudents }}</p>
                <p class="text-white/60 text-xs">+{{ newStudentsThisYear }} cette année</p>
              </div>
              <i class="fas fa-user-graduate text-white/60 text-3xl"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-success-500 to-success-600 text-white rounded-lg p-6 shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm">Moyenne Générale</p>
                <p class="text-3xl font-bold text-white">{{ overallAverage.toFixed(1) }}/20</p>
                <p class="text-white/60 text-xs">{{ getAverageStatus(overallAverage) }}</p>
              </div>
              <i class="fas fa-chart-line text-white/60 text-3xl"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-warning-500 to-warning-600 text-white rounded-lg p-6 shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm">Taux de Réussite</p>
                <p class="text-3xl font-bold text-white">{{ successRate.toFixed(1) }}%</p>
                <p class="text-white/60 text-xs">≥ 10/20</p>
              </div>
              <i class="fas fa-trophy text-white/60 text-3xl"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-danger-500 to-danger-600 text-white rounded-lg p-6 shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm">Total Revenus</p>
                <p class="text-3xl font-bold text-white">{{ formatCurrency(totalRevenue) }}</p>
                <p class="text-white/60 text-xs">{{ totalPayments }} paiements</p>
              </div>
              <i class="fas fa-money-bill-wave text-white/60 text-3xl"></i>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Students by Class -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Répartition des Élèves par Classe</h3>
            <div class="space-y-4">
              <div
                v-for="stat in studentsByClass"
                :key="stat.className"
                class="flex items-center justify-between"
              >
                <div class="flex items-center">
                  <div class="w-4 h-4 rounded mr-3" :style="{ backgroundColor: stat.color }"></div>
                  <span class="text-sm font-medium text-gray-900">{{ stat.className }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-600">{{ stat.count }} élèves</span>
                  <div class="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full transition-all duration-300"
                      :style="{ 
                        width: `${(stat.count / totalStudents) * 100}%`,
                        backgroundColor: stat.color
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Average by Subject -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Moyennes par Matière</h3>
            <div class="space-y-4">
              <div
                v-for="stat in averagesBySubject"
                :key="stat.subjectName"
                class="flex items-center justify-between"
              >
                <div class="flex-1">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm font-medium text-gray-900">{{ stat.subjectName }}</span>
                    <span :class="getGradeClass(stat.average)" class="text-sm font-bold px-2 py-1 rounded">
                      {{ stat.average.toFixed(1) }}/20
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      :class="getGradeBarClass(stat.average)"
                      class="h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${(stat.average / 20) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Statistics -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Gender Distribution -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Répartition par Sexe</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                  <span class="text-sm font-medium text-gray-900">Masculin</span>
                </div>
                <span class="text-sm text-gray-600">{{ maleStudents }} ({{ ((maleStudents / totalStudents) * 100).toFixed(1) }}%)</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-pink-500 rounded mr-3"></div>
                  <span class="text-sm font-medium text-gray-900">Féminin</span>
                </div>
                <span class="text-sm text-gray-600">{{ femaleStudents }} ({{ ((femaleStudents / totalStudents) * 100).toFixed(1) }}%)</span>
              </div>
            </div>
          </div>

          <!-- Financial Overview -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Aperçu Financier</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Revenus totaux</span>
                <span class="font-medium text-success-600">{{ formatCurrency(totalRevenue) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Paiements ce mois</span>
                <span class="font-medium text-primary-600">{{ paymentsThisMonth }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Taux de paiement</span>
                <span class="font-medium text-warning-600">{{ paymentRate.toFixed(1) }}%</span>
              </div>
            </div>
          </div>

          <!-- Recent Activities -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Activités Récentes</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <div class="bg-primary-100 text-primary-600 rounded-full p-1">
                  <i class="fas fa-user-plus text-xs"></i>
                </div>
                <div class="flex-1 text-sm">
                  <p class="font-medium text-gray-900">{{ recentActivities.newStudents }} nouveaux élèves</p>
                  <p class="text-gray-600">Cette semaine</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="bg-success-100 text-success-600 rounded-full p-1">
                  <i class="fas fa-clipboard-list text-xs"></i>
                </div>
                <div class="flex-1 text-sm">
                  <p class="font-medium text-gray-900">{{ recentActivities.gradesEntered }} notes saisies</p>
                  <p class="text-gray-600">Aujourd'hui</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="bg-warning-100 text-warning-600 rounded-full p-1">
                  <i class="fas fa-money-bill text-xs"></i>
                </div>
                <div class="flex-1 text-sm">
                  <p class="font-medium text-gray-900">{{ recentActivities.paymentsReceived }} paiements</p>
                  <p class="text-gray-600">Cette semaine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import { useStudentsStore } from '@/stores/students'
import { useClassesStore } from '@/stores/classes'
import { useSubjectsStore } from '@/stores/subjects'
import { useGradesStore } from '@/stores/grades'
import { useFinanceStore } from '@/stores/finance'
import { useAuthStore } from '@/stores/auth'

const sidebarCollapsed = ref(false)
const studentsStore = useStudentsStore()
const classesStore = useClassesStore()
const subjectsStore = useSubjectsStore()
const gradesStore = useGradesStore()
const financeStore = useFinanceStore()
const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})

const colors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
]

const totalStudents = computed(() => studentsStore.students.length)

const newStudentsThisYear = computed(() => {
  const thisYear = new Date().getFullYear()
  return studentsStore.students.filter(student => 
    new Date(student.enrollmentDate).getFullYear() === thisYear
  ).length
})

const overallAverage = computed(() => {
  const grades = gradesStore.grades
  if (grades.length === 0) return 0
  
  const total = grades.reduce((sum, grade) => sum + grade.grade, 0)
  return total / grades.length
})

const successRate = computed(() => {
  const grades = gradesStore.grades
  if (grades.length === 0) return 0
  
  const passingGrades = grades.filter(grade => grade.grade >= 10).length
  return (passingGrades / grades.length) * 100
})

const totalRevenue = computed(() => financeStore.totalRevenue)

const totalPayments = computed(() => financeStore.payments.length)

const studentsByClass = computed(() => {
  return classesStore.classes.map((classe, index) => ({
    className: classe.name,
    count: studentsStore.getStudentsByClass(classe.id).length,
    color: colors[index % colors.length]
  })).sort((a, b) => b.count - a.count)
})

const averagesBySubject = computed(() => {
  const subjectAverages = {}
  
  gradesStore.grades.forEach(grade => {
    if (!subjectAverages[grade.subjectId]) {
      subjectAverages[grade.subjectId] = {
        subjectId: grade.subjectId,
        subjectName: getSubjectName(grade.subjectId),
        total: 0,
        count: 0
      }
    }
    subjectAverages[grade.subjectId].total += grade.grade
    subjectAverages[grade.subjectId].count++
  })
  
  return Object.values(subjectAverages)
    .map(subject => ({
      ...subject,
      average: subject.count > 0 ? subject.total / subject.count : 0
    }))
    .sort((a, b) => b.average - a.average)
})

const maleStudents = computed(() => 
  studentsStore.students.filter(student => student.gender === 'M').length
)

const femaleStudents = computed(() => 
  studentsStore.students.filter(student => student.gender === 'F').length
)

const paymentsThisMonth = computed(() => {
  const thisMonth = new Date().toISOString().substr(0, 7)
  return financeStore.payments.filter(p => p.date.startsWith(thisMonth)).length
})

const paymentRate = computed(() => {
  // Simplified calculation - in real app would be more complex
  const expectedPayments = totalStudents.value * 2 // Assuming 2 payments per student on average
  const actualPayments = totalPayments.value
  return expectedPayments > 0 ? (actualPayments / expectedPayments) * 100 : 0
})

const recentActivities = computed(() => ({
  newStudents: Math.floor(Math.random() * 5) + 1,
  gradesEntered: Math.floor(Math.random() * 20) + 10,
  paymentsReceived: Math.floor(Math.random() * 8) + 3
}))

function getSubjectName(subjectId) {
  const subject = subjectsStore.getSubjectById(subjectId)
  return subject ? subject.name : 'Matière inconnue'
}

function getAverageStatus(average) {
  if (average >= 16) return 'Excellent'
  if (average >= 14) return 'Très bien'
  if (average >= 12) return 'Bien'
  if (average >= 10) return 'Assez bien'
  return 'À améliorer'
}

function getGradeClass(grade) {
  if (grade >= 16) return 'text-green-600'
  if (grade >= 14) return 'text-blue-600'
  if (grade >= 10) return 'text-yellow-600'
  return 'text-red-600'
}

function getGradeBarClass(grade) {
  if (grade >= 16) return 'bg-green-500'
  if (grade >= 14) return 'bg-blue-500'
  if (grade >= 10) return 'bg-yellow-500'
  return 'bg-red-500'
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount).replace('XOF', 'FCFA')
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