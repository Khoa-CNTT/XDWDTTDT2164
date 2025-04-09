"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Candidates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Candidates.belongsTo(models.Users, {
        foreignKey: "userId",
        targetKey: "id",
        as: "Users",
        onDelete: "CASCADE",
      });

      Candidates.hasMany(models.CandidateSkills, {
        sourceKey: "id",
        foreignKey: "candidateId",
        as: "CandidateSkills",
      });
    }
  }
  Candidates.init(
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
      gender: DataTypes.STRING,
      dateOfBirth: {
        type: DataTypes.DATE,
        field: "date_of_birth",
      },
      address: DataTypes.STRING,
      cvUrl: {
        type: DataTypes.STRING,
        field: "cv_url",
      },
      workExperience: {
        type: DataTypes.STRING,
        field: "work_experience",
      },
      salary: DataTypes.STRING,
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
      modelName: "Candidates",
      tableName: "candidates",
      timestamps: true,
      underscored: true,
    }
  );
  return Candidates;
};
