import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTeachersStore = defineStore('teachers', () => {
  const teachers = ref([
    {
      id: 1,
      firstName: 'Marie',
      lastName: 'Dubois',
      email: 'marie.dubois@school.com',
      phone: '0123456789',
      subjects: [1, 2], // Mathématiques, Français
      classes: [1, 2],
      hireDate: '2020-09-01'
    },
    {
      id: 2,
      firstName: 'Paul',
      lastName: 'Lemaire',
      email: 'paul.lemaire@school.com',
      phone: '0123456790',
      subjects: [3, 4], // Histoire, Géographie
      classes: [2, 3],
      hireDate: '2019-09-01'
    },
        {
      id: 3,
      firstName: 'Sophie',
      lastName: 'Martin',
      email: 'sophie.martin@school.com',
      phone: '0123456791',
      subjects: [2, 5], // Français, Sciences
      classes: [1, 3],
      hireDate: '2021-09-01'
    },
    {
      id: 4,
      firstName: 'Karim',
      lastName: 'El Amrani',
      email: 'karim.elamrani@school.com',
      phone: '0123456792',
      subjects: [1, 6], // Mathématiques, Anglais
      classes: [2],
      hireDate: '2018-09-01'
    },
    {
      id: 5,
      firstName: 'Nadia',
      lastName: 'Bennani',
      email: 'nadia.bennani@school.com',
      phone: '0123456793',
      subjects: [4, 5], // Géographie, Sciences
      classes: [1, 2, 3],
      hireDate: '2022-09-01'
    },
    {
      id: 6,
      firstName: 'Youssef',
      lastName: 'Ait Taleb',
      email: 'youssef.aittaleb@school.com',
      phone: '0123456794',
      subjects: [1, 3], // Mathématiques, Histoire
      classes: [3],
      hireDate: '2020-01-15'
    },
    {
      id: 7,
      firstName: 'Leila',
      lastName: 'Rahmouni',
      email: 'leila.rahmouni@school.com',
      phone: '0123456795',
      subjects: [2, 6], // Français, Anglais
      classes: [1, 2],
      hireDate: '2017-09-01'
    }
  ])

  const nextId = ref(3)

  function addTeacher(teacherData) {
    const teacher = {
      id: nextId.value++,
      ...teacherData,
      hireDate: new Date().toISOString().split('T')[0]
    }
    teachers.value.push(teacher)
    return teacher
  }

  function updateTeacher(id, teacherData) {
    const index = teachers.value.findIndex(t => t.id === id)
    if (index !== -1) {
      teachers.value[index] = { ...teachers.value[index], ...teacherData }
      return teachers.value[index]
    }
    return null
  }

  function deleteTeacher(id) {
    const index = teachers.value.findIndex(t => t.id === id)
    if (index !== -1) {
      teachers.value.splice(index, 1)
      return true
    }
    return false
  }

  function getTeacherById(id) {
    return teachers.value.find(t => t.id === id)
  }

  return {
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherById
  }
})