// controllers/productController.js
const { Product, Category, ProductAttributeValue, Attribute } = require("../models");

// Get all products with category and attribute values
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: ProductAttributeValue,
          as: "attributeValues",
          include: [
            {
              model: Attribute,
              as: "attribute",
              attributes: ["id", "name", "dataType"],
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: ProductAttributeValue,
          as: "attributeValues",
          include: [
            {
              model: Attribute,
              as: "attribute",
              attributes: ["id", "name", "dataType"],
            },
          ],
        },
      ],
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new product with attribute values
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, attributeValues } = req.body;

    // Create the product
    const product = await Product.create({ name, description, price, categoryId });

    // Create attribute values if any
    if (attributeValues && attributeValues.length > 0) {
      const pavs = attributeValues.map((attr) => ({
        productId: product.id,
        attributeId: attr.attributeId,
        value: attr.value,
      }));
      await ProductAttributeValue.bulkCreate(pavs);
    }

    // Fetch product again including attributes
    const fullProduct = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        {
          model: ProductAttributeValue,
          as: "attributeValues",
          include: [{ model: Attribute, as: "attribute", attributes: ["id", "name", "dataType"] }],
        },
      ],
    });

    res.status(201).json(fullProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a product and its attribute values
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, attributeValues } = req.body;

    const product = await Product.findByPk(req.params.id, {
      include: [{ model: ProductAttributeValue, as: "attributeValues" }],
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update product fields
    await product.update({ name, description, price, categoryId });

    // Update attribute values
    if (attributeValues && attributeValues.length > 0) {
      for (const attr of attributeValues) {
        const existing = await ProductAttributeValue.findOne({
          where: { productId: product.id, attributeId: attr.attributeId },
        });
        if (existing) {
          await existing.update({ value: attr.value });
        } else {
          await ProductAttributeValue.create({
            productId: product.id,
            attributeId: attr.attributeId,
            value: attr.value,
          });
        }
      }
    }

    // Fetch updated product
    const fullProduct = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        {
          model: ProductAttributeValue,
          as: "attributeValues",
          include: [{ model: Attribute, as: "attribute", attributes: ["id", "name", "dataType"] }],
        },
      ],
    });

    res.json(fullProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
