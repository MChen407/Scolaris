'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Supprimer les tables Roles et Users
    try {
      await queryInterface.dropTable('Users');
      console.log('Table Users supprimée');
    } catch (error) {
      console.log('Table Users not found');
    }
    
    try {
      await queryInterface.dropTable('Roles');
      console.log('Table Roles supprimée');
    } catch (error) {
      console.log('Table Roles not found');
    }
    
    try {
      await queryInterface.dropTable('ClassSubjects');
    } catch (error) {
      console.log('Table ClassSubjects not found');
    }
    
    try {
      await queryInterface.dropTable('TeacherSubjects');
    } catch (error) {
      console.log('Table TeacherSubjects not found');
    }
    
    try {
      await queryInterface.dropTable('TeacherClasses');
    } catch (error) {
      console.log('Table TeacherClasses not found');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Recréer les tables si besoin (optionnel)
    console.log('Cannot recreate dropped tables');
  }
};