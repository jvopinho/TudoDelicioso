'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const dateColumns = {
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    }

    await queryInterface.addColumn('categories', 'color', {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: '#7ba4b8',
    })

    await queryInterface.addColumn('categories', 'slug', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    })

    await queryInterface.createTable('comments', {
      ...dateColumns,
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      authorId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      recipeId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'recipes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
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
