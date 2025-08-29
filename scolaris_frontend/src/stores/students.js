/**
 * STORE DE GESTION DES ÉLÈVES (STUDENTS STORE)
 * 
 * Gère toutes les données et opérations liées aux élèves :
 * - Informations personnelles des élèves
 * - Statut d'inscription et documents
 * - Historique des paiements
 * - Opérations CRUD (Create, Read, Update, Delete)
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from "axios";

export const useStudentsStore = defineStore('students', () => {
  const students = ref([])

  // Charger tous les élèves depuis le backend
  async function fetchStudents(niveau = null) {
    try {
      const url = niveau ? `/api/students?niveau=${niveau}` : '/api/students'
      const res = await axios.get(`http://localhost:3000${url}`)
      students.value = res.data
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  // Ajouter un élève
  async function addStudent(studentData) {
    const res = await axios.post('http://localhost:3000/api/students', studentData)
    students.value.push(res.data)
    return res.data
  }

  // Mettre à jour un élève
  async function updateStudent(id, studentData) {
    const res = await axios.put(`http://localhost:3000/api/students/${id}`, studentData)
    const idx = students.value.findIndex(s => s.id === id)
    if (idx !== -1) students.value[idx] = res.data
    return res.data
  }

  // Supprimer un élève
  async function deleteStudent(id) {
    await axios.delete(`http://localhost:3000/api/students/${id}`)
    students.value = students.value.filter(s => s.id !== id)
  }

  // Récupérer un élève par ID
  function getStudentById(id) {
    return students.value.find(s => s.id === id)
  }

  // Élèves par classe
  const studentsByClass = computed(() => {
    return students.value.reduce((acc, student) => {
      if (!acc[student.classId]) acc[student.classId] = []
      acc[student.classId].push(student)
      return acc
    }, {})
  })

  // Élèves d'une classe
  function getStudentsByClass(classId) {
    return students.value.filter(s => s.classId === classId)
  }

  // Élèves par niveau
  const studentsByNiveau = computed(() => {
    return {
      Primaire: students.value.filter(s => s.Classe?.niveau === 'Primaire'),
      Secondaire: students.value.filter(s => s.Classe?.niveau === 'Secondaire')
    }
  })

  // Charger les élèves au démarrage
  fetchStudents()

  return {
    students,
    studentsByClass,
    studentsByNiveau,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    getStudentsByClass
  }
})