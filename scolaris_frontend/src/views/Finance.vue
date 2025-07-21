<template>
  <div class="layout-container">
    <Sidebar :collapsed="sidebarCollapsed" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    
    <div class="main-content">
      <Header />
      
      <main class="p-6 space-y-6">
        <!-- Financial Summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gradient-to-r from-success-500 to-success-600 text-white rounded-lg p-6 shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm">Total Revenus</p>
                <p class="text-3xl font-bold text-white">{{ formatCurrency(financeStore.totalRevenue) }}</p>
              </div>
              <i class="fas fa-money-bill-wave text-white/60 text-3xl"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg p-6 shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm">Paiements ce mois</p>
                <p class="text-3xl font-bold text-white">{{ paymentsThisMonth }}</p>
              </div>
              <i class="fas fa-calendar text-white/60 text-3xl"></i>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-warning-500 to-warning-600 text-white rounded-lg p-6 shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white/80 text-sm">Impayés</p>
                <p class="text-3xl font-bold text-white">{{ unpaidCount }}</p>
              </div>
              <i class="fas fa-exclamation-triangle text-white/60 text-3xl"></i>
            </div>
          </div>
        </div>

        <!-- Fee Types Management -->
        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Types de Frais</h3>
            <button @click="showAddFeeTypeModal = true" class="btn-primary">
              <i class="fas fa-plus mr-2"></i>
              Nouveau Type de Frais
            </button>
          </div>
          
          <BaseTable
            :data="financeStore.feeTypes"
            :columns="feeTypeColumns"
            title=""
            :searchable="false"
          >
            <template #cell-amount="{ value }">
              <span class="font-medium text-success-600">{{ formatCurrency(value) }}</span>
            </template>
            
            <template #cell-dueDate="{ value }">
              {{ value ? formatDate(value) : 'Mensuel' }}
            </template>
            
            <template #row-actions="{ item }">
              <div class="flex gap-2">
                <button
                  @click="editFeeType(item)"
                  class="text-primary-600 hover:text-primary-900 transition-colors"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteFeeType(item)"
                  class="text-danger-600 hover:text-danger-900 transition-colors"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </template>
          </BaseTable>
        </div>

        <!-- Payments Management -->
        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Enregistrer un Paiement</h3>
          </div>
          
          <form @submit.prevent="recordPayment" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Élève</label>
              <select v-model="paymentForm.studentId" required class="input-field">
                <option value="">Sélectionner un élève</option>
                <option
                  v-for="student in studentsStore.students"
                  :key="student.id"
                  :value="student.id"
                >
                  {{ student.firstName }} {{ student.lastName }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type de frais</label>
              <select v-model="paymentForm.feeTypeId" required class="input-field">
                <option value="">Sélectionner</option>
                <option
                  v-for="feeType in financeStore.feeTypes"
                  :key="feeType.id"
                  :value="feeType.id"
                >
                  {{ feeType.name }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Montant</label>
              <input
                v-model.number="paymentForm.amount"
                type="number"
                required
                min="0"
                class="input-field"
                placeholder="Montant en FCFA"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label>
              <select v-model="paymentForm.method" required class="input-field">
                <option value="Espèces">Espèces</option>
                <option value="Chèque">Chèque</option>
                <option value="Virement">Virement</option>
                <option value="Mobile Money">Mobile Money</option>
              </select>
            </div>
            
            <div class="md:col-span-4">
              <button type="submit" class="btn-success" :disabled="recordingPayment">
                <i v-if="recordingPayment" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else class="fas fa-plus mr-2"></i>
                Enregistrer le Paiement
              </button>
            </div>
          </form>
        </div>

        <!-- Recent Payments -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Paiements Récents</h3>
          <BaseTable
            :data="recentPayments"
            :columns="paymentColumns"
            title=""
          >
            <template #cell-studentName="{ item }">
              {{ getStudentName(item.studentId) }}
            </template>
            
            <template #cell-feeTypeName="{ item }">
              {{ getFeeTypeName(item.feeTypeId) }}
            </template>
            
            <template #cell-amount="{ value }">
              <span class="font-medium text-success-600">{{ formatCurrency(value) }}</span>
            </template>
            
            <template #cell-date="{ value }">
              {{ formatDate(value) }}
            </template>
            
            <template #cell-method="{ value }">
              <span :class="getPaymentMethodClass(value)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ value }}
              </span>
            </template>
            
            <template #row-actions="{ item }">
              <button
                @click="generateReceipt(item)"
                class="text-primary-600 hover:text-primary-900 transition-colors"
                title="Générer reçu"
              >
                <i class="fas fa-receipt"></i>
              </button>
            </template>
          </BaseTable>
        </div>

        <!-- Fee Type Modal -->
        <BaseModal
          :show="showAddFeeTypeModal || showEditFeeTypeModal"
          :title="editingFeeType ? 'Modifier le Type de Frais' : 'Nouveau Type de Frais'"
          @close="closeFeeTypeModal"
          @confirm="saveFeeType"
          :loading="savingFeeType"
        >
          <form @submit.prevent="saveFeeType" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom du frais</label>
              <input
                v-model="feeTypeForm.name"
                type="text"
                required
                class="input-field"
                placeholder="Ex: Inscription, Mensualité"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Montant (FCFA)</label>
              <input
                v-model.number="feeTypeForm.amount"
                type="number"
                required
                min="0"
                class="input-field"
                placeholder="Montant en FCFA"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
              <input
                v-model="feeTypeForm.dueDate"
                type="date"
                class="input-field"
              >
              <p class="text-xs text-gray-500 mt-1">Laisser vide pour les frais mensuels</p>
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
import { useFinanceStore } from '@/stores/finance'
import { useStudentsStore } from '@/stores/students'
import { useAuthStore } from '@/stores/auth'

const sidebarCollapsed = ref(false)
const financeStore = useFinanceStore()
const studentsStore = useStudentsStore()
const authStore = useAuthStore()

const showAddFeeTypeModal = ref(false)
const showEditFeeTypeModal = ref(false)
const editingFeeType = ref(null)
const savingFeeType = ref(false)
const recordingPayment = ref(false)

const feeTypeForm = ref({
  name: '',
  amount: 0,
  dueDate: ''
})

const paymentForm = ref({
  studentId: '',
  feeTypeId: '',
  amount: 0,
  method: 'Espèces'
})

onMounted(() => {
  authStore.initAuth()
})

const feeTypeColumns = [
  { key: 'name', label: 'Type de frais' },
  { key: 'amount', label: 'Montant' },
  { key: 'dueDate', label: 'Échéance' }
]

const paymentColumns = [
  { key: 'studentName', label: 'Élève' },
  { key: 'feeTypeName', label: 'Type de frais' },
  { key: 'amount', label: 'Montant' },
  { key: 'date', label: 'Date' },
  { key: 'method', label: 'Mode de paiement' },
  { key: 'reference', label: 'Référence' }
]

const recentPayments = computed(() => {
  return financeStore.payments
    .map(payment => ({
      ...payment,
      studentName: getStudentName(payment.studentId),
      feeTypeName: getFeeTypeName(payment.feeTypeId)
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)
})

const paymentsThisMonth = computed(() => {
  const thisMonth = new Date().toISOString().substr(0, 7)
  return financeStore.payments.filter(p => p.date.startsWith(thisMonth)).length
})

const unpaidCount = computed(() => {
  // Simplified logic - in real app, would calculate based on due dates and payments
  return Math.floor(studentsStore.students.length * 0.1) // 10% unpaid rate for demo
})

function getStudentName(studentId) {
  const student = studentsStore.getStudentById(studentId)
  return student ? `${student.firstName} ${student.lastName}` : 'Élève inconnu'
}

function getFeeTypeName(feeTypeId) {
  const feeType = financeStore.feeTypes.find(f => f.id === feeTypeId)
  return feeType ? feeType.name : 'Type inconnu'
}

function getPaymentMethodClass(method) {
  const classes = {
    'Espèces': 'bg-green-100 text-green-800',
    'Chèque': 'bg-blue-100 text-blue-800',
    'Virement': 'bg-purple-100 text-purple-800',
    'Mobile Money': 'bg-orange-100 text-orange-800'
  }
  return classes[method] || 'bg-gray-100 text-gray-800'
}

function editFeeType(feeType) {
  editingFeeType.value = feeType
  feeTypeForm.value = { ...feeType }
  showEditFeeTypeModal.value = true
}

function deleteFeeType(feeType) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le type de frais ${feeType.name} ?`)) {
    financeStore.deleteFeeType(feeType.id)
  }
}

function closeFeeTypeModal() {
  showAddFeeTypeModal.value = false
  showEditFeeTypeModal.value = false
  editingFeeType.value = null
  resetFeeTypeForm()
}

function resetFeeTypeForm() {
  feeTypeForm.value = {
    name: '',
    amount: 0,
    dueDate: ''
  }
}

async function saveFeeType() {
  savingFeeType.value = true
  
  try {
    if (editingFeeType.value) {
      financeStore.updateFeeType(editingFeeType.value.id, { ...feeTypeForm.value })
    } else {
      financeStore.addFeeType({ ...feeTypeForm.value })
    }
    closeFeeTypeModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    savingFeeType.value = false
  }
}

async function recordPayment() {
  recordingPayment.value = true
  
  try {
    financeStore.addPayment({ ...paymentForm.value })
    
    // Reset form
    paymentForm.value = {
      studentId: '',
      feeTypeId: '',
      amount: 0,
      method: 'Espèces'
    }
    
    alert('Paiement enregistré avec succès!')
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error)
    alert('Erreur lors de l\'enregistrement du paiement')
  } finally {
    recordingPayment.value = false
  }
}

function generateReceipt(payment) {
  // This would generate a printable receipt
  alert(`Génération du reçu ${payment.reference} - Non implémenté dans cette démo`)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount).replace('XOF', 'FCFA')
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