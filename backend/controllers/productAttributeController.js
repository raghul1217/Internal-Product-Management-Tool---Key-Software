const { ProductAttributeValue, Product, Attribute } = require("../models");

// Get all attribute values
exports.getAllAttributeValues = async (req, res) => {
  try {
    const values = await ProductAttributeValue.findAll({
      include: [
        { model: Product, as: "product", attributes: ["id", "name"] },
        { model: Attribute, as: "attribute", attributes: ["id", "name", "dataType"] },
      ],
      order: [["id", "ASC"]],
    });
    res.json(values);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get attribute values for a specific product
exports.getAttributesByProduct = async (req, res) => {
  try {
    const values = await ProductAttributeValue.findAll({
      where: { productId: req.params.productId },
      include: [
        { model: Attribute, as: "attribute", attributes: ["id", "name", "dataType"] },
      ],
      order: [["id", "ASC"]],
    });
    res.json(values);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new attribute value
exports.createAttributeValue = async (req, res) => {
  try {
    const { productId, attributeId, value } = req.body;
    const newValue = await ProductAttributeValue.create({ productId, attributeId, value });
    res.status(201).json(newValue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update attribute value
exports.updateAttributeValue = async (req, res) => {
  try {
    const { value } = req.body;
    const attributeValue = await ProductAttributeValue.findByPk(req.params.id);
    if (!attributeValue) return res.status(404).json({ message: "Attribute value not found" });

    await attributeValue.update({ value });
    res.json(attributeValue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete attribute value
exports.deleteAttributeValue = async (req, res) => {
  try {
    const attributeValue = await ProductAttributeValue.findByPk(req.params.id);
    if (!attributeValue) return res.status(404).json({ message: "Attribute value not found" });

    await attributeValue.destroy();
    res.json({ message: "Attribute value deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
