"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("save_jobs", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        field: "user_id",
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "users",
          key: "id",
        },
      },
      jobId: {
        type: Sequelize.UUID,
        field: "job_id",
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "jobs",
          key: "id",
        },
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
    await queryInterface.dropTable("save_jobs");
  },
};
