import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useSubjectsStore = defineStore('subjects', () => {
  const subjects = ref([])

  async function fetchSubjects() {
    const res = await axios.get('http://localhost:3000/api/subjects')
    subjects.value = res.data
  }

  async function addSubject(subjectData) {
    const res = await axios.post('http://localhost:3000/api/subjects', subjectData)
    subjects.value.push(res.data)
    return res.data
  }

  async function updateSubject(id, subjectData) {
    const res = await axios.put(`http://localhost:3000/api/subjects/${id}`, subjectData)
    const idx = subjects.value.findIndex(s => s.id === id)
    if (idx !== -1) subjects.value[idx] = res.data
    return res.data
  }

  async function deleteSubject(id) {
    await axios.delete(`http://localhost:3000/api/subjects/${id}`)
    subjects.value = subjects.value.filter(s => s.id !== id)
  }

  function getSubjectById(id) {
    return subjects.value.find(s => s.id === id)
  }

  fetchSubjects()

  return {
    subjects,
    fetchSubjects,
    addSubject,
    updateSubject,
    deleteSubject,
    getSubjectById
  }
})