"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("employer_users", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      employerId: {
        type: Sequelize.UUID,
        field: "employer_id",
        onDelete: "CASCADE",
        references: {
          model: "employers",
          key: "id",
        },
      },
      userId: {
        type: Sequelize.UUID,
        field: "user_id",
        onDelete: "CASCADE",
        references: {
          model: "users",
          key: "id",
        },
      },
      employerRole: {
        type: Sequelize.ENUM("owner", "recruiter"),
        field: "employer_role",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        field: "is_active",
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable("employer_users");
  },
};
