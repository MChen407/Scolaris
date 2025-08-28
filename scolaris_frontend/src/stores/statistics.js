import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useStatisticsStore = defineStore('statistics', () => {
  const generalStats = ref({})
  const financialStats = ref({})
  const loading = ref(false)
  const studentsByClass = ref([])
  const averagesBySubject = ref([])
  const classPerformance = ref([])
  const top3StudentsByClass = ref([])

  async function fetchGeneralStats() {
    loading.value = true
    try {
      const response = await axios.get('http://localhost:3000/api/statistics/general')
      generalStats.value = response.data
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchFinancialStats(period = 'month') {
    loading.value = true
    try {
      const response = await axios.get(`http://localhost:3000/api/statistics/financial?period=${period}`)
      financialStats.value = response.data
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchStudentsByClass() {
    const res = await axios.get('http://localhost:3000/api/statistics/students-by-class')
    studentsByClass.value = res.data
  }

  async function fetchAveragesBySubject() {
    const res = await axios.get('http://localhost:3000/api/statistics/averages-by-subject')
    averagesBySubject.value = res.data
  }

  async function fetchClassPerformance() {
    const res = await axios.get('http://localhost:3000/api/statistics/class-performance')
    classPerformance.value = res.data
  }

  async function fetchTop3StudentsByClass() {
    const res = await axios.get('http://localhost:3000/api/statistics/top3-by-class')
    top3StudentsByClass.value = res.data
  }

  async function fetchAllStats() {
    await Promise.all([
      fetchGeneralStats(),
      fetchStudentsByClass(),
      fetchAveragesBySubject(),
      fetchClassPerformance(),
      fetchTop3StudentsByClass()
    ])
  }

  return {
    generalStats,
    financialStats,
    loading,
    fetchFinancialStats,
    studentsByClass,
    averagesBySubject,
    classPerformance,
    top3StudentsByClass,
    fetchGeneralStats,
    fetchStudentsByClass,
    fetchAveragesBySubject,
    fetchClassPerformance,
    fetchTop3StudentsByClass,
    fetchAllStats
  }
})