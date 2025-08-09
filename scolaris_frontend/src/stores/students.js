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

export const useStudentsStore = defineStore('students', () => {
  /**
   * DONNÉES DES ÉLÈVES
   * 
   * Structure d'un élève :
   * - id : Identifiant unique
   * - firstName/lastName : Nom et prénom
   * - gender : Sexe (M/F)
   * - birthDate : Date de naissance
   * - guardian : Nom du tuteur/parent
   * - phone : Numéro de téléphone
   * - classId : ID de la classe assignée
   * - enrollmentDate : Date d'inscription
   * - enrollmentStatus : Statut (active, pending, suspended)
   * - documents : État des documents requis
   * - payments : Historique des paiements
   */
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
      enrollmentStatus: 'active',
      documents: {
        birthCertificate: true,
        medicalCertificate: true,
        photos: true,
        previousSchoolReport: false
      },
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
      enrollmentStatus: 'pending',
      documents: {
        birthCertificate: true,
        medicalCertificate: false,
        photos: true,
        previousSchoolReport: true
      },
      payments: [
        { id: 3, amount: 50000, date: '2023-09-01', type: 'Inscription' }
      ]
    },
    // ... Autres élèves de démonstration
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
      enrollmentStatus: 'pending',
      documents: {
        birthCertificate: true,
        medicalCertificate: false,
        photos: true,
        previousSchoolReport: true
      },
      payments: []
    },
    // ... (Données de démonstration supplémentaires)
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
      enrollmentStatus: 'pending',
      documents: {
        birthCertificate: true,
        medicalCertificate: false,
        photos: true,
        previousSchoolReport: true
      },
      payments: []
    }
    // ... Plus d'élèves pour la démonstration
  ])
  
  // Compteur pour générer des IDs uniques pour les nouveaux élèves
  const nextId = ref(25)

  /**
   * PROPRIÉTÉ CALCULÉE : ÉLÈVES PAR CLASSE
   * 
   * Groupe les élèves par classe pour faciliter l'affichage
   * et les statistiques par classe.
   */
  const studentsByClass = computed(() => {
    return students.value.reduce((acc, student) => {
      if (!acc[student.classId]) {
        acc[student.classId] = []
      }
      acc[student.classId].push(student)
      return acc
    }, {})
  })

  /**
   * AJOUTER UN NOUVEL ÉLÈVE
   * 
   * @param {Object} studentData - Données de l'élève à ajouter
   * @returns {Object} - L'élève créé avec son ID
   */
  function addStudent(studentData) {
    const student = {
      id: nextId.value++, // Attribution d'un ID unique
      enrollmentDate: new Date().toISOString().split('T')[0], // Date actuelle
      enrollmentStatus: 'pending', // Statut par défaut
      documents: {
        // Documents requis initialisés à false
        birthCertificate: false,
        medicalCertificate: false,
        photos: false,
        previousSchoolReport: false
      },
      payments: [], // Historique vide au début
      ...studentData // Fusion avec les données fournies
    }
    students.value.push(student)
    return student
  }

  /**
   * METTRE À JOUR UN ÉLÈVE
   * 
   * @param {number} id - ID de l'élève à modifier
   * @param {Object} studentData - Nouvelles données
   * @returns {Object|null} - L'élève modifié ou null si non trouvé
   */
  function updateStudent(id, studentData) {
    const index = students.value.findIndex(s => s.id === id)
    if (index !== -1) {
      // Fusion des nouvelles données avec les existantes
      students.value[index] = { ...students.value[index], ...studentData }
      return students.value[index]
    }
    return null
  }

  /**
   * SUPPRIMER UN ÉLÈVE
   * 
   * @param {number} id - ID de l'élève à supprimer
   * @returns {boolean} - True si supprimé, false si non trouvé
   */
  function deleteStudent(id) {
    const index = students.value.findIndex(s => s.id === id)
    if (index !== -1) {
      students.value.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * RÉCUPÉRER UN ÉLÈVE PAR ID
   * 
   * @param {number} id - ID de l'élève recherché
   * @returns {Object|undefined} - L'élève trouvé ou undefined
   */
  function getStudentById(id) {
    return students.value.find(s => s.id === id)
  }

  /**
   * RÉCUPÉRER LES ÉLÈVES D'UNE CLASSE
   * 
   * @param {number} classId - ID de la classe
   * @returns {Array} - Liste des élèves de la classe
   */
  function getStudentsByClass(classId) {
    return students.value.filter(s => s.classId === classId)
  }

  // EXPORT DES PROPRIÉTÉS ET MÉTHODES PUBLIQUES
  return {
    students, // Liste complète des élèves
    studentsByClass, // Élèves groupés par classe
    addStudent, // Ajouter un élève
    updateStudent, // Modifier un élève
    deleteStudent, // Supprimer un élève
    getStudentById, // Récupérer par ID
    getStudentsByClass // Récupérer par classe
  }
})