"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SaveJobs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SaveJobs.belongsTo(models.Users, {
        foreignKey: "userId",
        targetKey: "id",
        as: "Users",
        onDelete: "CASCADE",
      });

      SaveJobs.belongsTo(models.Jobs, {
        foreignKey: "jobId",
        targetKey: "id",
        as: "Jobs",
        onDelete: "CASCADE",
      });
    }
  }
  SaveJobs.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        field: "user_id",
      },
      jobId: {
        type: DataTypes.UUID,
        field: "job_id",
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
      modelName: "SaveJobs",
      tableName: "save_jobs",
      timestamps: true,
      underscored: true,
    }
  );
  return SaveJobs;
};
