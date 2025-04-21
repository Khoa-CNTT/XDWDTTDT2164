"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Applications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Applications.belongsTo(models.Candidates, {
        foreignKey: "candidateId",
        targetKey: "id",
        as: "Candidates",
      });

      Applications.belongsTo(models.Jobs, {
        foreignKey: "jobId",
        targetKey: "id",
        as: "Jobs",
      });
    }
  }
  Applications.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      candidateId: {
        type: DataTypes.UUID,
        field: "candidate_id",
      },
      jobId: {
        type: DataTypes.UUID,
        field: "job_id",
      },
      status: {
        type: DataTypes.STRING,
      },
      cvUpload: {
        type: DataTypes.STRING,
        field: "cv_upload",
      },
      matchScore: {
        type: DataTypes.DECIMAL,
        field: "match_score",
      },
      isSuitable: {
        type: DataTypes.ENUM("Phù hợp", "Chưa phù hợp", "Cần xem xét"),
        field: "is_suitable",
      },
      coverLetter: {
        type: DataTypes.TEXT,
        field: "cover_letter",
      },
      moderatorReview: {
        type: DataTypes.TEXT,
        field: "moderator_review",
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
      modelName: "Applications",
      tableName: "applications",
      timestamps: true,
      underscored: true,
    }
  );
  return Applications;
};
