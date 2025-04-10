"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payments.belongsTo(models.Users, {
        foreignKey: "userId",
        targetKey: "id",
        as: "Users",
        onDelete: "SET NULL",
      });

      Payments.belongsTo(models.Jobs, {
        foreignKey: "jobId",
        targetKey: "id",
        as: "Jobs",
        onDelete: "SET NULL",
      });
    }
  }
  Payments.init(
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
      jobId: {
        type: DataTypes.UUID,
        field: "job_id",
      },
      amount: {
        type: DataTypes.DECIMAL,
      },
      balanceBefore: {
        type: DataTypes.DECIMAL,
        field: "balance_before",
      },
      balanceAfter: {
        type: DataTypes.DECIMAL,
        field: "balance_after",
      },
      promotionAmount: {
        type: DataTypes.DECIMAL,
        field: "promotion_amount",
      },
      currency: {
        type: DataTypes.STRING,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        field: "payment_method",
      },
      status: {
        type: DataTypes.ENUM("Đang chờ", "Thành công", "Thấy bại"),
      },
      transactionId: {
        type: DataTypes.STRING,
        field: "transaction_id",
      },
      transactionType: {
        type: DataTypes.ENUM("Nạp tiền", "Hoàn tiền", "Thanh toán"),
        field: "transaction_type",
      },
      note: {
        type: DataTypes.STRING,
        field: "note",
      },
      paymentDate: {
        type: DataTypes.DATE,
        field: "payment_date",
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
      modelName: "Payments",
      tableName: "payments",
      timestamps: true,
      underscored: true,
    }
  );
  return Payments;
};
