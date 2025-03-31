"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("candidates", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
      gender: Sequelize.STRING(10),
      dateOfBirth: {
        type: Sequelize.DATE,
        field: "date_of_birth",
      },
      address: Sequelize.STRING(255),
      cvUrl: {
        type: Sequelize.STRING(355),
        field: "cv_url",
      },
      workExperience: {
        type: Sequelize.STRING(100),
        field: "work_experience",
      },
      salary: Sequelize.STRING(100),
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
    await queryInterface.dropTable("candidates");
  },
};
