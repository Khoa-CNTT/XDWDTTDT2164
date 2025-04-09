"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Experiences extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Experiences.hasMany(models.Jobs, {
        sourceKey: "id",
        foreignKey: "experienceId",
        as: "Jobs",
      });
    }
  }
  Experiences.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      experienceName: {
        type: DataTypes.STRING,
        field: "experience_name",
      },
      experienceSlug: {
        type: DataTypes.STRING,
        field: "experience_slug",
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
      modelName: "Experiences",
      tableName: "experiences",
      timestamps: true,
      underscored: true,
    }
  );
  return Experiences;
};
