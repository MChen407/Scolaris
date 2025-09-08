'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Désactiver les contraintes FK temporairement
    await queryInterface.sequelize.query('PRAGMA foreign_keys = OFF;');
    
    try {
      // Classes
      await queryInterface.changeColumn('Classes', 'section', {
        type: Sequelize.STRING,
        allowNull: true
      });
      
      // Students - Ajouter les colonnes manquantes d'abord
      try {
        await queryInterface.addColumn('Students', 'address', {
          type: Sequelize.TEXT,
          allowNull: true
        });
      } catch (e) {
        // Colonne existe déjà, la modifier
        await queryInterface.changeColumn('Students', 'address', {
          type: Sequelize.TEXT,
          allowNull: true
        });
      }
      
      try {
        await queryInterface.addColumn('Students', 'parentName', {
          type: Sequelize.STRING,
          allowNull: true
        });
      } catch (e) {
        await queryInterface.changeColumn('Students', 'parentName', {
          type: Sequelize.STRING,
          allowNull: true
        });
      }
      
      try {
        await queryInterface.addColumn('Students', 'parentPhone', {
          type: Sequelize.STRING,
          allowNull: true
        });
      } catch (e) {
        await queryInterface.changeColumn('Students', 'parentPhone', {
          type: Sequelize.STRING,
          allowNull: true
        });
      }
      
      await queryInterface.changeColumn('Students', 'phone', {
        type: Sequelize.STRING,
        allowNull: true
      });
      
      // Teachers - Ajouter les colonnes manquantes
      try {
        await queryInterface.addColumn('Teachers', 'address', {
          type: Sequelize.TEXT,
          allowNull: true
        });
      } catch (e) {
        await queryInterface.changeColumn('Teachers', 'address', {
          type: Sequelize.TEXT,
          allowNull: true
        });
      }
      
      try {
        await queryInterface.addColumn('Teachers', 'specialization', {
          type: Sequelize.STRING,
          allowNull: true
        });
      } catch (e) {
        await queryInterface.changeColumn('Teachers', 'specialization', {
          type: Sequelize.STRING,
          allowNull: true
        });
      }
      
      await queryInterface.changeColumn('Teachers', 'phone', {
        type: Sequelize.STRING,
        allowNull: true
      });
      
    } finally {
      // Réactiver les contraintes FK
      await queryInterface.sequelize.query('PRAGMA foreign_keys = ON;');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes if needed
  }
};