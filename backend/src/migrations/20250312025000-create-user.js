"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "users",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        fullName: {
          type: Sequelize.STRING(100),
          allowNull: false,
          field: "full_name",
        },
        email: {
          type: Sequelize.STRING(100),
          unique: true,
          allowNull: false,
        },
        phoneNumber: {
          type: Sequelize.STRING(10),
          allowNull: false,
          field: "phone_number",
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        emailVerify: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          field: "email_verify",
        },
        otp: {
          allowNull: true,
          type: Sequelize.STRING(255),
        },
        otpExpire: {
          allowNull: true,
          type: Sequelize.DATE,
          field: "otp_expire",
        },
        refreshToken: {
          allowNull: true,
          type: Sequelize.STRING(300),
          field: "refresh_token",
        },
        passwordResetToken: {
          allowNull: true,
          type: Sequelize.STRING,
          field: "password_reset_token",
        },
        passwordResetExpire: {
          allowNull: true,
          type: Sequelize.DATE,
          field: "password_reset_expire",
        },
        role: {
          allowNull: true,
          type: Sequelize.ENUM("admin", "candidate", "employer"),
        },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE,
          field: "deleted_at",
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          field: "created_at",
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          field: "updated_at",
        },
      },
      {
        indexes: [
          { fields: ["email"], unique: true },
          { fields: ["phone_number"], unique: true },
        ],
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
