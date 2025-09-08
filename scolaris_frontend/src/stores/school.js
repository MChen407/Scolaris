import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useSchoolStore = defineStore('school', () => {
  const schoolInfo = ref({
    name: '',
    logo: '',
    phone: '',
    address: '',
    email: ''
  })

  const loading = ref(false)

  async function fetchSchoolInfo() {
    loading.value = true
    try {
      const response = await axios.get('http://localhost:3000/api/school')
      schoolInfo.value = response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des infos école:', error)
    } finally {
      loading.value = false
    }
  }

  async function updateSchoolInfo(data) {
    loading.value = true
    try {
      const response = await axios.put('http://localhost:3000/api/school', data)
      schoolInfo.value = response.data
      return true
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    schoolInfo,
    loading,
    fetchSchoolInfo,
    updateSchoolInfo
  }
})