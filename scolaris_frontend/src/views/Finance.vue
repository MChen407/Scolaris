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
          <BaseTable
            :data="paymentsWithNames"
            :columns="paymentColumns"
            title=""
            :searchable="false"
          >
            <template #cell-amount="{ value }">
              <span class="font-medium text-gray-900">{{ formatCurrency(value) }}</span>
            </template>
            
            <template #cell-date="{ value }">
              {{ formatDate(value) }}
            </template>
            
            <template #cell-status="{ value }">
              <span :class="getStatusClass(value)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ getStatusLabel(value) }}
              </span>
            </template>
            
            <template #row-actions="{ item }">
              <div class="flex gap-2">
                <button @click="viewPayment(item)" class="text-blue-600 hover:text-blue-900" title="Voir">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="editPayment(item)" class="text-yellow-600 hover:text-yellow-900" title="Modifier">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="confirmDelete(item)" class="text-red-600 hover:text-red-900" title="Supprimer">
                  <i class="fas fa-trash"></i>
                </button>
                <button @click="openReceiptConfig(item)" class="text-green-600 hover:text-green-900" title="Générer reçu">
                  <i class="fas fa-file-pdf"></i>
                </button>
              </div>
            </template>
          </BaseTable>
          
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
                  <option value="Jour">Jour</option>
                  <option value="Semaine">Semaine</option>
                  <option value="Mois">Mois</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Montant/heure (CFA)</label>
                <input v-model.number="teacherPayment.rate" type="number" placeholder="Montant" required class="w-full border border-gray-300 rounded-lg px-3 py-2">
              </div>
            </div>
            <div class="mt-4">
              <button @click="processTeacherPayment" :disabled="!canProcessTeacherPayment || processingTeacherPayment" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <i v-if="processingTeacherPayment" class="fas fa-spinner fa-spin mr-2"></i>
                Valider paiement ({{ calculateTeacherTotal }})
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
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ getTeacherName(payment) }}</td>
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
              <div v-if="financeStore.feeTypes.length === 0" class="text-red-500 text-sm mt-1">
                Aucun type de frais disponible
                <button @click="financeStore.fetchFeeTypes()" class="ml-2 text-blue-600 underline">
                  Recharger
                </button>
              </div>
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

        <!-- Payment Details Modal -->
        <BaseModal
          :show="showPaymentModal"
          title="Détails du Paiement"
          :show-footer="false"
          @close="showPaymentModal = false"
        >
          <div v-if="selectedPayment" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div><strong>Référence:</strong> {{ selectedPayment.reference }}</div>
              <div><strong>Date:</strong> {{ formatDate(selectedPayment.date) }}</div>
              <div><strong>Élève:</strong> {{ getStudentName(selectedPayment.studentId) }}</div>
              <div><strong>Type:</strong> {{ getFeeTypeName(selectedPayment.feeTypeId) }}</div>
              <div><strong>Montant:</strong> {{ formatCurrency(selectedPayment.amount) }}</div>
              <div><strong>Mode:</strong> {{ selectedPayment.method }}</div>
              <div><strong>Statut:</strong> 
                <span :class="getStatusClass(selectedPayment.status)" class="px-2 py-1 rounded text-xs">
                  {{ getStatusLabel(selectedPayment.status) }}
                </span>
              </div>
            </div>
            <div class="pt-4 border-t">
              <button @click="openReceiptConfig(selectedPayment)" class="btn-primary">
                <i class="fas fa-file-pdf mr-2"></i>
                Générer Reçu PDF
              </button>
            </div>
          </div>
        </BaseModal>

        <!-- Edit Payment Modal -->
        <BaseModal
          :show="showEditPaymentModal"
          title="Modifier le Paiement"
          @close="showEditPaymentModal = false; editingPayment = null"
          @confirm="savePayment"
          :loading="savingPayment"
        >
          <div class="space-y-4">
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
          </div>
        </BaseModal>

        <!-- Payment History Modal -->
        <BaseModal
          :show="showHistoryModal"
          title="Historique des Paiements"
          :show-footer="false"
          @close="showHistoryModal = false"
          class="max-w-4xl"
        >
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="payment in paymentHistory" :key="payment.id">
                  <td class="px-4 py-2 text-sm">{{ payment.reference }}</td>
                  <td class="px-4 py-2 text-sm">{{ getFeeTypeName(payment.feeTypeId) }}</td>
                  <td class="px-4 py-2 text-sm font-medium">{{ formatCurrency(payment.amount) }}</td>
                  <td class="px-4 py-2 text-sm">{{ formatDate(payment.date) }}</td>
                  <td class="px-4 py-2">
                    <span :class="getStatusClass(payment.status)" class="px-2 py-1 rounded text-xs">
                      {{ getStatusLabel(payment.status) }}
                    </span>
                  </td>
                </tr>
                <tr v-if="paymentHistory.length === 0">
                  <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                    Aucun paiement trouvé pour cet élève
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </BaseModal>

        <!-- Receipt Configuration Modal -->
        <BaseModal
          :show="showReceiptModal"
          title="Configuration du Reçu"
          @close="showReceiptModal = false"
          @confirm="generatePDFReceipt"
        >
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'établissement</label>
              <input v-model="receiptConfig.schoolName" type="text" class="input-field">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input v-model="receiptConfig.address" type="text" class="input-field">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input v-model="receiptConfig.phone" type="text" class="input-field">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Logo</label>
              <input @change="handleReceiptLogoUpload" type="file" accept="image/*" class="input-field">
            </div>
          </div>
        </BaseModal>

        <!-- Student Selection Modal -->
        <BaseModal
          :show="showStudentSelectModal"
          title="Sélectionner un élève"
          @close="showStudentSelectModal = false"
          @confirm="loadStudentHistory"
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
              <select v-model="selectedStudentForHistory" required class="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">Sélectionner un élève</option>
                <option v-for="student in filteredStudents" :key="student.id" :value="student.id">
                  {{ student.firstName }} {{ student.lastName }}
                </option>
              </select>
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
          title="Chargement des finances" 
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
import BaseModal from '@/components/common/BaseModal.vue'
import AlertModal from '@/components/common/AlertModal.vue'
import BaseTable from '@/components/common/BaseTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useAlert } from '@/composables/useAlert'
import { useFinanceStore } from '@/stores/finance'
import { useStudentsStore } from '@/stores/students'
import { useAuthStore } from '@/stores/auth'
import { useTeachersStore } from '@/stores/teachers'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
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
const pageLoading = ref(true)

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
  period: 'jour',
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

