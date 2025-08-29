import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useStudentsStore } from './students'

export const useClassesStore = defineStore('classes', () => {
  const classes = ref([])

  const classesWithStats = computed(() => {
    const studentsStore = useStudentsStore()
    const counts = new Map()
    studentsStore.students.forEach(student => {
      counts.set(student.classId, (counts.get(student.classId) || 0) + 1)
    })
    return classes.value.map(classe => ({
      ...classe,
      studentCount: counts.get(classe.id) || 0
    }))
  })

  const classesByNiveau = computed(() => {
    return {
      Primaire: classes.value.filter(c => c.niveau === 'Primaire'),
      Secondaire: classes.value.filter(c => c.niveau === 'Secondaire')
    }
  })

  async function fetchClasses(niveau = null) {
    try {
      const url = niveau ? `/api/classes?niveau=${niveau}` : '/api/classes'
      const res = await axios.get(`http://localhost:3000${url}`)
      classes.value = res.data
    } catch (error) {
      console.error('Erreur de connexion au serveur:', error.message)
      if (error.code === 'ERR_NETWORK') {
        alert('Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur le port 3000.')
      }
      throw error
    }
  }

  async function addClass(classData) {
    const res = await axios.post('http://localhost:3000/api/classes', classData)
    classes.value.push(res.data)
    return res.data
  }

  async function updateClass(id, classData) {
    const res = await axios.put(`http://localhost:3000/api/classes/${id}`, classData)
    const idx = classes.value.findIndex(c => c.id === id)
    if (idx !== -1) classes.value[idx] = res.data
    return res.data
  }

  async function deleteClass(id) {
    await axios.delete(`http://localhost:3000/api/classes/${id}`)
    classes.value = classes.value.filter(c => c.id !== id)
  }

  function getClassById(id) {
    return classes.value.find(c => c.id === id)
  }

  fetchClasses()

  return {
    classes,
    classesWithStats,
    classesByNiveau,
    fetchClasses,
    addClass,
    updateClass,
    deleteClass,
    getClassById
  }
})