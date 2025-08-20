"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert Categories
    await queryInterface.bulkInsert("Categories", [
      { name: "Electronics", createdAt: new Date(), updatedAt: new Date() },
      { name: "Clothing", createdAt: new Date(), updatedAt: new Date() },
      { name: "Books", createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Fetch inserted Categories
    const categories = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Categories";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const electronics = categories.find((c) => c.name === "Electronics").id;
    const clothing = categories.find((c) => c.name === "Clothing").id;
    const books = categories.find((c) => c.name === "Books").id;

    // Insert Products with dynamic categoryId
    await queryInterface.bulkInsert("Products", [
      {
        name: "Smartphone",
        price: 699.99,
        description: "Latest model smartphone",
        categoryId: electronics,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "T-Shirt",
        price: 19.99,
        description: "Cotton T-Shirt",
        categoryId: clothing,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Novel Book",
        price: 9.99,
        description: "Best-selling novel",
        categoryId: books,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Fetch inserted Products
    const products = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Products";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const smartphone = products.find((p) => p.name === "Smartphone").id;
    const tshirt = products.find((p) => p.name === "T-Shirt").id;
    const novel = products.find((p) => p.name === "Novel Book").id;

    // Insert Attributes with dynamic categoryId
    await queryInterface.bulkInsert("Attributes", [
      {
        name: "Color",
        dataType: "string",
        categoryId: clothing,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Size",
        dataType: "string",
        categoryId: clothing,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Brand",
        dataType: "string",
        categoryId: electronics,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Fetch inserted Attributes
    const attributes = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Attributes";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const color = attributes.find((a) => a.name === "Color").id;
    const size = attributes.find((a) => a.name === "Size").id;
    const brand = attributes.find((a) => a.name === "Brand").id;

    // Insert ProductAttributeValues dynamically
    await queryInterface.bulkInsert("ProductAttributeValues", [
      {
        productId: smartphone,
        attributeId: brand,
        value: "Apple",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: tshirt,
        attributeId: color,
        value: "Red",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: tshirt,
        attributeId: size,
        value: "M",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ProductAttributeValues", null, {});
    await queryInterface.bulkDelete("Attributes", null, {});
    await queryInterface.bulkDelete("Products", null, {});
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
