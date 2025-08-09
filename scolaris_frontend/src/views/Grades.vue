<template>
  <div class="layout-container">
    <Sidebar :collapsed="sidebarCollapsed" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    
    <div class="main-content scrollable-content">
      <Header />
      
      <main class="p-6 space-y-6">
        <!-- Filters -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Saisie des Notes</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Classe</label>
              <select v-model="selectedClassId" @change="loadStudents" class="input-field">
                <option value="">Sélectionner une classe</option>
                <option
                  v-for="classe in classesStore.classes"
                  :key="classe.id"
                  :value="classe.id"
                >
                  {{ classe.name }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Matière</label>
              <select v-model="selectedSubjectId" class="input-field">
                <option value="">Sélectionner une matière</option>
                <option
                  v-for="subject in subjectsStore.subjects"
                  :key="subject.id"
                  :value="subject.id"
                >
                  {{ subject.name }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Période</label>
              <select v-model="selectedPeriod" class="input-field">
                <option value="">Sélectionner une période</option>
                <option value="Trimestre 1">Trimestre 1</option>
                <option value="Trimestre 2">Trimestre 2</option>
                <option value="Trimestre 3">Trimestre 3</option>
              </select>
            </div>
            
            <!-- <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type d'évaluation</label>
              <select v-model="selectedType" class="input-field">
                <option value="Devoir">Devoir</option>
                <option value="Contrôle">Contrôle</option>
                <option value="Examen">Examen</option>
              </select>
            </div> -->
          </div>
        </div>

        <!-- Students Grades Table -->
        <div v-if="canShowGradesTable" class="card">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ selectedClassName }} - {{ selectedSubjectName }} - {{ selectedPeriod }}
            </h3>
            <button @click="saveAllGrades" class="btn-primary" :disabled="saving">
              <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
              Enregistrer les Notes
            </button>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Élève
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interro 1 (/20)
                    
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interro 2 (/20)
                    
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interro 3 (/20)
                    
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Moy.Interro
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Devoir 1
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Devoir 2
                  </th>
                  <th class="px-6 py-3 text-left text-xs  font-bold text-gray-500 uppercase tracking-wider">
                    Moyenne Matière
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appréciation
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="student in classStudents"
                  :key="student.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div>
                        <div class="text-sm font-medium text-gray-900">
                          {{ student.firstName }} {{ student.lastName }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ student.gender === 'M' ? 'Masculin' : 'Féminin' }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      v-model.number="studentGrades[student.id].interros[0]"
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      class="input-field w-24"
                      placeholder="0-20"
                    >
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      v-model.number="studentGrades[student.id].interros[1]"
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      class="input-field w-24"
                      placeholder="0-20"
                    >
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      v-model.number="studentGrades[student.id].interros[2]"
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      class="input-field w-24"
                      placeholder="0-20"
                    >
                  </td>
                  <!-- Moyenne Interro -->
                  <td class="px-6 py-4 whitespace-nowrap font-bold">
                    {{ getInterroAvg(student.id) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      v-model.number="studentGrades[student.id].devoirs[0]"
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      class="input-field w-24"
                      placeholder="0-20"
                    >
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      v-model.number="studentGrades[student.id].devoirs[1]"
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      class="input-field w-24"
                      placeholder="0-20"
                    >
                  </td>
                  <!-- Moyenne Matière -->
                  <td class="px-6 py-4 whitespace-nowrap font-bold">
                    {{ getMatiereAvg(student.id) }}
                  </td>
                  <!-- Appréciation  -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      v-if="getMatiereAvg(student.id) !== undefined && getMatiereAvg(student.id) !== null"
                      :class="getGradeStatus(getMatiereAvg(student.id))"
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    >
                      {{ getGradeStatusText(getMatiereAvg(student.id)) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Existing Grades -->
        <div v-if="existingGrades.length > 0" class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Notes Existantes</h3>
          <BaseTable
            :data="existingGrades"
            :columns="gradeColumns"
            title=""
            :searchable="false"
          >
            <template #cell-studentName="{ item }">
              {{ getStudentName(item.studentId) }}
            </template>
            
            <template #cell-subjectName="{ item }">
              {{ getSubjectName(item.subjectId) }}
            </template>
            <template #cell-interro1="{ value }">
              <span :class="getGradeStatus(value)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ value }}/20
              </span>
            </template>
            <template #cell-interro2="{ value }">
              <span :class="getGradeStatus(value)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ value }}/20
              </span>
            </template>
            <template #cell-interro3="{ value }">
              <span :class="getGradeStatus(value)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ value }}/20
              </span>
            </template>
            
            <template #cell-interroAvg="{ value }">
              <span :class="getGradeStatus(value)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ value }}
              </span>
            </template>
            <template #cell-devoir1="{ value }">
              <span :class="getGradeStatus(value)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ value }}/20
              </span>
            </template>
            <template #cell-devoir2="{ value }">
              <span :class="getGradeStatus(value)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ value }}/20
              </span>
            </template>
            <template #cell-matiereAvg="{ value }">
              <span :class="getGradeStatus(value)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ value }}
              </span>
            </template>
            
            <template #row-actions="{ item }">
              <button
                @click="editGrade(item)"
                class="text-primary-600 hover:text-primary-900 transition-colors"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="deleteGrade(item)"
                class="text-danger-600 hover:text-danger-900 transition-colors ml-2"
              >
                <i class="fas fa-trash"></i>
              </button>
            </template>
          </BaseTable>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import BaseTable from '@/components/common/BaseTable.vue'
import { useGradesStore } from '@/stores/grades'
import { useStudentsStore } from '@/stores/students'
import { useClassesStore } from '@/stores/classes'
import { useSubjectsStore } from '@/stores/subjects'
import { useAuthStore } from '@/stores/auth'

const sidebarCollapsed = ref(false)
const gradesStore = useGradesStore()
const studentsStore = useStudentsStore()
const classesStore = useClassesStore()
const subjectsStore = useSubjectsStore()
const authStore = useAuthStore()

const selectedClassId = ref('')
const selectedSubjectId = ref('')
const selectedPeriod = ref('')
// const selectedType = ref('Devoir')
const studentGrades = ref({})
const saving = ref(false)

onMounted(() => {
  authStore.initAuth()
})


const gradeColumns = [
  { key: 'studentName', label: 'Élève' },
  { key: 'subjectName', label: 'Matière' },
  { key: 'period', label: 'Période' },
  { key: 'interro1', label: 'Interro 1' },
  { key: 'interro2', label: 'Interro 2' },
  { key: 'interro3', label: 'Interro 3' },
  { key: 'interroAvg', label: 'Moy Interro' },
  { key: 'devoir1', label: 'Devoir 1' },
  { key: 'devoir2', label: 'Devoir 2' },
  { key: 'matiereAvg', label: 'Moy Mat' },
  { key: 'date', label: 'Date' }
]

const canShowGradesTable = computed(() => {
  return selectedClassId.value && selectedSubjectId.value && selectedPeriod.value
})

const selectedClassName = computed(() => {
  const classe = classesStore.getClassById(selectedClassId.value)
  return classe ? classe.name : ''
})

const selectedSubjectName = computed(() => {
  const subject = subjectsStore.getSubjectById(selectedSubjectId.value)
  return subject ? subject.name : ''
})

const classStudents = computed(() => {
  if (!selectedClassId.value) return []
  return studentsStore.getStudentsByClass(selectedClassId.value)
})

const existingGrades = computed(() => {
  // Regroupe les notes par élève
  const grouped = {}
  for (const grade of gradesStore.getGradesByClass(
    selectedClassId.value,
    selectedSubjectId.value,
    selectedPeriod.value
  )) {
    const key = `${grade.studentId}-${grade.subjectId}`
    if (!grouped[key]) {
      grouped[key] = {
        studentId: grade.studentId,
        subjectId: grade.subjectId,
        studentName: getStudentName(grade.studentId),
        subjectName: getSubjectName(grade.subjectId),
        period: grade.period,
        interros: [null, null, null],
        devoirs: [null, null],
        date: grade.date 
      }
    }
    if (grade.type === 'Interro' && grade.index !== undefined && grade.index < 3) {
      grouped[key].interros[grade.index] = grade.grade
    }
    if (grade.type === 'Devoir' && grade.index !== undefined && grade.index < 2) {
      grouped[key].devoirs[grade.index] = grade.grade
    }
  }

  // Calcule les moyennes
  return Object.values(grouped).map(row => {
    const validInterros = row.interros.filter(v => v !== null && v !== undefined && v !== '')
    const interroAvg = validInterros.length
      ? (validInterros.reduce((a, b) => a + b, 0) / validInterros.length).toFixed(2)
      : ''
    const validDevoirs = row.devoirs.filter(v => v !== null && v !== undefined && v !== '')
    let matiereAvg = ''
    if (interroAvg && validDevoirs.length === 2) {
      matiereAvg = ((parseFloat(interroAvg) + validDevoirs[0] + validDevoirs[1]) / 3).toFixed(2)
    } else if (interroAvg && validDevoirs.length === 1) {
      matiereAvg = ((parseFloat(interroAvg) + validDevoirs[0]) / 2).toFixed(2)
    } else if (interroAvg) {
      matiereAvg = interroAvg
    } else if (validDevoirs.length > 0) {
      matiereAvg = (validDevoirs.reduce((a, b) => a + b, 0) / validDevoirs.length).toFixed(2)
    }
    return {
      ...row,
      interro1: row.interros[0],
      interro2: row.interros[1],
      interro3: row.interros[2],
      interroAvg,
      devoir1: row.devoirs[0],
      devoir2: row.devoirs[1],
      matiereAvg
    }
  })
})

// Initialisation des notes à la sélection
function loadStudents() {
  studentGrades.value = {}
  for (const student of classStudents.value) {
    const grades = gradesStore.grades.filter(
      g =>
        g.studentId === student.id &&
        g.subjectId === selectedSubjectId.value &&
        g.classId === selectedClassId.value &&
        g.period === selectedPeriod.value
    )
    // Pré-remplir les champs avec les notes existantes
    const interros = [null, null, null]
    const devoirs = [null, null]
    let interroIndex = 0
    let devoirIndex = 0
    for (const grade of grades) {
      if (grade.type === 'Interro' && interroIndex < 3) {
        interros[interroIndex++] = grade.grade
      } else if (grade.type === 'Devoir' && devoirIndex < 2) {
        devoirs[devoirIndex++] = grade.grade
      }
    }
    studentGrades.value[student.id] = { interros, devoirs }
  }
}

// Calcul des moyennes
function getInterroAvg(studentId) {
  const interros = studentGrades.value[studentId]?.interros || []
  const valid = interros.filter(v => v !== null && v !== undefined && v !== '')
  if (valid.length === 0) return ''
  const sum = valid.reduce((a, b) => a + b, 0)
  return (sum / valid.length).toFixed(2)
}
function getMatiereAvg(studentId) {
  const interros = studentGrades.value[studentId]?.interros || []
  const devoirs = studentGrades.value[studentId]?.devoirs || []
  const validInterros = interros.filter(v => v !== null && v !== undefined && v !== '')
  const validDevoirs = devoirs.filter(v => v !== null && v !== undefined && v !== '')
  if (validInterros.length === 0 && validDevoirs.length === 0) return ''
  const interroAvg = validInterros.length ? validInterros.reduce((a, b) => a + b, 0) / validInterros.length : null
  if (interroAvg !== null && validDevoirs.length === 2) {
    return ((interroAvg + validDevoirs[0] + validDevoirs[1]) / 3).toFixed(2)
  } else if (interroAvg !== null && validDevoirs.length === 1) {
    return ((interroAvg + validDevoirs[0]) / 2).toFixed(2)
  } else if (interroAvg !== null) {
    return interroAvg.toFixed(2)
  } else if (validDevoirs.length > 0) {
    return (validDevoirs.reduce((a, b) => a + b, 0) / validDevoirs.length).toFixed(2)
  }
  return ''
}

function getGradeStatus(grade) {
  if (grade >= 17) return 'bg-green-100 text-green-800'
  if (grade >= 15) return 'bg-blue-100 text-blue-800'
  if (grade >= 12) return 'bg-yellow-100 text-yellow-800'
  if (grade >= 10) return 'bg-orange-200 text-orange-600'
  return 'bg-red-100 text-red-800'
}

function getGradeStatusText(grade) {
  if (grade >= 17) return 'Très Bien'
  if (grade >= 15) return 'Bien'
  if (grade >= 12) return 'Assez Bien'
  if (grade >= 10) return 'Passable'
  return 'Insuffisant'
}

function getStudentName(studentId) {
  const student = studentsStore.students.find(s => s.id === studentId)
  return student ? `${student.firstName} ${student.lastName}` : 'Élève inconnu'
}

function getSubjectName(subjectId) {
  const subject = subjectsStore.subjects.find(s => s.id === subjectId)
  return subject ? subject.name : 'Matière inconnue'
}

async function saveAllGrades() {
  saving.value = true
  
  try {
    for (const [studentId, notes] of Object.entries(studentGrades.value)) {
      const numStudentId = parseInt(studentId)
      const numSubjectId = parseInt(selectedSubjectId.value)
      const numClassId = parseInt(selectedClassId.value)
      
      // Interros
      notes.interros.forEach((grade, idx) => {
        if (grade !== null && grade !== undefined && grade !== '') {
          const existing = gradesStore.grades.find(g =>
            g.studentId === numStudentId &&
            g.subjectId === numSubjectId &&
            g.classId === numClassId &&
            g.period === selectedPeriod.value &&
            g.type === 'Interro' &&
            g.index === idx
          )
          if (existing) {
            gradesStore.updateGrade(existing.id, { grade: parseFloat(grade) })
          } else {
            gradesStore.addGrade({
              studentId: numStudentId,
              subjectId: numSubjectId,
              classId: numClassId,
              period: selectedPeriod.value,
              grade: parseFloat(grade),
              maxGrade: 20,
              type: 'Interro',
              index: idx
            })
          }
        }
      })
      // Devoirs
      notes.devoirs.forEach((grade, idx) => {
        if (grade !== null && grade !== undefined && grade !== '') {
          const existing = gradesStore.grades.find(g =>
            g.studentId === numStudentId &&
            g.subjectId === numSubjectId &&
            g.classId === numClassId &&
            g.period === selectedPeriod.value &&
            g.type === 'Devoir' &&
            g.index === idx
          )
          if (existing) {
            gradesStore.updateGrade(existing.id, { grade: parseFloat(grade) })
          } else {
            gradesStore.addGrade({
              studentId: numStudentId,
              subjectId: numSubjectId,
              classId: numClassId,
              period: selectedPeriod.value,
              grade: parseFloat(grade),
              maxGrade: 20,
              type: 'Devoir',
              index: idx
            })
          }
        }
      })
    }
    alert('Notes enregistrées avec succès!')
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error)
    alert('Erreur lors de l\'enregistrement des notes')
  } finally {
    saving.value = false
  }
}

function editGrade(grade) {
  const newGrade = prompt('Nouvelle note:', grade.grade)
  if (newGrade !== null && !isNaN(newGrade)) {
    gradesStore.updateGrade(grade.id, { grade: parseFloat(newGrade) })
  }
}

function deleteGrade(grade) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
    gradesStore.deleteGrade(grade.id)
  }
}

watch([selectedClassId, selectedSubjectId, selectedPeriod], () => {
  if (canShowGradesTable.value) {
    loadStudents()
  }
})
</script>

<style scoped>
.layout-container {
  @apply flex h-screen bg-gray-50;
}

.main-content {
  @apply flex-1 flex flex-col overflow-hidden;
}

.scrollable-content {
  overflow-y: auto;
  height: 100vh;
  /* Pour éviter que le header ne soit masqué, ajuste si besoin */
  /* padding-top: 64px; */
}
</style>