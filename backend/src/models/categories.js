"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Categories.hasMany(models.Skills, {
        sourceKey: "id",
        foreignKey: "categoryId",
        as: "Skills",
      });

      Categories.hasMany(models.Jobs, {
        sourceKey: "id",
        foreignKey: "categoryId",
        as: "Jobs",
      });
    }
  }
  Categories.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      categoryName: {
        type: DataTypes.STRING,
        field: "category_name",
      },
      categorySlug: {
        type: DataTypes.STRING,
        field: "category_slug",
      },
      categoryImage: {
        type: DataTypes.STRING,
        field: "category_image",
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
      modelName: "Categories",
      tableName: "categories",
      timestamps: true,
      underscored: true,
    }
  );
  return Categories;
};
