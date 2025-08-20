"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductAttributeValue extends Model {
    static associate(models) {
      // Belongs to Product
      ProductAttributeValue.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });

      // Belongs to Attribute
      ProductAttributeValue.belongsTo(models.Attribute, {
        foreignKey: "attributeId",
        as: "attribute",
      });
    }
  }

  ProductAttributeValue.init(
    {
      productId: DataTypes.INTEGER,
      attributeId: DataTypes.INTEGER,
      value: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProductAttributeValue",
    }
  );

  return ProductAttributeValue;
};
