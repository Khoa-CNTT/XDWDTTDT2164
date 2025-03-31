"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Salaries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Salaries.hasMany(models.Jobs, {
        sourceKey: "id",
        foreignKey: "salaryId",
        as: "Jobs",
      });
    }
  }
  Salaries.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      salaryName: {
        type: DataTypes.STRING,
        field: "salary_name",
      },
      salarySlug: {
        type: DataTypes.STRING,
        field: "salary_slug",
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
      modelName: "Salaries",
      tableName: "salaries",
      timestamps: true,
      underscored: true,
    }
  );
  return Salaries;
};
