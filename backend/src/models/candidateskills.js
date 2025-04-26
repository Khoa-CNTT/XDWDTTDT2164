"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CandidateSkills extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CandidateSkills.belongsTo(models.Candidates, {
        foreignKey: "candidateId",
        targetKey: "id",
        as: "Candidates",
        onDelete: "CASCADE",
      });

      CandidateSkills.belongsTo(models.Skills, {
        foreignKey: "skillId",
        targetKey: "id",
        as: "Skills",
        onDelete: "CACSADE",
      });
    }
  }
  CandidateSkills.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      skillId: {
        type: DataTypes.UUID,
        field: "skill_id",
      },
      candidateId: {
        type: DataTypes.UUID,
        field: "candidate_id",
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
      modelName: "CandidateSkills",
      tableName: "candidate_skills",
      underscored: true,
      timestamps: true,
    }
  );
  return CandidateSkills;
};
