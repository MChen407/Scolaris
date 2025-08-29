'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Classes', 'niveau', {
      type: Sequelize.ENUM('Primaire', 'Secondaire'),
      allowNull: false,
      defaultValue: 'Primaire'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Classes', 'niveau');
  }
};