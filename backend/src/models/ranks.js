"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ranks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ranks.hasMany(models.Jobs, {
        sourceKey: "id",
        foreignKey: "rankId",
        as: "Ranks",
      });
    }
  }
  Ranks.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      rankName: {
        type: DataTypes.STRING,
        field: "rank_name",
      },
      rankSlug: {
        type: DataTypes.STRING,
        field: "rank_slug",
      },
      deleted: {
        type: DataTypes.BOOLEAN,
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
      modelName: "Ranks",
      tableName: "ranks",
      timestamps: true,
      underscored: true,
    }
  );
  return Ranks;
};
