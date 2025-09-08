import {  defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useTeachersStore = defineStore('teachers', () => {
  const teachers = ref([])

  async function fetchTeachers(niveau = null){
    try {
      const url = niveau ? `/api/teachers?niveau=${niveau}` : '/api/teachers'
      const res = await axios.get(`http://localhost:3000${url}`)
      teachers.value = res.data
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  async function addTeacher(teacherData) {
    const res = await axios.post('http://localhost:3000/api/teachers', teacherData)
    teachers.value.push(res.data)
    return res.data
  }

  async function updateTeacher(id, teacherData) {
   const res = await axios.put(`http://localhost:3000/api/teachers/${id}`, teacherData)
   const idx = teachers.value.findIndex(t => t.id === id)
   if(idx !== -1) teachers.value[idx] = res.data
   return res.data
  }

  async function deleteTeacher(id) {
    await axios.delete(`http://localhost:3000/api/teachers/${id}`)
    teachers.value = teachers.value.filter(t => t.id !== id)
  }

  function getTeacherById(id) {
    return teachers.value.find(t => t.id === id)
  }

  const teachersByNiveau = computed(() => {
    return {
      Primaire: teachers.value.filter(t => t.niveau === 'Primaire'),
      Secondaire: teachers.value.filter(t => t.niveau === 'Secondaire')
    }
  })

  return {
    teachers,
    teachersByNiveau,
    addTeacher,
    fetchTeachers,
    updateTeacher,
    deleteTeacher,
    getTeacherById
  }
})