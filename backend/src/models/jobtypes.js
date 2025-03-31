"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JobTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      JobTypes.hasMany(models.Jobs, {
        sourceKey: "id",
        foreignKey: "jobTypeId",
        as: "Jobs",
      });
    }
  }
  JobTypes.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      jobTypeName: {
        type: DataTypes.STRING,
        field: "job_type_name",
      },
      jobTypeSlug: {
        type: DataTypes.STRING,
        field: "job_type_slug",
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      modelName: "JobTypes",
      tableName: "job_types",
      timestamps: true,
      underscored: true,
    }
  );
  return JobTypes;
};
