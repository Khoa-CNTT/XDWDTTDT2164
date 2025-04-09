"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "skills",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        skillName: {
          type: Sequelize.STRING(100),
          allowNull: false,
          field: "skill_name",
        },
        skillSlug: {
          type: Sequelize.STRING(100),
          allowNull: false,
          field: "skill_slug",
        },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE,
          field: "deleted_at",
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
      },
      {
        indexes: [{ fields: ["category_id"] }],
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("skills");
  },
};
