"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasOne(models.Candidates, {
        sourceKey: "id",
        foreignKey: "userId",
        as: "Candidates",
      });

      Users.hasMany(models.EmployerUsers, {
        sourceKey: "id",
        foreignKey: "userId",
        as: "EmployerUsers",
      });

      Users.hasMany(models.Jobs, {
        sourceKey: "id",
        foreignKey: "userId",
        as: "Jobs",
      });

      Users.hasMany(models.SaveJobs, {
        sourceKey: "id",
        foreignKey: "userId",
        as: "SaveJobs",
      });

      Users.hasMany(models.Payments, {
        sourceKey: "id",
        foreignKey: "userId",
        as: "Payments",
      });

      Users.hasMany(models.Notifications, {
        sourceKey: "id",
        foreignKey: "userId",
        as: "Notifications",
      });

      Users.hasOne(models.Wallets, {
        sourceKey: "id",
        foreignKey: "userId",
        as: "Wallets",
      });
    }
  }
  Users.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      fullName: {
        type: DataTypes.STRING,
        field: "full_name",
      },
      email: DataTypes.STRING,
      phoneNumber: {
        type: DataTypes.STRING,
        field: "phone_number",
      },
      password: DataTypes.STRING,
      emailVerify: {
        type: DataTypes.BOOLEAN,
        field: "email_verify",
      },
      otp: DataTypes.STRING,
      otpExpire: {
        type: DataTypes.DATE,
        field: "otp_expire",
      },
      refreshToken: {
        type: DataTypes.STRING,
        field: "refresh_token",
      },
      passwordResetToken: {
        type: DataTypes.STRING,
        field: "password_reset_token",
      },
      passwordResetExpire: {
        type: DataTypes.DATE,
        field: "password_reset_expire",
      },
      role: DataTypes.ENUM("admin", "candidate", "employer"),
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
      modelName: "Users",
      tableName: "users",
      timestamps: true,
      underscored: true,
    }
  );
  return Users;
};
