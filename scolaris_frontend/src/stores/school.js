import { defineStore } from 'pinia'
import { ref } from 'vue'
import { schoolAPI } from '@/services/api'

export const useSchoolStore = defineStore('school', () => {
  const schoolInfo = ref({
    id: null,
    name: '',
    address: '',
    phone: '',
    email: '',
    logo: null,
    createdAt: null,
    updatedAt: null
  })

  const loading = ref(false)

  // Récupérer les informations de l'établissement
  async function fetchSchoolInfo() {
    loading.value = true
    const schoolId = localStorage.getItem('current_school_id')
    
    if (!schoolId) {
      loading.value = false
      return
    }

    try {
      const response = await schoolAPI.getInfo(schoolId)
      if (response.success && response.school) {
        schoolInfo.value = response.school
      } else {
        // Fallback vers localStorage avec clé spécifique à l'établissement
        const saved = localStorage.getItem(`schoolConfig_${schoolId}`)
        if (saved) {
          const config = JSON.parse(saved)
          schoolInfo.value = {
            id: schoolId,
            name: config.name || '',
            address: config.address || '',
            phone: config.phone || '',
            email: config.email || '',
            logo: config.logo || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        } else {
          // Données par défaut selon l'établissement
          schoolInfo.value = getDefaultSchoolData(schoolId)
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des infos école:', error)
      // Fallback vers localStorage ou données par défaut
      const saved = localStorage.getItem(`schoolConfig_${schoolId}`)
      if (saved) {
        const config = JSON.parse(saved)
        schoolInfo.value = {
          id: schoolId,
          name: config.name || '',
          address: config.address || '',
          phone: config.phone || '',
          email: config.email || '',
          logo: config.logo || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      } else {
        schoolInfo.value = getDefaultSchoolData(schoolId)
      }
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour les informations de l'établissement
  async function updateSchoolInfo(data) {
    loading.value = true
    const schoolId = localStorage.getItem('current_school_id')
    
    if (!schoolId) {
      loading.value = false
      return false
    }

    try {
      const response = await schoolAPI.updateInfo(schoolId, data)
      if (response.success && response.school) {
        schoolInfo.value = response.school
      } else {
        // Fallback vers localStorage avec clé spécifique
        schoolInfo.value = {
          ...schoolInfo.value,
          ...data,
          updatedAt: new Date().toISOString()
        }
        localStorage.setItem(`schoolConfig_${schoolId}`, JSON.stringify(schoolInfo.value))
      }
      
      return true
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      schoolInfo.value = {
        ...schoolInfo.value,
        ...data,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(`schoolConfig_${schoolId}`, JSON.stringify(schoolInfo.value))
      return true
    } finally {
      loading.value = false
    }
  }

  // Créer les informations de l'établissement (première configuration)
  async function createSchoolInfo(data) {
    loading.value = true
    const schoolId = localStorage.getItem('current_school_id')
    
    if (!schoolId) {
      loading.value = false
      return false
    }

    try {
      const response = await schoolAPI.createInfo(schoolId, data)
      if (response.success && response.school) {
        schoolInfo.value = response.school
      } else {
        // Fallback vers localStorage avec clé spécifique
        schoolInfo.value = {
          id: schoolId,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        localStorage.setItem(`schoolConfig_${schoolId}`, JSON.stringify(schoolInfo.value))
      }
      
      return true
    } catch (error) {
      console.error('Erreur lors de la création:', error)
      schoolInfo.value = {
        id: schoolId,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(`schoolConfig_${schoolId}`, JSON.stringify(schoolInfo.value))
      return true
    } finally {
      loading.value = false
    }
  }

  // Vérifier si l'établissement est configuré
  function isConfigured() {
    return schoolInfo.value.name && schoolInfo.value.address && schoolInfo.value.phone
  }

  // Données par défaut selon l'établissement
  function getDefaultSchoolData(schoolId) {
    const defaults = {
      'school_1': {
        id: schoolId,
        name: 'Lycée Jean Dupont',
        address: '123 Avenue de la République, Abidjan, Côte d\'Ivoire',
        phone: '+225 01 02 03 04 05',
        email: 'contact@lycee-dupont.edu',
        logo: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      'school_2': {
        id: schoolId,
        name: 'Collège Moderne d\'Abidjan',
        address: '456 Boulevard Lagunaire, Cocody, Abidjan',
        phone: '+225 05 06 07 08 09',
        email: 'direction@college-abidjan.edu',
        logo: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
    return defaults[schoolId] || {
      id: schoolId,
      name: '',
      address: '',
      phone: '',
      email: '',
      logo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  return {
    schoolInfo,
    loading,
    fetchSchoolInfo,
    updateSchoolInfo,
    createSchoolInfo,
    isConfigured
  }
})