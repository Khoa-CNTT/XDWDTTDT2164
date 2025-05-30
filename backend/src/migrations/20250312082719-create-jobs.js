"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "jobs",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        jobName: {
          type: Sequelize.STRING,
          allowNull: false,
          field: "job_name",
        },
        jobSlug: {
          type: Sequelize.STRING,
          allowNull: false,
          field: "job_slug",
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        categoryId: {
          type: Sequelize.UUID,
          field: "category_id",
          onDelete: "SET NULL",
          allowNull: true,
          references: {
            model: "categories",
            key: "id",
          },
        },
        jobTypeId: {
          type: Sequelize.UUID,
          field: "job_type_id",
          onDelete: "SET NULL",
          allowNull: true,
          references: {
            model: "job_types",
            key: "id",
          },
        },
        salaryId: {
          type: Sequelize.UUID,
          field: "salary_id",
          onDelete: "SET NULL",
          allowNull: true,
          references: {
            model: "salaries",
            key: "id",
          },
        },
        experienceId: {
          type: Sequelize.UUID,
          field: "experience_id",
          onDelete: "SET NULL",
          allowNull: true,
          references: {
            model: "experiences",
            key: "id",
          },
        },
        employerId: {
          type: Sequelize.UUID,
          field: "employer_id",
          allowNull: false,
          onDelete: "CASCADE",
          references: {
            model: "employers",
            key: "id",
          },
        },
        userId: {
          type: Sequelize.UUID,
          field: "user_id",
          allowNull: true,
          onDelete: "SET NULL",
          references: {
            model: "users",
            key: "id",
          },
        },
        rankId: {
          type: Sequelize.UUID,
          allowNull: true,
          field: "rank_id",
          onDelete: "SET NULL",
          references: {
            model: "ranks",
            key: "id",
          },
        },
        expire: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        address: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        status: {
          type: Sequelize.STRING,
        },
        applyCount: {
          type: Sequelize.INTEGER,
          allowNull: true,
          field: "apply_count",
        },
        isVisible: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          field: "is_visible",
        },
        numberOfRecruits: {
          type: Sequelize.INTEGER,
          field: "number_of_recruits",
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
      },
      {
        indexes: [
          { fields: ["job_name"] },
          { fields: ["job_slug"], unique: true },
        ],
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("jobs");
  },
};
