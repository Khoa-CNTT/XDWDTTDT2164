"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payments", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        field: "user_id",
        allowNull: true,
        onDelete: "SET NULL",
        references: {
          model: "users",
          key: "id",
        },
      },
      jobId: {
        type: Sequelize.UUID,
        field: "job_id",
        allowNull: true,
        onDelete: "SET NULL",
        references: {
          model: "jobs",
          key: "id",
        },
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      balanceBefore: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      balanceAfter: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      isDeposit: {
        type: Sequelize.BOOLEAN,
      },
      currency: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      paymentMethod: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("Đang chờ", "Thành công", "Thấy bại"),
        defaultValue: "Đang chờ",
      },
      transactionId: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      paymentDate: {
        type: Sequelize.DATE,
        field: "payment_date",
      },
      deleted: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "created_at",
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "created_at",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("payments");
  },
};
