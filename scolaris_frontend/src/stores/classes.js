import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStudentsStore } from './students'

export const useClassesStore = defineStore('classes', () => {
  const classes = ref([
    { id: 1, name: '6ème A', level: '6ème', section: 'A', capacity: 30 },
    { id: 2, name: '5ème B', level: '5ème', section: 'B', capacity: 35 },
    { id: 3, name: '4ème A', level: '4ème', section: 'A', capacity: 32 },
    { id: 4, name: '3ème C', level: '3ème', section: 'C', capacity: 28 }
  ])

  const nextId = ref(5)

  const classesWithStats = computed(() => {
    const studentsStore = useStudentsStore()
    return classes.value.map(classe => ({
      ...classe,
      studentCount: studentsStore.students.filter(s => s.classId === classe.id).length
    }))
  })

  function addClass(classData) {
    const newClass = {
      id: nextId.value++,
      ...classData
    }
    classes.value.push(newClass)
    return newClass
  }

  function updateClass(id, classData) {
    const index = classes.value.findIndex(c => c.id === id)
    if (index !== -1) {
      classes.value[index] = { ...classes.value[index], ...classData }
      return classes.value[index]
    }
    return null
  }

  function deleteClass(id) {
    const index = classes.value.findIndex(c => c.id === id)
    if (index !== -1) {
      classes.value.splice(index, 1)
      return true
    }
    return false
  }

  function getClassById(id) {
    return classes.value.find(c => c.id === id)
  }

  return {
    classes,
    classesWithStats,
    addClass,
    updateClass,
    deleteClass,
    getClassById
  }
})