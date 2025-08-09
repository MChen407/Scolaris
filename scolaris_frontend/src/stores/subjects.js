import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSubjectsStore = defineStore('subjects', () => {
  const subjects = ref([
    { id: 1, name: 'Mathématiques', coefficient: 4, category: 'Sciences', classes: [1, 2, 3, 4] },
    { id: 2, name: 'Français', coefficient: 4, category: 'Lettres', classes: [1, 2, 3, 4] },
    { id: 3, name: 'Histoire', coefficient: 2, category: 'Sciences Humaines', classes: [1, 2, 3, 4] },
    { id: 4, name: 'Géographie', coefficient: 2, category: 'Sciences Humaines', classes: [1, 2, 3, 4] },
    { id: 5, name: 'Anglais', coefficient: 3, category: 'Langues', classes: [1, 2, 3, 4] },
    { id: 6, name: 'SVT', coefficient: 3, category: 'Sciences', classes: [2, 3, 4] },
    { id: 7, name: 'Physique', coefficient: 3, category: 'Sciences', classes: [3, 4] },
    { id: 8, name: 'EPS', coefficient: 1, category: 'Sport', classes: [1, 2, 3, 4] }
  ])

  const nextId = ref(9)

  function addSubject(subjectData) {
    const subject = {
      id: nextId.value++,
      classes: [],
      ...subjectData
    }
    subjects.value.push(subject)
    return subject
  }

  function updateSubject(id, subjectData) {
    const index = subjects.value.findIndex(s => s.id === id)
    if (index !== -1) {
      subjects.value[index] = { ...subjects.value[index], ...subjectData }
      return subjects.value[index]
    }
    return null
  }

  function deleteSubject(id) {
    const index = subjects.value.findIndex(s => s.id === id)
    if (index !== -1) {
      subjects.value.splice(index, 1)
      return true
    }
    return false
  }

  function getSubjectById(id) {
    return subjects.value.find(s => s.id === id)
  }

  return {
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    getSubjectById
  }
})