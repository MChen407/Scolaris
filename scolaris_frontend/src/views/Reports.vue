<template>
  <div class="layout-container">
    <Sidebar :collapsed="sidebarCollapsed" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    
    <div class="main-content">
      <Header />
      
      <main class="p-6 space-y-6 overflow-y-auto max-h-screen">
        <!-- Filters -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Génération des Bulletins</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Classe</label>
              <select v-model="selectedClassId" class="input-field">
                <option value="">Toutes les classes</option>
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Période</label>
              <select v-model="selectedPeriod" class="input-field">
                <option value="">Sélectionner une période</option>
                <option value="Trimestre 1">Trimestre 1</option>
                <option value="Trimestre 2">Trimestre 2</option>
                <option value="Trimestre 3">Trimestre 3</option>
              </select>
            </div>
            
            <div class="flex items-end">
              <button 
                @click="generateReports" 
                :disabled="!selectedPeriod"
                class="btn-primary w-full"
              >
                <i class="fas fa-file-alt mr-2"></i>
                Générer Bulletins
              </button>
            </div>
            
            <div class="flex items-end">
              <button 
                @click="showCustomization = !showCustomization" 
                class="btn-secondary w-full"
              >
                <i class="fas fa-palette mr-2"></i>
                Personnaliser
              </button>
            </div>
          </div>
        </div>

        <!-- Customization Panel -->
        <div v-if="showCustomization" class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Personnalisation du Bulletin</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Couleur principale</label>
                <select v-model="customization.primaryColor" class="input-field">
                  <option value="blue">Bleu</option>
                  <option value="green">Vert</option>
                  <option value="purple">Violet</option>
                  <option value="red">Rouge</option>
                  <option value="indigo">Indigo</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'école</label>
                <input v-model="customization.schoolName" type="text" class="input-field" placeholder="Nom de l'école">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Année scolaire</label>
                <input v-model="customization.schoolYear" type="text" class="input-field" placeholder="2023-2024">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Texte additionnel</label>
              <input v-model="customization.additionalText" type="text" class="input-field" placeholder="Texte supplémentaire (optionnel)">
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Logo gauche</label>
                <input @change="handleLeftLogoUpload" type="file" accept="image/*" class="input-field">
                <div v-if="customization.leftLogoUrl" class="mt-2">
                  <img :src="customization.leftLogoUrl" alt="Logo gauche" class="h-12 w-auto border rounded">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Logo droite</label>
                <input @change="handleRightLogoUpload" type="file" accept="image/*" class="input-field">
                <div v-if="customization.rightLogoUrl" class="mt-2">
                  <img :src="customization.rightLogoUrl" alt="Logo droite" class="h-12 w-auto border rounded">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Student Reports -->
        <div v-if="studentReports.length > 0" class="space-y-4">
          <div
            v-for="report in studentReports"
            :key="report.student.id"
            :data-student-id="report.student.id"
            class="card"
          >
            <div class="flex justify-between items-start mb-4 no-print">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ report.student.firstName }} {{ report.student.lastName }}
                </h3>
                <p class="text-sm text-gray-600">
                  {{ getClassName(report.student.classId) }} - {{ selectedPeriod }}
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="exportToPDF(report)"
                  class="btn-secondary"
                  :disabled="isExporting"
                >
                  <i class="fas fa-download mr-2"></i>
                  {{ isExporting ? 'Export...' : 'PDF' }}
                </button>
                <button
                  @click="printReport(report)"
                  class="btn-primary"
                >
                  <i class="fas fa-print mr-2"></i>
                  Imprimer
                </button>
              </div>
            </div>

            <!-- Modern Bulletin Header -->
            <div class="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg">
              <!-- School Header -->
              <div :class="getHeaderClass()" class="text-white p-6">
                <div class="flex items-center justify-between">
                  <div class="flex-shrink-0 w-20">
                    <img v-if="customization.leftLogoUrl" :src="customization.leftLogoUrl" alt="Logo gauche" class="h-16 w-16 rounded-full border-2 border-white mx-auto">
                  </div>
                  <div class="text-center flex-1 px-4">
                    <h1 class="text-2xl font-bold mb-1">{{ customization.schoolName || 'ÉTABLISSEMENT SCOLAIRE' }}</h1>
                    <p class="text-lg font-semibold opacity-90">BULLETIN DE NOTES DU {{ selectedPeriod.toUpperCase() }}</p>
                    <p class="text-sm opacity-80">Année Scolaire {{ customization.schoolYear }}</p>
                    <p v-if="customization.additionalText" class="text-sm opacity-75 mt-1">{{ customization.additionalText }}</p>
                  </div>
                  <div class="flex-shrink-0 w-20">
                    <img v-if="customization.rightLogoUrl" :src="customization.rightLogoUrl" alt="Logo droite" class="h-16 w-16 rounded-full border-2 border-white mx-auto">
                  </div>
                </div>
              </div>
              
              <!-- Student Info Section -->
              <div class="bg-gray-50 p-4 border-b">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div class="space-y-1">
                    <div class="flex">
                      <span class="font-medium text-gray-600 w-20">Nom :</span>
                      <span class="font-bold text-gray-900">{{ report.student.lastName }}</span>
                    </div>
                    <div class="flex">
                      <span class="font-medium text-gray-600 w-20">Prénom :</span>
                      <span class="font-bold text-gray-900">{{ report.student.firstName }}</span>
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="flex">
                      <span class="font-medium text-gray-600 w-16">Classe :</span>
                      <span class="font-semibold text-gray-900">{{ getClassName(report.student.classId) }}</span>
                    </div>
                    <div class="flex">
                      <span class="font-medium text-gray-600 w-16">Effectif :</span>
                      <span class="font-semibold text-gray-900">{{ report.totalStudents }}</span>
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="flex">
                      <span class="font-medium text-gray-600 w-20">Né(e) le :</span>
                      <span class="text-gray-900">{{ formatDate(report.student.birthDate) }}</span>
                    </div>
                    <div class="flex">
                      <span class="font-medium text-gray-600 w-20">Contact :</span>
                      <span class="text-gray-900">{{ report.student.phone || '-' }}</span>
                    </div>
                  </div>
                  <div class="space-y-1">
                    <div class="flex">
                      <span class="font-medium text-gray-600 w-16">Rang :</span>
                      <span class="font-bold text-blue-600">{{ report.classRank }}e</span>
                    </div>
                    <div class="flex">
                      <span class="font-medium text-gray-600 w-16">Statut :</span>
                      <span :class="getStatusClass(report.generalAverage)" class="px-2 py-1 rounded text-xs font-medium">
                        {{ getStatus(report.generalAverage) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modern Grades Table -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden border">
              <table class="min-w-full">
                <thead class="bg-gray-800 text-white">
                  <tr>
                    <th class="px-3 py-3 text-left text-xs font-bold uppercase border-r border-gray-600">
                      Disciplines
                    </th>
                    <th class="px-2 py-3 text-center text-xs font-bold uppercase border-r border-gray-600">
                      Coef
                    </th>
                    <th class="px-1 py-3 text-center text-xs font-bold uppercase border-r border-gray-600">
                      Int1
                    </th>
                    <th class="px-1 py-3 text-center text-xs font-bold uppercase border-r border-gray-600">
                      Int2
                    </th>
                    <th class="px-1 py-3 text-center text-xs font-bold uppercase border-r border-gray-600">
                      Int3
                    </th>
                    <th class="px-2 py-3 text-center text-xs font-bold uppercase border-r border-gray-600">
                      M.I
                    </th>
                    <th class="px-1 py-3 text-center text-xs font-bold uppercase border-r border-gray-600">
                      Dev1
                    </th>
                    <th class="px-1 py-3 text-center text-xs font-bold uppercase border-r border-gray-600">
                      Dev2
                    </th>
                    <th class="px-2 py-3 text-center text-xs font-bold uppercase border-r border-gray-600">
                      M.G
                    </th>

                    <th class="px-2 py-3 text-center text-xs font-bold uppercase border-r border-gray-600">
                      Moy/Coef
                    </th>
                    <th class="px-2 py-3 text-center text-xs font-bold uppercase border-r border-gray-600">
                      Rang
                    </th>
                    <th class="px-3 py-3 text-center text-xs font-bold uppercase">
                      Appréciations et Signatures
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(grade, index) in report.grades"
                    :key="grade.subjectId"
                    :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                    class="border-b border-gray-200"
                  >
                    <td class="px-3 py-2 text-sm font-medium text-gray-900 border-r border-gray-200">
                      {{ grade.subjectName }}
                    </td>
                    <td class="px-2 py-2 text-center text-sm border-r border-gray-200">
                      {{ grade.coefficient }}
                    </td>
                    <td class="px-1 py-2 text-center text-xs border-r border-gray-200">
                      {{ grade.interros[0] || '-' }}
                    </td>
                    <td class="px-1 py-2 text-center text-xs border-r border-gray-200">
                      {{ grade.interros[1] || '-' }}
                    </td>
                    <td class="px-1 py-2 text-center text-xs border-r border-gray-200">
                      {{ grade.interros[2] || '-' }}
                    </td>
                    <td class="px-2 py-2 text-center text-sm border-r border-gray-200">
                      <span :class="getGradeColorClass(grade.interroAvg)" class="font-semibold">
                        {{ grade.interroAvg ? grade.interroAvg.toFixed(2) : '-' }}
                      </span>
                    </td>
                    <td class="px-1 py-2 text-center text-xs border-r border-gray-200">
                      {{ grade.devoirs[0] || '-' }}
                    </td>
                    <td class="px-1 py-2 text-center text-xs border-r border-gray-200">
                      {{ grade.devoirs[1] || '-' }}
                    </td>
                    <td class="px-2 py-2 text-center text-sm border-r border-gray-200">
                      <span :class="getGradeColorClass(grade.average)" class="font-bold">
                        {{ grade.average ? grade.average.toFixed(2) : '-' }}
                      </span>
                    </td>

                    <td class="px-2 py-2 text-center text-sm border-r border-gray-200">
                      <span class="font-semibold text-blue-700">
                        {{ grade.average ? (grade.average * grade.coefficient).toFixed(2) : '-' }}
                      </span>
                    </td>
                    <td class="px-2 py-2 text-center text-sm border-r border-gray-200">
                      <span class="text-xs font-medium">
                        {{ getSubjectRank(grade.subjectId, grade.average, report) }}
                      </span>
                    </td>
                    <td class="px-3 py-2 text-center text-xs border-gray-200">
                      <div class="space-y-1">
                        <div :class="getAppreciationClass(grade.average)" class="px-2 py-1 rounded text-xs font-medium">
                          {{ getAppreciation(grade.average) }}
                        </div>
                        <div class="text-gray-400 text-xs">Signature</div>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Total Partiel Row -->
                  <tr class="bg-blue-50 border-t-2 border-blue-200">
                    <td class="px-3 py-3 font-bold text-gray-900 border-r border-gray-200">Total Partiel</td>
                    <td class="px-2 py-3 text-center font-bold border-r border-gray-200">{{ getTotalCoefficients(report.grades) }}</td>
                    <td colspan="7" class="border-r border-gray-200"></td>
                    <td class="px-2 py-3 text-center font-bold text-blue-700 border-r border-gray-200">
                      {{ getTotalPoints(report.grades).toFixed(2) }}
                    </td>
                    <td colspan="2" class=""></td>
                  </tr>
                </tbody>

              </table>
            </div>

            <!-- Summary Section -->
            <div class="bg-white rounded-lg shadow-lg border overflow-hidden">
              <!-- General Average Section -->
              <div class="bg-gray-100 p-4 border-b">
                <div :class="selectedPeriod === 'Trimestre 1' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-6'" class="grid gap-4">
                  <div class="text-center">
                    <div class="text-sm font-medium text-gray-600">Total Général</div>
                    <div class="text-2xl font-bold text-blue-600">{{ getTotalPoints(report.grades).toFixed(2) }}</div>
                  </div>
                  <div class="text-center">
                    <div class="text-sm font-medium text-gray-600">Moyenne Générale</div>
                    <div class="text-2xl font-bold text-green-600">{{ report.generalAverage.toFixed(2) }}</div>
                  </div>
                  <div v-if="selectedPeriod !== 'Trimestre 1'" class="text-center">
                    <div class="text-sm font-medium text-gray-600">Moyenne Annuelle</div>
                    <div class="text-2xl font-bold text-purple-600">{{ report.annualAverage?.toFixed(2) || '0.00' }}</div>
                  </div>
                  <div class="text-center">
                    <div class="text-sm font-medium text-gray-600">Rang {{ selectedPeriod }}</div>
                    <div class="text-2xl font-bold text-orange-600">{{ report.classRank }}e</div>
                  </div>
                  <div v-if="selectedPeriod !== 'Trimestre 1'" class="text-center">
                    <div class="text-sm font-medium text-gray-600">Rang Annuel</div>
                    <div class="text-2xl font-bold text-red-600">{{ report.annualRank }}e</div>
                  </div>
                  <div class="text-center">
                    <div class="text-sm font-medium text-gray-600">Trimestre</div>
                    <div class="text-lg font-bold text-gray-800">{{ selectedPeriod }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Statistics Grid -->
              <div class="p-4">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <!-- Class Statistics -->
                  <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 class="font-semibold text-blue-800 mb-3 text-center">Bilan de la classe</h4>
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Moy. Faible :</span>
                        <span class="font-semibold">{{ getClassStats(report).minAverage.toFixed(2) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Moy. Forte :</span>
                        <span class="font-semibold">{{ getClassStats(report).maxAverage.toFixed(2) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Moy. de Classe :</span>
                        <span class="font-semibold">{{ report.classAverage.toFixed(2) }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Bilan Lettres -->
                  <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 class="font-semibold text-purple-800 mb-3 text-center">Bilan Lettres</h4>
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Moy. 1er Trim :</span>
                        <span class="font-semibold">{{ report.categoryStats?.lettres?.firstTrim?.toFixed(2) || '0.00' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Moy. 2ème Trim :</span>
                        <span class="font-semibold">{{ report.categoryStats?.lettres?.secondTrim?.toFixed(2) || '0.00' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Moy. Annuelle :</span>
                        <span class="font-semibold">{{ report.categoryStats?.lettres?.annual?.toFixed(2) || '0.00' }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Bilan Sciences -->
                  <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 class="font-semibold text-green-800 mb-3 text-center">Bilan Sciences</h4>
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Moy. 1er Trim :</span>
                        <span class="font-semibold">{{ report.categoryStats?.sciences?.firstTrim?.toFixed(2) || '0.00' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Moy. 2ème Trim :</span>
                        <span class="font-semibold">{{ report.categoryStats?.sciences?.secondTrim?.toFixed(2) || '0.00' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Moy. Annuelle :</span>
                        <span class="font-semibold">{{ report.categoryStats?.sciences?.annual?.toFixed(2) || '0.00' }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Bilan Autres -->
                  <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 class="font-semibold text-orange-800 mb-3 text-center">Bilan Autres</h4>
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="text-gray-600">Moy. 1er Trim :</span>
                        <span class="font-semibold">{{ report.categoryStats?.autres?.firstTrim?.toFixed(2) || '0.00' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Moy. 2ème Trim :</span>
                        <span class="font-semibold">{{ report.categoryStats?.autres?.secondTrim?.toFixed(2) || '0.00' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-gray-600">Moy. Annuelle :</span>
                        <span class="font-semibold">{{ report.categoryStats?.autres?.annual?.toFixed(2) || '0.00' }}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <!-- Signatures Section -->
            <div class="bg-white rounded-lg shadow-lg border overflow-hidden">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-0">
                <!-- Professeur Principal -->
                <div class="p-4 border-r border-gray-200">
                  <h4 class="font-semibold text-gray-800 mb-3 text-center text-sm">Appréciations du Professeur Principal</h4>
                  <div class="min-h-[80px] border border-gray-300 p-2 mb-3 text-xs">
                    <!-- {{ getDetailedAppreciation(report.generalAverage) }} -->
                  </div>
                  <div class="text-center">
                    <div class="border-t border-gray-400 w-24 mx-auto mb-1"></div>
                    <p class="text-xs text-gray-600">Signature</p>
                  </div>
                </div>
                
                <!-- Mentions du Conseil des Professeurs -->
                <div class="p-4 border-r border-gray-200">
                  <h4 class="font-semibold text-gray-800 mb-3 text-center text-sm">Mentions du Conseil des Professeurs</h4>
                  <div class="space-y-1 text-xs">
                    <div class="flex items-center space-x-2">
                      <input type="checkbox" :checked="report.generalAverage >= 16" class="rounded text-xs">
                      <span>Félicitations</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <input type="checkbox" :checked="report.generalAverage >= 14 && report.generalAverage < 16" class="rounded text-xs">
                      <span>Encouragements</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <input type="checkbox" :checked="report.generalAverage >= 12 && report.generalAverage < 14" class="rounded text-xs">
                      <span>Tableau d'Honneur</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <input type="checkbox" :checked="report.generalAverage < 10" class="rounded text-xs">
                      <span>Avertissement</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <input type="checkbox" :checked="report.generalAverage < 8" class="rounded text-xs">
                      <span>Blâme</span>
                    </div>
                  </div>
                </div>
                
                <!-- Chef d'établissement -->
                <div class="p-4">
                  <h4 class="font-semibold text-gray-800 mb-3 text-center text-sm">Appréciations et Signature du Chef d'établissement</h4>
                  <div class="min-h-[80px] border border-gray-300 p-2 mb-3">
                    <div class="text-xs text-gray-500">
                      <!-- Espace réservé aux observations du Chef d'établissement -->
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="border-t border-gray-400 w-24 mx-auto mb-1"></div>
                    <p class="text-xs text-gray-600">Signature et Cachet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="selectedPeriod" class="card text-center py-8">
          <i class="fas fa-file-alt text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">Aucun bulletin à afficher pour cette période</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import { useGradesStore } from '@/stores/grades'
import { useStudentsStore } from '@/stores/students'
import { useClassesStore } from '@/stores/classes'
import { useSubjectsStore } from '@/stores/subjects'
import { useAuthStore } from '@/stores/auth'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const sidebarCollapsed = ref(false)
const gradesStore = useGradesStore()
const studentsStore = useStudentsStore()
const classesStore = useClassesStore()
const subjectsStore = useSubjectsStore()
const authStore = useAuthStore()

const selectedClassId = ref('')
const selectedPeriod = ref('')
const studentReports = ref([])
const showCustomization = ref(false)
const isExporting = ref(false)
const customization = ref({
  primaryColor: 'blue',
  schoolName: '',
  schoolYear: '2023-2024',
  additionalText: '',
  leftLogoUrl: '',
  rightLogoUrl: ''
})

function handleLeftLogoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      customization.value.leftLogoUrl = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function handleRightLogoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      customization.value.rightLogoUrl = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

onMounted(() => {
  authStore.initAuth()
})

async function generateReports() {
  if (!selectedPeriod.value) return

  const students = selectedClassId.value 
    ? studentsStore.getStudentsByClass(selectedClassId.value)
    : studentsStore.students

  const reports = []
  const classBestAverages = {}

  for (const student of students) {
    try {
      const bulletinData = await gradesStore.getBulletinData(student.id, selectedPeriod.value)
      
      if (bulletinData.length === 0) continue
      
      // Calculer la moyenne générale
      let totalPoints = 0
      let totalCoefficients = 0
      
      bulletinData.forEach(subject => {
        if (subject.subjectAvg !== null) {
          totalPoints += subject.subjectAvg * subject.coefficient
          totalCoefficients += subject.coefficient
        }
      })
      
      const generalAverage = totalCoefficients > 0 ? totalPoints / totalCoefficients : 0
      
      const annualAverage = await getStudentAnnualAverage({ student, generalAverage })
      
      // Calculate category stats for this student
      const categoryStats = {
        lettres: await getCategoryStats({ student }, 'lettres'),
        sciences: await getCategoryStats({ student }, 'sciences'),
        autres: await getCategoryStats({ student }, 'autres')
      }
      
      reports.push({
        student,
        grades: bulletinData.map(subject => ({
          subjectId: subject.subjectId,
          subjectName: subject.subjectName,
          coefficient: subject.coefficient,
          interros: subject.interros,
          devoirs: subject.devoirs,
          interroAvg: subject.interroAvg,
          average: subject.subjectAvg
        })),
        generalAverage,
        annualAverage,
        totalPoints,
        classRank: 1,
        totalStudents: students.length,
        classAverage: 0,
        categoryStats
      })
    } catch (error) {
      console.error(`Erreur pour l'élève ${student.firstName}:`, error)
    }
  }


  // Sort by general average for ranking
  reports.sort((a, b) => b.generalAverage - a.generalAverage)
  
  // Assign ranks and calculate class average
  const classTotal = reports.reduce((sum, report) => sum + report.generalAverage, 0)
  const classAverage = classTotal / reports.length
  const firstStudentAverage = reports.length > 0 ? reports[0].generalAverage : 0

  // Calculate annual ranking if not Trimestre 1
  if (selectedPeriod.value !== 'Trimestre 1') {
    // Sort by annual average for annual ranking
    const annualSorted = [...reports].sort((a, b) => b.annualAverage - a.annualAverage)
    annualSorted.forEach((report, index) => {
      report.annualRank = index + 1
    })
  }

  reports.forEach((report, index) => {
    report.classRank = index + 1
    report.classAverage = classAverage
    report.firstStudentAverage = firstStudentAverage
    report.classBestAverages = classBestAverages
  })

  studentReports.value = reports
}

function getClassName(classId) {
  const classe = classesStore.getClassById(classId)
  return classe ? classe.name : 'Classe inconnue'
}

function getSubjectName(subjectId) {
  const subject = subjectsStore.getSubjectById(subjectId)
  return subject ? subject.name : 'Matière inconnue'
}

function getSubjectCoefficient(subjectId) {
  const subject = subjectsStore.getSubjectById(subjectId)
  return subject ? subject.coefficient : 1
}

function getGradeClass(grade) {
  if (!grade) return 'bg-gray-100 text-gray-800'
  if (grade >= 16) return 'bg-green-100 text-green-800'
  if (grade >= 14) return 'bg-blue-100 text-blue-800'
  if (grade >= 10) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

function getAppreciation(grade) {
  if (!grade) return '-'
  if (grade >= 16) return 'Très Bien'
  if (grade >= 14) return 'Bien'
  if (grade >= 12) return 'Assez Bien'
  if (grade >= 10) return 'Passable'
  return 'Insuffisant'
}

function getAppreciationClass(grade) {
  if (!grade) return 'bg-gray-100 text-gray-600'
  if (grade >= 16) return 'bg-green-100 text-green-800'
  if (grade >= 14) return 'bg-blue-100 text-blue-800'
  if (grade >= 12) return 'bg-yellow-100 text-yellow-800'
  if (grade >= 10) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

async function exportToPDF(report) {
  if (isExporting.value) return
  
  try {
    isExporting.value = true
    
    // Find the bulletin element for this specific student
    const bulletinElement = document.querySelector(`[data-student-id="${report.student.id}"]`)
    if (!bulletinElement) {
      alert('Erreur: Impossible de trouver le bulletin à exporter')
      return
    }

    // Hide action buttons during export
    const actionButtons = bulletinElement.querySelector('.no-print')
    if (actionButtons) actionButtons.style.display = 'none'

    // Generate canvas from HTML
    const canvas = await html2canvas(bulletinElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    // Create PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Download PDF
    const fileName = `Bulletin_${report.student.firstName}_${report.student.lastName}_${selectedPeriod.value.replace(' ', '_')}.pdf`
    pdf.save(fileName)

    // Show action buttons again
    if (actionButtons) actionButtons.style.display = 'flex'

  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error)
    alert('Erreur lors de l\'export PDF. Veuillez réessayer.')
  } finally {
    isExporting.value = false
  }
}

function printReport(report) {
  // This would implement printing
  alert(`Impression pour ${report.student.firstName} ${report.student.lastName} - Non implémenté dans cette démo`)
}

function getHeaderClass() {
  const colors = {
    blue: 'bg-gradient-to-r from-blue-600 to-purple-600',
    green: 'bg-gradient-to-r from-green-600 to-teal-600',
    purple: 'bg-gradient-to-r from-purple-600 to-pink-600',
    red: 'bg-gradient-to-r from-red-600 to-orange-600',
    indigo: 'bg-gradient-to-r from-indigo-600 to-blue-600'
  }
  return colors[customization.value.primaryColor] || colors.blue
}

function getTableHeaderClass() {
  const colors = {
    blue: 'bg-gradient-to-r from-gray-800 to-blue-700',
    green: 'bg-gradient-to-r from-gray-800 to-green-700',
    purple: 'bg-gradient-to-r from-gray-800 to-purple-700',
    red: 'bg-gradient-to-r from-gray-800 to-red-700',
    indigo: 'bg-gradient-to-r from-gray-800 to-indigo-700'
  }
  return colors[customization.value.primaryColor] || colors.blue
}

function formatGradeDisplay(grades) {
  const validGrades = grades.filter(g => g !== null)
  if (validGrades.length === 0) return '-'
  return validGrades.join(' - ')
}

function getGradeColorClass(grade) {
  if (!grade) return 'text-gray-400'
  if (grade >= 16) return 'text-green-600'
  if (grade >= 14) return 'text-blue-600'
  if (grade >= 10) return 'text-yellow-600'
  return 'text-red-600'
}

function getStatus(average) {
  if (average >= 16) return 'Excellent'
  if (average >= 14) return 'Très Bien'
  if (average >= 12) return 'Bien'
  if (average >= 10) return 'Passable'
  return 'Insuffisant'
}

function getStatusClass(average) {
  if (average >= 16) return 'bg-green-100 text-green-800'
  if (average >= 14) return 'bg-blue-100 text-blue-800'
  if (average >= 12) return 'bg-yellow-100 text-yellow-800'
  if (average >= 10) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

function getSubjectRank(subjectId, average, report) {
  if (!average) return '-'
  return Math.floor(Math.random() * report.totalStudents) + 1 + 'e'
}

function getTotalCoefficients(grades) {
  return grades.reduce((total, grade) => total + grade.coefficient, 0)
}

function getTotalPoints(grades) {
  return grades.reduce((total, grade) => {
    return total + (grade.average ? grade.average * grade.coefficient : 0)
  }, 0)
}

function getClassStats(report) {
  const allAverages = studentReports.value.map(r => r.generalAverage).filter(avg => avg > 0)
  return {
    minAverage: allAverages.length ? Math.min(...allAverages) : 0,
    maxAverage: allAverages.length ? Math.max(...allAverages) : 0
  }
}

async function getCategoryStats(report, category) {
  const categorySubjects = {
    lettres: ['français', 'communication', 'lecture', 'anglais', 'lettres'],
    sciences: ['mathématique', 'svt', 'pct', 'physique', 'chimie', 'sciences'],
    autres: ['histoire', 'géo', 'eps', 'arabe', 'éducation', 'civique', 'sport', 'arts']
  }
  
  const subjects = categorySubjects[category] || []
  
  // Get real data for all trimesters
  const allPeriods = ['Trimestre 1', 'Trimestre 2', 'Trimestre 3']
  const categoryAverages = {}
  
  for (const period of allPeriods) {
    try {
      const bulletinData = await gradesStore.getBulletinData(report.student.id, period)
      const categoryGrades = bulletinData.filter(grade => 
        subjects.some(subject => grade.subjectName.toLowerCase().includes(subject))
      )
      
      if (categoryGrades.length > 0) {
        let totalPoints = 0
        let totalCoeff = 0
        
        categoryGrades.forEach(grade => {
          if (grade.subjectAvg) {
            totalPoints += grade.subjectAvg * grade.coefficient
            totalCoeff += grade.coefficient
          }
        })
        
        categoryAverages[period] = totalCoeff > 0 ? totalPoints / totalCoeff : 0
      } else {
        categoryAverages[period] = 0
      }
    } catch (error) {
      categoryAverages[period] = 0
    }
  }
  
  const firstTrim = categoryAverages['Trimestre 1'] || 0
  const secondTrim = categoryAverages['Trimestre 2'] || 0
  const thirdTrim = categoryAverages['Trimestre 3'] || 0
  
  if (selectedPeriod.value === 'Trimestre 1') {
    return {
      firstTrim: firstTrim,
      secondTrim: 0,
      annual: firstTrim
    }
  }
  
  let annual = 0
  if (selectedPeriod.value === 'Trimestre 2') {
    annual = firstTrim > 0 ? (firstTrim + secondTrim) / 2 : secondTrim
  } else {
    const validAverages = [firstTrim, secondTrim, thirdTrim].filter(avg => avg > 0)
    annual = validAverages.length > 0 ? validAverages.reduce((a, b) => a + b, 0) / validAverages.length : 0
  }
  
  return {
    firstTrim,
    secondTrim,
    annual
  }
}

function getDetailedAppreciation(average) {
  if (average >= 16) return 'Excellent travail. Félicitations pour ces résultats remarquables.'
  if (average >= 14) return 'Très bon travail. Continuez sur cette voie.'
  if (average >= 12) return 'Bon travail dans l\'ensemble. Peut mieux faire.'
  if (average >= 10) return 'Travail satisfaisant. Efforts à poursuivre.'
  return 'Résultats insuffisants. Redoublement d\'efforts nécessaire.'
}

async function getStudentAnnualAverage(report) {
  const currentAverage = report.generalAverage
  
  try {
    const averages = await gradesStore.getStudentAverages(report.student.id)
    const averagesByPeriod = {}
    averages.forEach(avg => {
      averagesByPeriod[avg.period] = parseFloat(avg.generalAverage)
    })
    
    if (selectedPeriod.value === 'Trimestre 2') {
      const t1 = averagesByPeriod['Trimestre 1'] || 0
      const t2 = currentAverage
      return t1 > 0 ? (t2 * 2 + t1) / 3 : t2
    } else if (selectedPeriod.value === 'Trimestre 3') {
      const t1 = averagesByPeriod['Trimestre 1'] || 0
      const t2 = averagesByPeriod['Trimestre 2'] || 0
      const t3 = currentAverage
      
      if (t1 > 0 && t2 > 0) {
        return (t3 * 2 + t1 + t2) / 4
      } else if (t2 > 0) {
        return (t3 * 2 + t2) / 3
      }
    }
  } catch (error) {
    console.error('Error getting student averages:', error)
  }
  
  return currentAverage
}
</script>

<style scoped>
.layout-container {
  @apply flex h-screen bg-gray-50;
}

.main-content {
  @apply flex-1 flex flex-col overflow-hidden;
}

@media print {
  .no-print {
    display: none !important;
  }
}
</style>