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
    
    await queryInterface.createTable('user_skill', {
      ...dateColumns,
      skillId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'skills',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      level: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    })

    await queryInterface.addConstraint('user_skill', {
      fields: ['skillId', 'userId'],
      type: 'primary key',
      name: 'user_skill_pkey',
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
