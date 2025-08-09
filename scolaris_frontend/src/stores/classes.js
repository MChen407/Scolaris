import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStudentsStore } from './students'

export const useClassesStore = defineStore('classes', () => {
  const classes = ref([
    { id: 1, name: '6ème A', level: '6ème', section: 'A', capacity: 30, subjects: [1, 2, 3, 4, 5, 8] },
    { id: 2, name: '5ème B', level: '5ème', section: 'B', capacity: 35, subjects: [1, 2, 3, 4, 5, 6, 8] },
    { id: 3, name: '4ème A', level: '4ème', section: 'A', capacity: 32, subjects: [1, 2, 3, 4, 5, 6, 7, 8] },
    { id: 4, name: '3ème C', level: '3ème', section: 'C', capacity: 28, subjects: [1, 2, 3, 4, 5, 6, 7, 8] }
  ])

  const nextId = ref(5)

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

 // Helper function pour éviter la duplication de code
 function findClassIndex(id) {
    return classes.value.findIndex(c => c.id === id)
  }


 function addClass(classData) {
    if (!classData?.name || !classData?.level) {
      throw new Error('Nom et niveau de classe requis')
    }

    const newClass = {
      id: nextId.value++,
      capacity: 30,
      subjects: [],
      ...classData
    }
    classes.value.push(newClass)
    return newClass
  }

  function updateClass(id, classData) {
    const index = findClassIndex(id)
    if (index !== -1) {
      classes.value[index] = { ...classes.value[index], ...classData }
      return classes.value[index]
    }
    return null
  }

 function updateClass(id, classData) {
    const index = findClassIndex(id)
    if (index !== -1) {
      classes.value[index] = { ...classes.value[index], ...classData }
      return classes.value[index]
    }
    return null
  }



  function deleteClass(id) {
    const index = findClassIndex(id)
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