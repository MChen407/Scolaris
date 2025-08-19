'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Students', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      gender: {
        type: Sequelize.ENUM('M', 'F'),
        allowNull: true
      },
      birthDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      guardian: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      classId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Classes', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      enrollmentDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      enrollmentStatus: {
        type: Sequelize.ENUM('active', 'pending', 'suspended', 'graduated'),
        allowNull: true
      },
      documents: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {
          birthCertificate: false,
          medicalCertificate: false,
          photos: false,
          previousSchoolReport: false
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Students');
  }
};