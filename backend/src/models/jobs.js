"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Jobs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Jobs.belongsTo(models.Categories, {
        foreignKey: "categoryId",
        targetKey: "id",
        as: "Categories",
        onDelete: "SET NULL",
      });

      Jobs.belongsTo(models.JobTypes, {
        foreignKey: "jobTypeId",
        targetKey: "id",
        as: "JobTypes",
        onDelete: "SET NULL",
      });

      Jobs.belongsTo(models.Salaries, {
        foreignKey: "salaryId",
        targetKey: "id",
        as: "Salaries",
        onDelete: "SET NULL",
      });

      Jobs.belongsTo(models.Experiences, {
        foreignKey: "experienceId",
        targetKey: "id",
        as: "Experiences",
        onDelete: "SET NULL",
      });

      Jobs.belongsTo(models.Ranks, {
        foreignKey: "rankId",
        targetKey: "id",
        as: "Ranks",
        onDelete: "SET NULL",
      });

      Jobs.belongsTo(models.Employers, {
        foreignKey: "employerId",
        targetKey: "id",
        as: "Employers",
        onDelete: "CASCADE",
      });

      Jobs.belongsTo(models.Users, {
        foreignKey: "userId",
        targetKey: "id",
        as: "Users",
        onDelete: "SET NULL",
      });

      Jobs.hasMany(models.JobSkills, {
        sourceKey: "id",
        foreignKey: "jobId",
        as: "JobSkills",
      });

      Jobs.hasMany(models.SaveJobs, {
        sourceKey: "id",
        foreignKey: "jobId",
        as: "SaveJobs",
      });

      Jobs.hasMany(models.Payments, {
        sourceKey: "id",
        foreignKey: "jobId",
        as: "Payments",
      });
    }
  }
  Jobs.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      jobName: {
        type: DataTypes.STRING,
        field: "job_name",
      },
      jobSlug: {
        type: DataTypes.STRING,
        field: "job_slug",
      },
      description: {
        type: DataTypes.TEXT,
      },
      candidateRequirements: {
        type: DataTypes.TEXT,
        field: "candidate_requirements",
      },
      benefit: {
        type: DataTypes.TEXT,
      },
      workTime: {
        type: DataTypes.TEXT,
        field: "work_time",
      },
      categoryId: {
        type: DataTypes.UUID,
        field: "category_id",
      },
      jobTypeId: {
        type: DataTypes.UUID,
        field: "job_type_id",
      },
      salaryId: {
        type: DataTypes.UUID,
        field: "salary_id",
      },
      experienceId: {
        type: DataTypes.UUID,
        field: "experience_id",
      },
      employerId: {
        type: DataTypes.UUID,
        field: "employer_id",
      },
      userId: {
        type: DataTypes.UUID,
        field: "user_id",
      },
      numberOfRecruits: {
        type: DataTypes.INTEGER,
        field: "number_of_recruits",
      },
      rankId: {
        type: DataTypes.UUID,
        field: "rank_id",
      },
      expire: {
        type: DataTypes.DATE,
      },
      isExpired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_expired",
      },
      address: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
      },
      applyCount: {
        type: DataTypes.INTEGER,
        field: "apply_count",
      },
      isVisible: {
        type: DataTypes.BOOLEAN,
        field: "is_visible",
      },
      isApproved: {
        type: DataTypes.ENUM(
          "Chờ kiểm duyệt",
          "Đã được duyệt",
          "Đã bị từ chối"
        ),
        field: "is_approved",
      },
      rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "rejection_reason",
      },
      rejectionCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "rejection_count",
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: "deleted_at",
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
      },
    },
    {
      sequelize,
      modelName: "Jobs",
      tableName: "jobs",
      underscored: true,
      timestamps: true,
    }
  );
  return Jobs;
};
