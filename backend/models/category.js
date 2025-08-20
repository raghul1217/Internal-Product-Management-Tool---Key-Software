"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // A category has many attributes
      Category.hasMany(models.Attribute, {
        foreignKey: "categoryId",
        as: "attributes",
        onDelete: "CASCADE"
      });

      // A category has many products
      Category.hasMany(models.Product, {
        foreignKey: "categoryId",
        as: "products",
        onDelete: "CASCADE"
      });
    }
  }

  Category.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Category",
    }
  );

  return Category;
};
