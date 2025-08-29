'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Teachers', 'niveau', {
      type: Sequelize.ENUM('Primaire', 'Secondaire'),
      allowNull: true,
      defaultValue: 'Primaire'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Teachers', 'niveau');
  }
};