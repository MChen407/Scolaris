<template>
  <BaseModal :show="show" :title="title" @close="$emit('close')" :show-footer="false">
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Titre du document</label>
          <input v-model="pdfConfig.title" type="text" class="input-field">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'école</label>
          <input v-model="pdfConfig.schoolName" type="text" class="input-field">
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Logo (optionnel)</label>
        <input @change="handleLogoUpload" type="file" accept="image/*" class="input-field">
      </div>
      
      <div class="flex justify-end gap-3 pt-4 border-t">
        <button @click="$emit('close')" class="btn-secondary">Annuler</button>
        <button @click="generatePDF" :disabled="generating" class="btn-primary">
          <i v-if="generating" class="fas fa-spinner fa-spin mr-2"></i>
          Générer PDF
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  show: Boolean,
  title: String,
  data: Array,
  columns: Array,
  type: String
})

const emit = defineEmits(['close'])

const generating = ref(false)
const pdfConfig = ref({
  title: props.title || 'Document',
  schoolName: 'ÉTABLISSEMENT SCOLAIRE',
  logoUrl: ''
})

function handleLogoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      pdfConfig.value.logoUrl = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

async function generatePDF() {
  generating.value = true
  try {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    // En-tête
    doc.setFontSize(18)
    doc.text(pdfConfig.value.schoolName, 105, 20, { align: 'center' })
    doc.setFontSize(14)
    doc.text(pdfConfig.value.title, 105, 35, { align: 'center' })
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 105, 45, { align: 'center' })
    
    // Logo si présent
    if (pdfConfig.value.logoUrl) {
      doc.addImage(pdfConfig.value.logoUrl, 'JPEG', 15, 15, 25, 25)
    }
    
    let yPosition = 60
    
    // En-têtes de colonnes
    doc.setFontSize(10)
    let xPosition = 15
    props.columns.forEach(col => {
      doc.text(col.label, xPosition, yPosition)
      xPosition += 35
    })
    
    yPosition += 10
    doc.line(15, yPosition, 195, yPosition)
    yPosition += 5
    
    // Données
    props.data.forEach(item => {
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }
      
      xPosition = 15
      props.columns.forEach(col => {
        const value = getNestedValue(item, col.key) || '-'
        doc.text(String(value).substring(0, 15), xPosition, yPosition)
        xPosition += 35
      })
      yPosition += 8
    })
    
    doc.save(`${pdfConfig.value.title.replace(/\s+/g, '_')}.pdf`)
    emit('close')
  } catch (error) {
    console.error('Erreur PDF:', error)
    alert('Erreur lors de la génération du PDF')
  } finally {
    generating.value = false
  }
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((o, p) => o && o[p], obj)
}
</script>