"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Attribute extends Model {
    static associate(models) {
      // Each attribute belongs to a category
      Attribute.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });

      // An attribute has many product attribute values
      Attribute.hasMany(models.ProductAttributeValue, {
        foreignKey: "attributeId",
        as: "values",
      });
    }
  }

  Attribute.init(
    {
      name: DataTypes.STRING,
      dataType: DataTypes.STRING, // e.g., string, number, boolean
      categoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Attribute",
    }
  );

  return Attribute;
};
