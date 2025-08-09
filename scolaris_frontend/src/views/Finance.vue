<template>
  <div class="layout-container">
    <Sidebar :collapsed="sidebarCollapsed" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    
    <div class="main-content">
      <Header />
      
      <main class="p-6 space-y-6 overflow-y-auto max-h-screen">
        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-lg shadow-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                  <i class="fas fa-money-bill-wave text-white text-xl"></i>
                </div>
                <p class="text-2xl font-bold text-white">{{ formatCurrency(financeStore.totalRevenue) }}</p>
                <p class="text-sm text-green-100">Total encaissé</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-lg shadow-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                  <i class="fas fa-clock text-white text-xl"></i>
                </div>
                <p class="text-2xl font-bold text-white">{{ formatCurrency(pendingAmount) }}</p>
                <p class="text-sm text-yellow-100">En attente</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-red-400 to-red-600 text-white rounded-lg shadow-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                  <i class="fas fa-exclamation-triangle text-white text-xl"></i>
                </div>
                <p class="text-2xl font-bold text-white">{{ formatCurrency(overdueAmount) }}</p>
                <p class="text-sm text-red-100">En retard</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-lg shadow-lg p-6">
            <div class="flex items-center justify-between">
              <div>
                <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                  <i class="fas fa-users text-white text-xl"></i>
                </div>
                <p class="text-2xl font-bold text-white">{{ studentsWithPayments }}</p>
                <p class="text-sm text-blue-100">Élèves concernés</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Management -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-900">Gestion des paiements</h2>
              <div class="flex gap-3">
                <button @click="showAddPaymentModal = true" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <i class="fas fa-plus mr-2"></i>
                  Nouveau paiement
                </button>
                <button @click="generateReport" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <i class="fas fa-file-pdf mr-2"></i>
                  Générer reçu
                </button>
              </div>
            </div>
          </div>
          
          <!-- Filters -->
          <div class="p-6 border-b border-gray-200">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Élève</label>
                <select v-model="filters.studentId" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Tous les élèves</option>
                  <option v-for="student in studentsStore.students" :key="student.id" :value="student.id">
                    {{ student.firstName }} {{ student.lastName }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select v-model="filters.status" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Tous les statuts</option>
                  <option value="paid">Payé</option>
                  <option value="pending">En attente</option>
                  <option value="overdue">En retard</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Période</label>
                <select v-model="filters.period" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Ce mois</option>
                  <option value="last-month">Mois dernier</option>
                  <option value="this-year">Cette année</option>
                </select>
              </div>
            </div>
            <div class="mt-4">
              <button @click="applyFilters" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Filtrer
              </button>
            </div>
          </div>
          
          <!-- Payments Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ÉLÈVE</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MONTANT</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE ÉCHÉANCE</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUT</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="payment in filteredPayments" :key="payment.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ payment.reference }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ getStudentName(payment.studentId) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ getFeeTypeName(payment.feeTypeId) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ formatCurrency(payment.amount) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(payment.date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(payment.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ getStatusLabel(payment.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button @click="viewPayment(payment)" class="text-blue-600 hover:text-blue-900 mr-3">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button @click="editPayment(payment)" class="text-yellow-600 hover:text-yellow-900">
                      <i class="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Action Buttons -->
          <div class="p-6 border-t border-gray-200">
            <div class="flex gap-3">
              <button @click="generatePDFReport" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Générer reçu PDF
              </button>
              <button @click="viewPaymentHistory" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Voir historique des paiements
              </button>
            </div>
          </div>
        </div>

        <!-- Teacher Payment Section -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Paiement des enseignants</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Enseignant</label>
                <select v-model="teacherPayment.teacherId" required class="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Sélectionner un enseignant</option>
                  <option v-for="teacher in availableTeachers" :key="teacher.id" :value="teacher.id">
                    {{ teacher.firstName }} {{ teacher.lastName }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Heures</label>
                <input v-model.number="teacherPayment.hours" type="number" placeholder="Nb d'heures" required class="w-full border border-gray-300 rounded-lg px-3 py-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Période</label>
                <select v-model="teacherPayment.period" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="day">Jour</option>
                  <option value="week">Semaine</option>
                  <option value="month">Mois</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Montant/heure (€)</label>
                <input v-model.number="teacherPayment.rate" type="number" placeholder="Montant" required class="w-full border border-gray-300 rounded-lg px-3 py-2">
              </div>
            </div>
            <div class="mt-4">
              <button @click="processTeacherPayment" :disabled="!canProcessTeacherPayment" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <i v-if="processingTeacherPayment" class="fas fa-spinner fa-spin mr-2"></i>
                Valider paiement ({{ calculateTeacherTotal }} €)
              </button>
            </div>
          </div>
        </div>

        <!-- Teacher Payments History -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Historique des paiements enseignants</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ENSEIGNANT</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HEURES</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TAUX/H</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PÉRIODE</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="payment in teacherPayments" :key="payment.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ payment.teacherName }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ payment.hours }}h</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(payment.rate) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{{ formatCurrency(payment.total) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ payment.period }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(payment.date) }}</td>
                </tr>
                <tr v-if="teacherPayments.length === 0">
                  <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun paiement enseignant enregistré
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Payment Modal -->
        <BaseModal
          :show="showAddPaymentModal"
          title="Nouveau Paiement"
          :showFooter="false"
          @close="closePaymentModal"
        >
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rechercher un élève</label>
              <input 
                v-model="studentSearch" 
                type="text" 
                placeholder="Tapez le nom de l'élève..."
                class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
              >
              <select v-model="paymentForm.studentId" required class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">Sélectionner un élève</option>
                <option v-for="student in filteredStudents" :key="student.id" :value="student.id">
                  {{ student.firstName }} {{ student.lastName }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type de frais</label>
              <select v-model="paymentForm.feeTypeId" required class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">Sélectionner un type</option>
                <option v-for="feeType in financeStore.feeTypes" :key="feeType.id" :value="feeType.id">
                  {{ feeType.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Montant</label>
              <input v-model.number="paymentForm.amount" type="number" required class="w-full border border-gray-300 rounded-lg px-3 py-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label>
              <select v-model="paymentForm.method" class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="Espèces">Espèces</option>
                <option value="Chèque">Chèque</option>
                <option value="Virement">Virement</option>
                <option value="Mobile Money">Mobile Money</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select v-model="paymentForm.status" required class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="completed">Payé</option>
                <option value="pending">En attente</option>
                <option value="overdue">En retard</option>
              </select>
            </div>
            
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button type="button" @click="closePaymentModal" class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                Annuler
              </button>
              <button @click="savePayment" :disabled="savingPayment" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                <i v-if="savingPayment" class="fas fa-spinner fa-spin mr-2"></i>
                Confirmer le paiement
              </button>
            </div>
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
import BaseModal from '@/components/common/BaseModal.vue'
import { useFinanceStore } from '@/stores/finance'
import { useStudentsStore } from '@/stores/students'
import { useAuthStore } from '@/stores/auth'
import { useTeachersStore } from '@/stores/teachers'

function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(amount)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const sidebarCollapsed = ref(false)
const financeStore = useFinanceStore()
const studentsStore = useStudentsStore()
const authStore = useAuthStore()
const teachersStore = useTeachersStore()

const showAddPaymentModal = ref(false)
const savingPayment = ref(false)

const paymentForm = ref({
  studentId: '',
  feeTypeId: '',
  amount: 0,
  method: 'Espèces',
  status: 'completed'
})

const studentSearch = ref('')
const processingTeacherPayment = ref(false)
const teacherPayments = ref([])

const filters = ref({
  studentId: '',
  status: '',
  period: ''
})

const teacherPayment = ref({
  teacherId: '',
  hours: 0,
  period: 'day',
  rate: 0
})

const pendingAmount = computed(() => {
  return financeStore.payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)
})

const overdueAmount = computed(() => {
  return financeStore.payments
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0)
})

const studentsWithPayments = computed(() => {
  const uniqueStudents = new Set(financeStore.payments.map(p => p.studentId))
  return uniqueStudents.size
})

const filteredPayments = computed(() => {
  return financeStore.payments.filter(payment => {
    if (filters.value.studentId && payment.studentId !== parseInt(filters.value.studentId)) return false
    if (filters.value.status && payment.status !== filters.value.status) return false
    return true
  })
})

const filteredStudents = computed(() => {
  if (!studentSearch.value) return studentsStore.students
  return studentsStore.students.filter(student => 
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(studentSearch.value.toLowerCase())
  )
})

const availableTeachers = computed(() => {
  return teachersStore.teachers || []
})

const canProcessTeacherPayment = computed(() => {
  return teacherPayment.value.teacherId && 
         teacherPayment.value.hours > 0 && 
         teacherPayment.value.rate > 0
})

const calculateTeacherTotal = computed(() => {
  return (teacherPayment.value.hours * teacherPayment.value.rate).toFixed(2)
})

onMounted(async () => {
  await authStore.initAuth()
})

function getStudentName(studentId) {
  const student = studentsStore.getStudentById(studentId)
  return student ? `${student.firstName} ${student.lastName}` : 'Élève inconnu'
}

function getFeeTypeName(feeTypeId) {
  const feeType = financeStore.feeTypes.find(f => f.id === feeTypeId)
  return feeType ? feeType.name : 'Type inconnu'
}

function getStatusClass(status) {
  const classes = {
    'completed': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'overdue': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status) {
  const labels = {
    'completed': 'Payé',
    'pending': 'En attente',
    'overdue': 'En retard'
  }
  return labels[status] || status
}

function viewPayment(payment) {
  console.log('View payment:', payment)
}

function editPayment(payment) {
  console.log('Edit payment:', payment)
}

function applyFilters() {
  // Filter logic handled by computed property
}



function generateReport() {
  alert('Génération du rapport - Non implémenté')
}

function generatePDFReport() {
  alert('Génération du rapport PDF - Non implémenté')
}

function viewPaymentHistory() {
  alert('Historique des paiements - Non implémenté')
}

async function processTeacherPayment() {
  if (!canProcessTeacherPayment.value) return
  
  processingTeacherPayment.value = true
  try {
    const totalAmount = teacherPayment.value.hours * teacherPayment.value.rate
    const teacher = teachersStore.getTeacherById(teacherPayment.value.teacherId)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add to teacher payments history
    const newPayment = {
      id: Date.now(),
      teacherId: teacherPayment.value.teacherId,
      teacherName: `${teacher?.firstName} ${teacher?.lastName}`,
      hours: teacherPayment.value.hours,
      rate: teacherPayment.value.rate,
      total: totalAmount,
      period: teacherPayment.value.period,
      date: new Date().toISOString().split('T')[0]
    }
    
    teacherPayments.value.push(newPayment)
    
    alert(`Paiement de ${totalAmount}€ validé pour ${teacher?.firstName} ${teacher?.lastName}`)
    
    teacherPayment.value = {
      teacherId: '',
      hours: 0,
      period: 'day',
      rate: 0
    }
  } catch (error) {
    console.error('Erreur lors du paiement enseignant:', error)
    alert('Erreur lors du traitement du paiement')
  } finally {
    processingTeacherPayment.value = false
  }
}

function closePaymentModal() {
  showAddPaymentModal.value = false
  paymentForm.value = { 
    studentId: '', 
    feeTypeId: '', 
    amount: 0, 
    method: 'Espèces',
    status: 'completed'
  }
  studentSearch.value = ''
}

async function savePayment() {
  savingPayment.value = true
  try {
    await financeStore.addPayment({ ...paymentForm.value })
    closePaymentModal()
    alert('Paiement enregistré avec succès!')
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de l\'enregistrement du paiement')
  } finally {
    savingPayment.value = false
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