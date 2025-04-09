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
        field: "balance_before",
      },
      balanceAfter: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        field: "balance_after",
      },
      transactionType: {
        type: Sequelize.ENUM("Nạp tiền", "Hoàn tiền", "Thanh toán"),
        field: "transaction_type",
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      paymentMethod: {
        type: Sequelize.STRING(50),
        allowNull: true,
        field: "payment_method",
      },
      status: {
        type: Sequelize.ENUM("Đang chờ", "Thành công", "Thất bại"),
        defaultValue: "Đang chờ",
        allowNull: true,
      },
      transactionId: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: "transaction_id",
      },
      promotionAmount: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        field: "promotion_amount",
        defaultValue: 0,
      },
      paymentDate: {
        type: Sequelize.DATE,
        field: "payment_date",
      },
      note: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: "note",
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("payments");
  },
};
