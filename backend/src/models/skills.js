"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Skills extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Skills.belongsTo(models.Categories, {
        foreignKey: "categoryId",
        targetKey: "id",
        as: "Categories",
        onDelete: "SET NULL",
      });

      Skills.hasMany(models.JobSkills, {
        sourceKey: "id",
        foreignKey: "skillId",
        as: "JobSkills",
      });

      Skills.hasMany(models.CandidateSkills, {
        sourceKey: "id",
        foreignKey: "skillId",
        as: "CandidateSkills",
      });
    }
  }
  Skills.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      skillName: {
        type: DataTypes.STRING,
        field: "skill_name",
      },
      skillSlug: {
        type: DataTypes.STRING,
        field: "skill_slug",
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      categoryId: {
        type: DataTypes.UUID,
        field: "category_id",
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
      modelName: "Skills",
      tableName: "skills",
      timestamps: true,
      underscored: true,
    }
  );
  return Skills;
};
