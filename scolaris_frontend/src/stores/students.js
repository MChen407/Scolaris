import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStudentsStore = defineStore('students', () => {
  const students = ref([
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      gender: 'M',
      birthDate: '2008-05-15',
      guardian: 'Marie Dupont',
      phone: '0123456789',
      classId: 1,
      enrollmentDate: '2023-09-01',
      payments: [
        { id: 1, amount: 50000, date: '2023-09-01', type: 'Inscription' },
        { id: 2, amount: 25000, date: '2023-10-01', type: 'Mensualité' }
      ]
    },
    {
      id: 2,
      firstName: 'Sophie',
      lastName: 'Martin',
      gender: 'F',
      birthDate: '2008-03-22',
      guardian: 'Pierre Martin',
      phone: '0123456790',
      classId: 1,
      enrollmentDate: '2023-09-01',
      payments: [
        { id: 3, amount: 50000, date: '2023-09-01', type: 'Inscription' }
      ]
    },
    {
      id: 3,
      firstName: 'Ahmed',
      lastName: 'Benali',
      gender: 'M',
      birthDate: '2007-11-08',
      guardian: 'Fatima Benali',
      phone: '0123456791',
      classId: 2,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 4,
      firstName: 'Yasmine',
      lastName: 'El Idrissi',
      gender: 'F',
      birthDate: '2009-02-17',
      guardian: 'Samir El Idrissi',
      phone: '0123456792',
      classId: 2,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 5,
      firstName: 'Omar',
      lastName: 'Kabbaj',
      gender: 'M',
      birthDate: '2008-07-23',
      guardian: 'Nadia Kabbaj',
      phone: '0123456793',
      classId: 1,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 6,
      firstName: 'Sara',
      lastName: 'Bouhadi',
      gender: 'F',
      birthDate: '2007-12-30',
      guardian: 'Ali Bouhadi',
      phone: '0123456794',
      classId: 3,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 7,
      firstName: 'Rachid',
      lastName: 'El Fassi',
      gender: 'M',
      birthDate: '2008-10-11',
      guardian: 'Latifa El Fassi',
      phone: '0123456795',
      classId: 2,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 8,
      firstName: 'Imane',
      lastName: 'Zerhouni',
      gender: 'F',
      birthDate: '2009-04-05',
      guardian: 'Mohamed Zerhouni',
      phone: '0123456796',
      classId: 3,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 9,
      firstName: 'Walid',
      lastName: 'Alaoui',
      gender: 'M',
      birthDate: '2008-01-19',
      guardian: 'Salma Alaoui',
      phone: '0123456797',
      classId: 1,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 10,
      firstName: 'Nour',
      lastName: 'Berrada',
      gender: 'F',
      birthDate: '2007-09-14',
      guardian: 'Karim Berrada',
      phone: '0123456798',
      classId: 2,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 11,
      firstName: 'Hicham',
      lastName: 'Mouline',
      gender: 'M',
      birthDate: '2009-06-21',
      guardian: 'Amina Mouline',
      phone: '0123456799',
      classId: 3,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 12,
      firstName: 'Lina',
      lastName: 'Tahiri',
      gender: 'F',
      birthDate: '2008-08-29',
      guardian: 'Omar Tahiri',
      phone: '0123456700',
      classId: 1,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 13,
      firstName: 'Samir',
      lastName: 'Ghazali',
      gender: 'M',
      birthDate: '2007-10-10',
      guardian: 'Rachida Ghazali',
      phone: '0123456701',
      classId: 2,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 14,
      firstName: 'Aya',
      lastName: 'El Mansouri',
      gender: 'F',
      birthDate: '2009-03-03',
      guardian: 'Youssef El Mansouri',
      phone: '0123456702',
      classId: 3,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 15,
      firstName: 'Aya',
      lastName: 'El Mansouri',
      gender: 'F',
      birthDate: '2009-03-03',
      guardian: 'Youssef El Mansouri',
      phone: '0123456702',
      classId: 3,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 16,
      firstName: 'Aya',
      lastName: 'El Mansouri',
      gender: 'F',
      birthDate: '2009-03-03',
      guardian: 'Youssef El Mansouri',
      phone: '0123456702',
      classId: 4,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 17,
      firstName: 'Aya',
      lastName: 'El Mansouri',
      gender: 'F',
      birthDate: '2009-03-03',
      guardian: 'Youssef El Mansouri',
      phone: '0123456702',
      classId: 3,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 18,
      firstName: 'Aya',
      lastName: 'El Mansouri',
      gender: 'F',
      birthDate: '2009-03-03',
      guardian: 'Youssef El Mansouri',
      phone: '0123456702',
      classId: 4,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 19,
      firstName: 'Aya',
      lastName: 'El Mansouri',
      gender: 'F',
      birthDate: '2009-03-03',
      guardian: 'Youssef El Mansouri',
      phone: '0123456702',
      classId: 3,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 20,
      firstName: 'Aya',
      lastName: 'El Mansouri',
      gender: 'F',
      birthDate: '2009-03-03',
      guardian: 'Youssef El Mansouri',
      phone: '0123456702',
      classId: 4,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 21,
      firstName: 'Aya',
      lastName: 'El Mansouri',
      gender: 'F',
      birthDate: '2009-03-03',
      guardian: 'Youssef El Mansouri',
      phone: '0123456702',
      classId: 3,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 22,
      firstName: 'Aya',
      lastName: 'El Mansouri',
      gender: 'F',
      birthDate: '2009-03-03',
      guardian: 'Youssef El Mansouri',
      phone: '0123456702',
      classId: 3,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 23,
      firstName: 'Aya',
      lastName: 'El Mansouri',
      gender: 'F',
      birthDate: '2009-03-03',
      guardian: 'Youssef El Mansouri',
      phone: '0123456702',
      classId: 4,
      enrollmentDate: '2023-09-01',
      payments: []
    },
    {
      id: 24,
      firstName: 'Aya',
      lastName: 'El Mansouri',
      gender: 'F',
      birthDate: '2009-03-03',
      guardian: 'Youssef El Mansouri',
      phone: '0123456702',
      classId: 3,
      enrollmentDate: '2023-09-01',
      payments: []
    }
  ])
  
  const nextId = ref(4)

  const studentsByClass = computed(() => {
    return students.value.reduce((acc, student) => {
      if (!acc[student.classId]) {
        acc[student.classId] = []
      }
      acc[student.classId].push(student)
      return acc
    }, {})
  })

  function addStudent(studentData) {
    const student = {
      id: nextId.value++,
      ...studentData,
      enrollmentDate: new Date().toISOString().split('T')[0],
      payments: []
    }
    students.value.push(student)
    return student
  }

  function updateStudent(id, studentData) {
    const index = students.value.findIndex(s => s.id === id)
    if (index !== -1) {
      students.value[index] = { ...students.value[index], ...studentData }
      return students.value[index]
    }
    return null
  }

  function deleteStudent(id) {
    const index = students.value.findIndex(s => s.id === id)
    if (index !== -1) {
      students.value.splice(index, 1)
      return true
    }
    return false
  }

  function getStudentById(id) {
    return students.value.find(s => s.id === id)
  }

  function getStudentsByClass(classId) {
    return students.value.filter(s => s.classId === classId)
  }

  return {
    students,
    studentsByClass,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    getStudentsByClass
  }
})