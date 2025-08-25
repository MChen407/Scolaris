import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useGradesStore = defineStore('grades', () => {
  const grades = ref([
        {
      id: 1,
      studentId: 1,
      subjectId: 1,
      classId: 1,
      period: 'Trimestre 1',
      grade: 15.5,
      maxGrade: 20,
      date: '2023-11-15',
      type: 'Devoir'
    },
    {
      id: 2,
      studentId: 1,
      subjectId: 1,
      classId: 1,
      period: 'Trimestre 1',
      grade: 14.0,
      maxGrade: 20,
      date: '2023-11-20',
      type: 'Devoir'
    },
    {
      id: 3,
      studentId: 1,
      subjectId: 1,
      classId: 1,
      period: 'Trimestre 1',
      grade: 12.0,
      maxGrade: 20,
      date: '2023-11-25',
      type: 'Interro'
    },
    {
      id: 4,
      studentId: 1,
      subjectId: 1,
      classId: 1,
      period: 'Trimestre 1',
      grade: 13.0,
      maxGrade: 20,
      date: '2023-12-01',
      type: 'Interro'
    },
    {
      id: 5,
      studentId: 1,
      subjectId: 1,
      classId: 1,
      period: 'Trimestre 1',
      grade: 16.0,
      maxGrade: 20,
      date: '2023-12-10',
      type: 'Interro'
    },
    {
      id: 6,
      studentId: 2,
      subjectId: 1,
      classId: 1,
      period: 'Trimestre 1',
      grade: 18.0,
      maxGrade: 20,
      date: '2023-11-15',
      type: 'Devoir'
    },
    {
      id: 7,
      studentId: 2,
      subjectId: 1,
      classId: 1,
      period: 'Trimestre 1',
      grade: 17.0,
      maxGrade: 20,
      date: '2023-11-20',
      type: 'Devoir'
    },
    {
      id: 8,
      studentId: 2,
      subjectId: 1,
      classId: 1,
      period: 'Trimestre 1',
      grade: 15.0,
      maxGrade: 20,
      date: '2023-11-25',
      type: 'Interro'
    },
    {
      id: 9,
      studentId: 2,
      subjectId: 1,
      classId: 1,
      period: 'Trimestre 1',
      grade: 16.0,
      maxGrade: 20,
      date: '2023-12-01',
      type: 'Interro'
    },
    {
      id: 10,
      studentId: 2,
      subjectId: 1,
      classId: 1,
      period: 'Trimestre 1',
      grade: 14.0,
      maxGrade: 20,
      date: '2023-12-10',
      type: 'Interro'
    }
  ])

  const nextId = ref(4)

const averagesByStudent = computed(() => {
  const result = {}
  grades.value.forEach(grade => {
    const key = `${grade.studentId}-${grade.period}`
    if (!result[key]) {
      result[key] = { subjects: {} }
    }
    if (!result[key].subjects[grade.subjectId]) {
      result[key].subjects[grade.subjectId] = { interros: [], devoirs: [] }
    }
    if (grade.type === 'Interro') {
      result[key].subjects[grade.subjectId].interros.push(grade.grade)
    } else if (grade.type === 'Devoir') {
      result[key].subjects[grade.subjectId].devoirs.push(grade.grade)
    }
  })
    
    Object.keys(result).forEach(key => {
    const subjects = result[key].subjects
    result[key].subjectsAverages = {}
    Object.keys(subjects).forEach(subjectId => {
      // Prendre les 3 premières interros (ou moins si pas assez)
      const interros = subjects[subjectId].interros.slice(0, 3)
      const interroAvg = interros.length
        ? interros.reduce((a, b) => a + b, 0) / interros.length
        : null

      // Prendre les 2 premiers devoirs (ou moins si pas assez)
      const devoirs = subjects[subjectId].devoirs.slice(0, 2)
      // Calcul de la moyenne de la matière : (moyenne interros + devoir1 + devoir2) / 3
      let subjectAvg = null
      if (interroAvg !== null && devoirs.length === 2) {
        subjectAvg = (interroAvg + devoirs[0] + devoirs[1]) / 3
      } else if (interroAvg !== null && devoirs.length === 1) {
        subjectAvg = (interroAvg + devoirs[0]) / 2
      } else if (interroAvg !== null) {
        subjectAvg = interroAvg
      } else if (devoirs.length > 0) {
        subjectAvg = devoirs.reduce((a, b) => a + b, 0) / devoirs.length
      }

      result[key].subjectsAverages[subjectId] = {
        interroAvg,
        subjectAvg
      }
    })
  })

  return result
})

  async function fetchGrades() {
    const res = await axios.get('http://localhost:3000/api/grades')
    grades.value = res.data
  }

  async function addGrade(gradeData) {
    const res = await axios.post('http://localhost:3000/api/grades', gradeData)
    grades.value.push(res.data)
    return res.data
  }

  async function updateGrade(id, gradeData) {
    const res = await axios.put(`http://localhost:3000/api/grades/${id}`, gradeData)
    const index = grades.value.findIndex(g => g.id === id)
    if (index !== -1) grades.value[index] = res.data
    return res.data
  }

  async function deleteGrade(id) {
    await axios.delete(`http://localhost:3000/api/grades/${id}`)
    grades.value = grades.value.filter(g => g.id !== id)
  }

  async function getBulletinData(studentId, period) {
    const res = await axios.get(`http://localhost:3000/api/grades/bulletin/${studentId}/${period}`)
    return res.data
  }

  async function getStudentAverages(studentId) {
    const res = await axios.get(`http://localhost:3000/api/grades/averages/${studentId}`)
    return res.data
  }

  function getGradesByStudent(studentId, period = null) {
    return grades.value.filter(g => 
      g.studentId === studentId && 
      (period ? g.period === period : true)
    )
  }

  function getGradesByClass(classId, subjectId = null, period = null) {
    return grades.value.filter(g => 
      g.classId === classId &&
      (subjectId ? g.subjectId === subjectId : true) &&
      (period ? g.period === period : true)
    )
  }

  return {
    grades,
    averagesByStudent,
    fetchGrades,
    addGrade,
    updateGrade,
    deleteGrade,
    getGradesByStudent,
    getGradesByClass,
    getBulletinData,
    getStudentAverages
  }
})