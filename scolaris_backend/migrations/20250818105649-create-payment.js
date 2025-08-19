'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Students',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      feeTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'FeeTypes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      method: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('completed', 'pending', 'cancelled'),
        allowNull: false
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
    await queryInterface.dropTable('Payments');
  }
};