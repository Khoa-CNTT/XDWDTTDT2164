"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EmployerUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EmployerUsers.belongsTo(models.Employers, {
        foreignKey: "employerId",
        targetKey: "id",
        as: "Employers",
        onDelete: "CASCADE",
      });

      EmployerUsers.belongsTo(models.Users, {
        foreignKey: "userId",
        targetKey: "id",
        as: "Users",
        onDelete: "CASCADE",
      });
    }
  }
  EmployerUsers.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      employerId: {
        type: DataTypes.UUID,
        field: "employer_id",
      },
      userId: {
        type: DataTypes.UUID,
        field: "user_id",
      },
      employerRole: {
        type: DataTypes.ENUM("owner", "recruiter"),
        field: "employer_role",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_active",
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
      modelName: "EmployerUsers",
      tableName: "employer_users",
      timestamps: true,
      underscored: true,
    }
  );
  return EmployerUsers;
};
