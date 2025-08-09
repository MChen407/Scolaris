import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFinanceStore = defineStore('finance', () => {
  const feeTypes = ref([
    { id: 1, name: 'Inscription', amount: 50000, dueDate: '2023-09-01' },
    { id: 2, name: 'Mensualité', amount: 25000, dueDate: null },
    { id: 3, name: 'Cantine', amount: 15000, dueDate: null }
  ])

  const payments = ref([
    {
      id: 1,
      studentId: 1,
      feeTypeId: 1,
      amount: 50000,
      date: '2023-09-01',
      method: 'Espèces',
      reference: 'REC001',
      status: 'completed'
    },
    {
      id: 2,
      studentId: 1,
      feeTypeId: 2,
      amount: 25000,
      date: '2023-10-01',
      method: 'Chèque',
      reference: 'REC002',
      status: 'completed'
    },
    {
      id: 3,
      studentId: 2,
      feeTypeId: 1,
      amount: 50000,
      date: '2023-09-01',
      method: 'Virement',
      reference: 'REC003',
      status: 'completed'
    }
  ])

  const nextFeeTypeId = ref(4)
  const nextPaymentId = ref(4)

  const totalRevenue = computed(() => {
    return payments.value
      .filter(p => p.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0)
  })

  const paymentsByStudent = computed(() => {
    return payments.value.reduce((acc, payment) => {
      if (!acc[payment.studentId]) {
        acc[payment.studentId] = []
      }
      acc[payment.studentId].push(payment)
      return acc
    }, {})
  })


   function addFeeType(feeTypeData) {
    const feeType = {
      id: nextFeeTypeId.value++,
      ...feeTypeData
    }
    feeTypes.value.push(feeType)
    return feeType
  }

  function updateFeeType(id, feeTypeData) {
    const index = feeTypes.value.findIndex(f => f.id === id)
    if (index !== -1) {
      feeTypes.value[index] = { ...feeTypes.value[index], ...feeTypeData }
      return feeTypes.value[index]
    }
    return null
  }

  function deleteFeeType(id) {
    const index = feeTypes.value.findIndex(f => f.id === id)
    if (index !== -1) {
      feeTypes.value.splice(index, 1)
      return true
    }
    return false
  }

  function addPayment(paymentData) {
    const payment = {
      id: nextPaymentId.value++,
      date: new Date().toISOString().split('T')[0],
      reference: `REC${String(nextPaymentId.value).padStart(3, '0')}`,
      status: 'completed',
      ...paymentData
    }
    payments.value.push(payment)
    return payment
  }

  function updatePaymentStatus(id, status) {
    const payment = payments.value.find(p => p.id === id)
    if (payment) {
      payment.status = status
      return payment
    }
    return null
  }

  function getPaymentsByStudent(studentId) {
    return payments.value.filter(p => p.studentId === studentId)
  }

  function getUnpaidStudents() {
    return []
  }

  return {
    feeTypes,
    payments,
    totalRevenue,
    paymentsByStudent,
    addFeeType,
    updateFeeType,
    deleteFeeType,
    addPayment,
    updatePaymentStatus,
    getPaymentsByStudent,
    getUnpaidStudents
  }
})