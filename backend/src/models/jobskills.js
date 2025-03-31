"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JobSkills extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      JobSkills.belongsTo(models.Jobs, {
        foreignKey: "jobId",
        targetKey: "id",
        as: "Jobs",
        onDelete: "CASCADE",
      });

      JobSkills.belongsTo(models.Skills, {
        foreignKey: "skillId",
        targetKey: "id",
        as: "Skills",
        onDelete: "CASCADE",
      });
    }
  }
  JobSkills.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      jobId: {
        type: DataTypes.UUID,
        field: "job_id",
      },
      skillId: {
        type: DataTypes.UUID,
        field: "skill_id",
      },
      deleted: {
        type: DataTypes.BOOLEAN,
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
      modelName: "JobSkills",
      tableName: "job_skills",
      timestamps: true,
      underscored: true,
    }
  );
  return JobSkills;
};
