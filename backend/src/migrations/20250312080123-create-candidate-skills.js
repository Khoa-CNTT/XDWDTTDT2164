"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("candidate_skills", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      candidateId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "candidate_id",
        references: {
          model: "candidates",
          key: "id",
        },
      },
      skillId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "skill_id",
        references: {
          model: "skills",
          key: "id",
        },
      },
      categoryId: {
        type: Sequelize.UUID,
        field: "category_id",
        allowNull: true,
        onDelete: "SET NULL",
        references: {
          model: "categories",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "created_at",
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "updated_at",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("candidate_skills");
  },
};
