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

  async function fetchClasses() {
    const res = await axios.get('http://localhost:3000/api/classes')
    classes.value = res.data
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
    fetchClasses,
    addClass,
    updateClass,
    deleteClass,
    getClassById
  }
})