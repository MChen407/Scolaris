<template>
  <div class="layout-container">
    <Sidebar :collapsed="sidebarCollapsed" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    
    <div class="main-content">
      <Header />
      
      <main class="p-6 space-y-6 overflow-y-auto max-h-screen">
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

        <!-- Performance Statistics -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Top 3 Students by Class -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Top 3 Élèves par Classe</h3>
            <div class="space-y-4">
              <div v-for="classTop in top3StudentsByClass" :key="classTop.classId" class="border-l-4 border-blue-500 pl-4">
                <h4 class="font-medium text-gray-900 mb-2">{{ classTop.className }}</h4>
                <div class="space-y-2">
                  <div v-for="(student, index) in classTop.students" :key="student.id" class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" :class="getRankClass(index)">
                        {{ index + 1 }}
                      </span>
                      <span class="text-sm font-medium">{{ student.name }}</span>
                    </div>
                    <span class="text-sm font-bold text-blue-600">{{ student.average.toFixed(1) }}/20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Performance by Subject -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Performance par Matière</h3>
            <div class="space-y-3">
              <div v-for="subject in subjectPerformance" :key="subject.id" class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm font-medium text-gray-900">{{ subject.name }}</span>
                    <span class="text-sm font-bold" :class="getPerformanceClass(subject.average)">{{ subject.average.toFixed(1) }}/20</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="h-2 rounded-full transition-all duration-300" :class="getPerformanceBarClass(subject.average)" :style="{ width: `${(subject.average / 20) * 100}%` }"></div>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">{{ subject.studentCount }} élèves</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Class Rankings and Financial Stats -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Best Classes by Average -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Classes avec les Meilleures Moyennes</h3>
            <div class="space-y-3">
              <div v-for="(classe, index) in bestClasses" :key="classe.id" class="flex items-center justify-between p-3 rounded-lg" :class="index === 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold" :class="index === 0 ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-700'">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ classe.name }}</p>
                    <p class="text-xs text-gray-500">{{ classe.studentCount }} élèves</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-bold text-lg" :class="index === 0 ? 'text-yellow-600' : 'text-gray-700'">{{ classe.average.toFixed(1) }}/20</p>
                  <p class="text-xs text-gray-500">{{ getClassPerformanceLabel(classe.average) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Financial Statistics -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques Financières</h3>
            <div class="space-y-4">
              <div class="bg-green-50 p-4 rounded-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-green-600">Revenus Totaux</p>
                    <p class="text-2xl font-bold text-green-700">{{ formatCurrency(financeStats.totalRevenue) }}</p>
                  </div>
                  <i class="fas fa-coins text-green-500 text-2xl"></i>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-blue-50 p-3 rounded-lg text-center">
                  <p class="text-xs text-blue-600">Paiements</p>
                  <p class="text-lg font-bold text-blue-700">{{ financeStats.totalPayments }}</p>
                </div>
                <div class="bg-orange-50 p-3 rounded-lg text-center">
                  <p class="text-xs text-orange-600">Taux Collecte</p>
                  <p class="text-lg font-bold text-orange-700">{{ financeStats.collectionRate.toFixed(1) }}%</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-yellow-50 p-3 rounded-lg text-center">
                  <p class="text-xs text-yellow-600">En Attente</p>
                  <p class="text-lg font-bold text-yellow-700">{{ formatCurrency(financeStats.pendingAmount) }}</p>
                </div>
                <div class="bg-red-50 p-3 rounded-lg text-center">
                  <p class="text-xs text-red-600">En Retard</p>
                  <p class="text-lg font-bold text-red-700">{{ formatCurrency(financeStats.overdueAmount) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Class Statistics -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistiques des Classes</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Élèves</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Moyenne</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Taux Réussite</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Meilleur Élève</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="stat in classStatistics" :key="stat.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-medium text-gray-900">{{ stat.name }}</td>
                  <td class="px-4 py-3 text-center text-gray-700">{{ stat.studentCount }}</td>
                  <td class="px-4 py-3 text-center">
                    <span class="font-bold" :class="getPerformanceClass(stat.average)">{{ stat.average.toFixed(1) }}/20</span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getSuccessRateClass(stat.successRate)">
                      {{ stat.successRate.toFixed(1) }}%
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center text-sm">
                    <div>
                      <p class="font-medium text-gray-900">{{ stat.bestStudent.name }}</p>
                      <p class="text-xs text-gray-500">{{ stat.bestStudent.average.toFixed(1) }}/20</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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

const top3StudentsByClass = computed(() => {
  return classesStore.classes.map(classe => {
    const classStudents = studentsStore.getStudentsByClass(classe.id)
    const studentsWithAverages = classStudents.map(student => {
      const studentGrades = gradesStore.getGradesByStudent(student.id)
      const average = studentGrades.length > 0 ? studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length : 0
      return { id: student.id, name: `${student.firstName} ${student.lastName}`, average }
    }).sort((a, b) => b.average - a.average).slice(0, 3)
    
    return { classId: classe.id, className: classe.name, students: studentsWithAverages }
  })
})

const subjectPerformance = computed(() => {
  return subjectsStore.subjects.map(subject => {
    const subjectGrades = gradesStore.grades.filter(g => g.subjectId === subject.id)
    const average = subjectGrades.length > 0 ? subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length : 0
    const studentCount = new Set(subjectGrades.map(g => g.studentId)).size
    return { id: subject.id, name: subject.name, average, studentCount }
  }).sort((a, b) => b.average - a.average)
})

const bestClasses = computed(() => {
  return classesStore.classes.map(classe => {
    const classStudents = studentsStore.getStudentsByClass(classe.id)
    const allGrades = classStudents.flatMap(student => gradesStore.getGradesByStudent(student.id))
    const average = allGrades.length > 0 ? allGrades.reduce((sum, g) => sum + g.grade, 0) / allGrades.length : 0
    return { id: classe.id, name: classe.name, average, studentCount: classStudents.length }
  }).sort((a, b) => b.average - a.average)
})

const financeStats = computed(() => {
  const payments = financeStore.payments
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)
  const collectionRate = totalRevenue > 0 ? ((totalRevenue - pendingAmount - overdueAmount) / totalRevenue) * 100 : 0
  
  return {
    totalRevenue,
    totalPayments: payments.length,
    pendingAmount,
    overdueAmount,
    collectionRate
  }
})

const classStatistics = computed(() => {
  return classesStore.classes.map(classe => {
    const classStudents = studentsStore.getStudentsByClass(classe.id)
    const allGrades = classStudents.flatMap(student => gradesStore.getGradesByStudent(student.id))
    const average = allGrades.length > 0 ? allGrades.reduce((sum, g) => sum + g.grade, 0) / allGrades.length : 0
    const successRate = allGrades.length > 0 ? (allGrades.filter(g => g.grade >= 10).length / allGrades.length) * 100 : 0
    
    const studentsWithAverages = classStudents.map(student => {
      const studentGrades = gradesStore.getGradesByStudent(student.id)
      const studentAverage = studentGrades.length > 0 ? studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length : 0
      return { name: `${student.firstName} ${student.lastName}`, average: studentAverage }
    }).sort((a, b) => b.average - a.average)
    
    const bestStudent = studentsWithAverages[0] || { name: '-', average: 0 }
    
    return {
      id: classe.id,
      name: classe.name,
      studentCount: classStudents.length,
      average,
      successRate,
      bestStudent
    }
  })
})

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

function getRankClass(index) {
  const classes = ['bg-yellow-500 text-white', 'bg-gray-400 text-white', 'bg-orange-400 text-white']
  return classes[index] || 'bg-gray-300 text-gray-700'
}

function getPerformanceClass(average) {
  if (average >= 16) return 'text-green-600'
  if (average >= 14) return 'text-blue-600'
  if (average >= 10) return 'text-yellow-600'
  return 'text-red-600'
}

function getPerformanceBarClass(average) {
  if (average >= 16) return 'bg-green-500'
  if (average >= 14) return 'bg-blue-500'
  if (average >= 10) return 'bg-yellow-500'
  return 'bg-red-500'
}

function getClassPerformanceLabel(average) {
  if (average >= 16) return 'Excellent'
  if (average >= 14) return 'Très bien'
  if (average >= 12) return 'Bien'
  if (average >= 10) return 'Assez bien'
  return 'À améliorer'
}

function getSuccessRateClass(rate) {
  if (rate >= 80) return 'bg-green-100 text-green-800'
  if (rate >= 60) return 'bg-blue-100 text-blue-800'
  if (rate >= 40) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
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