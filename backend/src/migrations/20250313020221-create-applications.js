"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("applications", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      candidateId: {
        type: Sequelize.UUID,
        field: "candidate_id",
        allowNull: true,
        onDelete: "CASCADE",
        references: {
          model: "candidates",
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
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cvUpload: {
        type: Sequelize.STRING,
        field: "cv_upload",
        allowNull: true,
      },
      mathScore: {
        type: Sequelize.DECIMAL,
        field: "math_score",
        allowNull: true,
      },
      isSuitable: {
        type: Sequelize.ENUM("Phù hợp", "Chưa phù hợp", "Cần xem xét"),
        field: "is_suitable",
        allowNull: true,
      },
      coverLetter: {
        type: Sequelize.TEXT,
        field: "cover_letter",
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: "deleted_at",
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
    await queryInterface.dropTable("applications");
  },
};
