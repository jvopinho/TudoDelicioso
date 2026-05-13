'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('recipes', 'instructions')
    await queryInterface.addColumn('recipes', 'instructions', {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      allowNull: false,
      defaultValue: [],
    })
    await queryInterface.addColumn('recipes', 'thumbnail', {
      type: Sequelize.STRING,
      allowNull: true,
    })
    await queryInterface.addColumn('recipes', 'prepTime', {
      type: Sequelize.INTEGER,
      allowNull: true,
    })
    await queryInterface.addColumn('recipes', 'ingredients', {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      allowNull: false,
      defaultValue: [],
    })
    await queryInterface.addColumn('recipes', 'servings', {
      type: Sequelize.INTEGER,
      allowNull: true,
    })
    await queryInterface.addColumn('recipes', 'tip', {
      type: Sequelize.STRING,
      allowNull: true,
    })
    await queryInterface.addColumn('recipes', 'difficulty', {
      type: Sequelize.ENUM('EASY', 'MEDIUM', 'HARD'),
      allowNull: true,
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
