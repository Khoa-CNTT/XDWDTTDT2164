"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Employers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employers.belongsTo(models.Users, {
        sourceKey: "id",
        foreignKey: "userId",
        as: "Users",
        onDelete: "CASCADE",
      });
    }
  }
  Employers.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      companyName: {
        type: DataTypes.STRING,
        field: "company_name",
      },
      companySlug: {
        type: DataTypes.STRING,
        field: "company_slug",
      },
      companyAddress: {
        type: DataTypes.STRING,
        field: "company_address",
      },
      companyWebsite: {
        type: DataTypes.STRING,
        field: "company_website",
      },
      companyLogo: {
        type: DataTypes.STRING,
        field: "company_logo",
      },
      companyDescription: {
        type: DataTypes.TEXT,
        field: "company_description",
      },
      companySize: {
        type: DataTypes.INTEGER,
        field: "company_size",
      },
      companyTaxCode: {
        type: DataTypes.STRING,
        field: "company_tax_code",
      },
      isApproved: {
        type: DataTypes.ENUM("Chờ kiểm duyệt", "Đã kiểm duyệt", "Đã từ chối"),
        defaultValue: "Chờ kiểm duyệt",
        field: "is_approved",
      },
      industry: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.UUID,
        field: "user_id",
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
      modelName: "Employers",
      tableName: "employers",
      timestamps: true,
      underscored: true,
    }
  );
  return Employers;
};
