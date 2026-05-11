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

    await queryInterface.createTable('users', {
      ...dateColumns,
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      role: {
        type: Sequelize.ENUM('ADMIN', 'STUDENT'),
        allowNull: false,
        defaultValue: 'STUDENT',
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    })

    await queryInterface.createTable('recipes', {
      ...dateColumns,
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      instructions: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      externalUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    })

    await queryInterface.createTable('user_recipes', {
      ...dateColumns,
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      recipeId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'recipes',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    })

    await queryInterface.addConstraint('user_recipes', {
      fields: ['userId', 'recipeId'],
      type: 'primary key',
      name: 'user_recipes_pkey',
    })

    await queryInterface.createTable('categories', {
      ...dateColumns,
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    })

    await queryInterface.createTable('recipe_categories', {
      ...dateColumns,
      recipeId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'recipes',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      categoryId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    })

    await queryInterface.addConstraint('recipe_categories', {
      fields: ['recipeId', 'categoryId'],
      type: 'primary key',
      name: 'recipe_categories_pkey',
    })
  },

  async down (queryInterface, Sequelize) {},
}
