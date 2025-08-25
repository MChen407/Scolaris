import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useFinanceStore = defineStore('finance', () => {
  const payments = ref([])
  const feeTypes = ref([])
  const stats = ref({})

  async function fetchPayments() {
    const res = await axios.get('http://localhost:3000/api/finance/payments')
    payments.value = res.data
  }

  async function addPayment(paymentData) {
    const res = await axios.post('http://localhost:3000/api/finance/payments', paymentData)
    payments.value.push(res.data)
    return res.data
  }

  async function getPaymentById(id) {
    const res = await axios.get(`http://localhost:3000/api/finance/payments/${id}`)
    return res.data
  }

  async function updatePayment(id, paymentData) {
    const res = await axios.put(`http://localhost:3000/api/finance/payments/${id}`, paymentData)
    const idx = payments.value.findIndex(p => p.id === id)
    if (idx !== -1) payments.value[idx] = res.data
    return res.data
  }

  async function deletePayment(id) {
    await axios.delete(`http://localhost:3000/api/finance/payments/${id}`)
    payments.value = payments.value.filter(p => p.id !== id)
  }

  async function getPaymentHistory(studentId) {
    const res = await axios.get(`http://localhost:3000/api/finance/payments/history/${studentId}`)
    return res.data
  }

  async function fetchFeeTypes() {
    try {
      const res = await axios.get('http://localhost:3000/api/finance/fee-types')
      feeTypes.value = res.data
      console.log('FeeTypes fetched:', res.data)
    } catch (error) {
      console.error('Error fetching fee types:', error)
    }
  }

  async function addFeeType(feeTypeData) {
    const res = await axios.post('http://localhost:3000/api/finance/fee-types', feeTypeData)
    feeTypes.value.push(res.data)
    return res.data
  }

  async function fetchStats() {
    const res = await axios.get('http://localhost:3000/api/finance/stats')
    stats.value = res.data
  }

  async function addTeacherPayment(paymentData) {
    const res = await axios.post('http://localhost:3000/api/finance/teacher-payments', paymentData)
    return res.data
  }

  async function fetchTeacherPayments() {
    const res = await axios.get('http://localhost:3000/api/finance/teacher-payments')
    return res.data
  }

  const totalRevenue = computed(() => {
    return payments.value.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
  })

  // Initialisation différée pour éviter les erreurs au démarrage

  return {
    payments,
    feeTypes,
    stats,
    totalRevenue,
    fetchPayments,
    getPaymentById,
    addPayment,
    updatePayment,
    deletePayment,
    getPaymentHistory,
    fetchFeeTypes,
    addFeeType,
    fetchStats,
    addTeacherPayment,
    fetchTeacherPayments
  }
})