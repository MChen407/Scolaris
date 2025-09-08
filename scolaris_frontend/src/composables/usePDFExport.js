import { ref } from 'vue'

export function usePDFExport() {
  const isExporting = ref(false)
  
  // Récupérer la configuration de l'établissement connecté
  const getSchoolConfig = () => {
    const schoolId = localStorage.getItem('current_school_id')
    if (schoolId) {
      const saved = localStorage.getItem(`schoolConfig_${schoolId}`)
      if (saved) {
        const config = JSON.parse(saved)
        return {
          schoolName: config.name || 'ETABLISSEMENT SCOLAIRE',
          address: config.address || 'Adresse de l\'ecole',
          phone: config.phone || 'Telephone',
          logoUrl: config.logo || ''
        }
      }
    }
    return {
      schoolName: 'ETABLISSEMENT SCOLAIRE',
      address: 'Adresse de l\'ecole',
      phone: 'Telephone',
      logoUrl: ''
    }
  }

  async function exportToPDF(data, title, columns, filename, schoolInfo = null) {
    isExporting.value = true
    try {
      const { jsPDF } = await import('jspdf')
      // Importez la fonction autoTable de jspdf-autotable
      const autoTable = await import('jspdf-autotable')
      const doc = new jsPDF()
      
      // Utiliser les informations de l'école passées en paramètre ou la config par défaut
      const finalConfig = schoolInfo || getSchoolConfig()

      // --- En-tête du document (inchangé) ---
      doc.setFillColor(41, 128, 185)
      doc.rect(0, 0, 210, 50, 'F')
      
      if (finalConfig.logo) {
        doc.addImage(finalConfig.logo, 'JPEG', 15, 10, 30, 30)
      }
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text(finalConfig.name || finalConfig.schoolName || 'ÉTABLISSEMENT SCOLAIRE', 105, 20, { align: 'center' })
      
      doc.setFontSize(10)
      if (finalConfig.address) {
        doc.text(finalConfig.address, 105, 30, { align: 'center' })
      }
      if (finalConfig.phone) {
        doc.text('Tél: ' + finalConfig.phone, 105, 37, { align: 'center' })
      }
      if (finalConfig.email) {
        doc.text('Email: ' + finalConfig.email, 105, 44, { align: 'center' })
      }
      
      // Titre du document
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(title, 105, 45, { align: 'center' })

      // --- Informations générales (inchangées) ---
      doc.setFontSize(10)
      doc.text('Généré le: ' + new Date().toLocaleDateString('fr-FR'), 20, 65)
      doc.text('Total: ' + data.length + ' éléments', 150, 65)

      // --- Utilisation de jspdf-autotable ---
      const tableHeaders = columns.map(col => col.label)
      const tableData = data.map(item => {
        return columns.map(col => {
          let value = col.key.split('.').reduce((obj, key) => obj?.[key], item) || ''
          if (col.key === 'gender') {
            return value === 'M' ? 'Masculin' : 'Féminin'
          }
          if (col.key === 'amount') {
            return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
          }
          return String(value)
        })
      })

      // Configuration des largeurs de colonnes
      const columnStyles = {}
      columns.forEach((col, index) => {
        if (col.key === 'amount') {
          columnStyles[index] = { cellWidth: 25, halign: 'right' }
        } else if (col.key === 'method') {
          columnStyles[index] = { cellWidth: 30 }
        } else if (col.key === 'subjects' || col.key.includes('subject')) {
          columnStyles[index] = { cellWidth: 'auto' }
        } else {
          columnStyles[index] = { cellWidth: 'auto' }
        }
      })

      doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        startY: 75,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak',
          cellWidth: 'wrap'
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        },
        columnStyles: columnStyles,
        margin: { top: 70, left: 15, right: 15, bottom: 20 },
        tableWidth: 'auto'
      })

      doc.save(filename + '.pdf')
    } catch (error) {
      console.error('Erreur export PDF:', error)
    } finally {
      isExporting.value = false
    }
  }

  function updateConfig(newConfig) {
    // Cette fonction peut être utilisée pour des configurations temporaires
    // La configuration principale vient maintenant de localStorage
  }

  return {
    isExporting,
    exportToPDF,
    updateConfig
  }
}