const paymentColumns = [
  { key: 'reference', label: 'Référence' },
  { key: 'studentName', label: 'Élève' },
  { key: 'feeTypeName', label: 'Type' },
  { key: 'amount', label: 'Montant' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Statut' }
]

const paymentsWithNames = computed(() => {
  return financeStore.payments
    .filter(payment => {
      if (filters.value.studentId && payment.studentId !== parseInt(filters.value.studentId)) return false
      if (filters.value.status && payment.status !== filters.value.status) return false
      return true
    })
    .map(payment => ({
      ...payment,
      studentName: getStudentName(payment.studentId),
      feeTypeName: getFeeTypeName(payment.feeTypeId)
    }))
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
  const total = teacherPayment.value.hours * teacherPayment.value.rate
  return formatCurrency(total)
})

onMounted(async () => {
  try {
    await authStore.initAuth()
    await financeStore.fetchPayments()
    await financeStore.fetchFeeTypes()
    await teachersStore.fetchTeachers()
    await studentsStore.fetchStudents()
    teacherPayments.value = await financeStore.fetchTeacherPayments()
    loadSchoolConfig()
  } finally {
    setTimeout(() => {
      pageLoading.value = false
    }, 1200)
  }
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

function getTeacherName(payment) {
  if (payment.Teacher) {
    return `${payment.Teacher.firstName} ${payment.Teacher.lastName}`
  }
  if (payment.teacherName) {
    return payment.teacherName
  }
  const teacher = teachersStore.getTeacherById(payment.teacherId)
  return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Enseignant inconnu'
}

const showPaymentModal = ref(false)
const showEditPaymentModal = ref(false)
const showHistoryModal = ref(false)
const selectedPayment = ref(null)
const paymentHistory = ref([])
const editingPayment = ref(null)

async function viewPayment(payment) {
  try {
    selectedPayment.value = await financeStore.getPaymentById(payment.id)
    showPaymentModal.value = true
  } catch (error) {
    alert('Erreur lors du chargement du paiement')
  }
}

function editPayment(payment) {
  editingPayment.value = payment
  paymentForm.value = {
    studentId: payment.studentId,
    feeTypeId: payment.feeTypeId,
    amount: payment.amount,
    method: payment.method,
    status: payment.status
  }
  showEditPaymentModal.value = true
}

const { showAlert, alertConfig, showSuccess, showError, showConfirm, closeAlert, confirmAlert } = useAlert()

function confirmDelete(payment) {
  showConfirm(
    'Supprimer le paiement',
    `Êtes-vous sûr de vouloir supprimer le paiement ${payment.reference} ?`,
    () => deletePayment(payment)
  )
}

async function deletePayment(payment) {
  try {
    await financeStore.deletePayment(payment.id)
    showSuccess('Succès', 'Paiement supprimé avec succès')
  } catch (error) {
    showError('Erreur', 'Erreur lors de la suppression')
  }
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

const showStudentSelectModal = ref(false)
const selectedStudentForHistory = ref('')

function viewPaymentHistory() {
  showStudentSelectModal.value = true
}

async function loadStudentHistory() {
  if (!selectedStudentForHistory.value) {
    showError('Erreur', 'Veuillez sélectionner un élève')
    return
  }
  
  try {
    paymentHistory.value = await financeStore.getPaymentHistory(selectedStudentForHistory.value)
    showStudentSelectModal.value = false
    showHistoryModal.value = true
  } catch (error) {
    showError('Erreur', 'Erreur lors du chargement de l\'historique')
  }
}

async function processTeacherPayment() {
  if (!canProcessTeacherPayment.value) {
    showError('Erreur', 'Veuillez remplir tous les champs')
    return
  }
  
  processingTeacherPayment.value = true
  try {
    const totalAmount = teacherPayment.value.hours * teacherPayment.value.rate
    const teacher = teachersStore.getTeacherById(parseInt(teacherPayment.value.teacherId))
    
    if (!teacher) {
      showError('Erreur', 'Enseignant non trouvé')
      return
    }
    
    // Enregistrement en base de données
    const newPayment = await financeStore.addTeacherPayment({

      teacherId: teacherPayment.value.teacherId,
 
      hours: teacherPayment.value.hours,
      rate: teacherPayment.value.rate,
   
      period: teacherPayment.value.period
     
    })
    console.log(newPayment)
    
    // Recharger la liste
    teacherPayments.value = await financeStore.fetchTeacherPayments()
    
    showSuccess('Succès', `Paiement de ${formatCurrency(totalAmount)} validé pour ${teacher.firstName} ${teacher.lastName}`)
    
    // Reset form
    teacherPayment.value = {
      teacherId: '',
      hours: 0,
      period: 'jour',
      rate: 0
    }
  } catch (error) {
    console.error('Erreur lors du paiement enseignant:', error)
    showError('Erreur', 'Erreur lors du traitement du paiement')
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
  // Validation
  if (!paymentForm.value.studentId || !paymentForm.value.feeTypeId || !paymentForm.value.amount) {
    showError('Erreur', 'Veuillez remplir tous les champs obligatoires')
    return
  }
  
  savingPayment.value = true
  try {
    if (editingPayment.value) {
      await financeStore.updatePayment(editingPayment.value.id, { ...paymentForm.value })
      showEditPaymentModal.value = false
      editingPayment.value = null
      showSuccess('Succès', 'Paiement modifié avec succès!')
    } else {
      await financeStore.addPayment({ ...paymentForm.value })
      closePaymentModal()
      showSuccess('Succès', 'Paiement enregistré avec succès!')
    }
  } catch (error) {
    console.error('Erreur:', error)
    showError('Erreur', error.response?.data?.error || 'Erreur lors de l\'enregistrement du paiement')
  } finally {
    savingPayment.value = false
  }
}

const showReceiptModal = ref(false)
const receiptPayment = ref(null)
const receiptConfig = ref({
  schoolName: '',
  address: '',
  phone: '',
  logoUrl: ''
})

// Charger la configuration de l'établissement connecté
function loadSchoolConfig() {
  const schoolId = localStorage.getItem('current_school_id')
  if (schoolId) {
    const saved = localStorage.getItem(`schoolConfig_${schoolId}`)
    if (saved) {
      const config = JSON.parse(saved)
      receiptConfig.value = {
        schoolName: config.name || '',
        address: config.address || '',
        phone: config.phone || '',
        logoUrl: config.logo || ''
      }
    }
  }
}

function openReceiptConfig(payment) {
  receiptPayment.value = payment
  loadSchoolConfig() // Charger automatiquement la config
  showReceiptModal.value = true
}

function handleReceiptLogoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      receiptConfig.value.logoUrl = e.target.result
    }
    reader.readAsDataURL(file)
  }
}


async function generatePDFReceipt() {
  try {
    if (!receiptPayment.value) {
      showError('Erreur', 'Aucun paiement sélectionné')
      return
    }

    console.log("Données du paiement:", receiptPayment.value)
    console.log("Type de frais ID:", receiptPayment.value.feeTypeId)
    console.log("Types de frais disponibles:", financeStore.feeTypes)

    const doc = new jsPDF()
    const PRIMARY_COLOR = '#2c3e50'
    const TEXT_COLOR = '#34495e'
    const PAGE_MARGIN = 15
    const LOGO_HEIGHT = 25
    const LIGHT_GRAY = '#ecf0f1'

    // En-tête
    if (receiptConfig.value.logoUrl) {
      doc.addImage(receiptConfig.value.logoUrl, 'PNG', PAGE_MARGIN, PAGE_MARGIN, 0, LOGO_HEIGHT)
    }
    doc.setTextColor(TEXT_COLOR)
    doc.setFontSize(9)
    doc.text((receiptConfig.value.schoolName || 'Nom Établissement').toUpperCase(), PAGE_MARGIN, PAGE_MARGIN + LOGO_HEIGHT + 8)
    doc.text(receiptConfig.value.address || 'Adresse', PAGE_MARGIN, PAGE_MARGIN + LOGO_HEIGHT + 13)
    doc.text('Tél: ' + (receiptConfig.value.phone || 'N/A'), PAGE_MARGIN, PAGE_MARGIN + LOGO_HEIGHT + 18)
    
    doc.setTextColor(PRIMARY_COLOR)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(26)
    doc.text('REÇU', 210 - PAGE_MARGIN, PAGE_MARGIN + 15, { align: 'right' })
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text('N°: ' + (receiptPayment.value.reference || 'N/A'), 210 - PAGE_MARGIN, PAGE_MARGIN + 22, { align: 'right' })
    doc.text('Date: ' + formatDate(receiptPayment.value.date || new Date()), 210 - PAGE_MARGIN, PAGE_MARGIN + 29, { align: 'right' })
    
    doc.setDrawColor(LIGHT_GRAY)
    doc.line(PAGE_MARGIN, PAGE_MARGIN + LOGO_HEIGHT + 30, 210 - PAGE_MARGIN, PAGE_MARGIN + LOGO_HEIGHT + 30)

    let yPosition = PAGE_MARGIN + LOGO_HEIGHT + 45
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Reçu de :', PAGE_MARGIN, yPosition)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text('Élève : ' + getStudentName(receiptPayment.value.studentId), PAGE_MARGIN, yPosition + 7)

    // Récupération sécurisée des données
    const feeTypeName = getFeeTypeName(receiptPayment.value.feeTypeId) || 'Type non défini'
    const paymentMethod = receiptPayment.value.method || 'Non spécifié'
    const paymentAmount = new Intl.NumberFormat('fr-FR').format(receiptPayment.value.amount || 0) + ' FCFA'

    console.log("Données formatées:", { feeTypeName, paymentMethod, paymentAmount })

    const receiptDetails = [
      ['Type de frais', feeTypeName],
      ['Mode de paiement', paymentMethod],
      ['Montant Payé', paymentAmount]
    ]
    
    autoTable(doc, {
      startY: yPosition + 20,
      head: [['Détails du Paiement', '']],
      body: receiptDetails,
      theme: 'grid',
      headStyles: { 
        fillColor: PRIMARY_COLOR, 
        textColor: '#ffffff', 
        fontStyle: 'bold' 
      },
      styles: { 
        font: 'helvetica', 
        fontSize: 11, 
        cellPadding: 4,
        textColor: TEXT_COLOR
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { halign: 'left', cellWidth: 'auto' }
      },
      didDrawPage: (data) => {
        yPosition = data.cursor.y
      }
    })

    // Statut et pied de page
    yPosition += 15
    const status = receiptPayment.value.status === 'completed'
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(status ? '#27ae60' : '#e67e22')
    doc.text(`STATUT : ${status ? 'PAYÉ ✅' : 'EN ATTENTE'}`, 210 - PAGE_MARGIN, yPosition, { align: 'right' })

    const pageHeight = doc.internal.pageSize.getHeight()
    doc.setDrawColor(LIGHT_GRAY)
    doc.line(PAGE_MARGIN, pageHeight - 35, 210 - PAGE_MARGIN, pageHeight - 35)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(TEXT_COLOR)
    doc.text('Signature et cachet :', PAGE_MARGIN, pageHeight - 28)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor('#888888')
    const footerText = "Merci pour votre confiance.\nCe reçu fait foi de paiement et a été généré automatiquement."
    doc.text(footerText, 105, pageHeight - 15, { align: 'center' })
    
    doc.save('recu_' + (receiptPayment.value.reference || 'test') + '.pdf')
    showReceiptModal.value = false
    showSuccess('Succès', 'Reçu PDF généré avec succès')

  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error)
    showError('Erreur', 'Erreur lors de la génération du PDF')
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