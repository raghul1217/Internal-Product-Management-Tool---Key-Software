const express = require("express");
const router = express.Router();
const productAttributeController = require("../controllers/productAttributeController");

// Get all attribute values
router.get("/", productAttributeController.getAllAttributeValues);

// Get all attribute values for a specific product
router.get("/product/:productId", productAttributeController.getAttributesByProduct);

// Create new attribute value
router.post("/", productAttributeController.createAttributeValue);

// Update attribute value
router.put("/:id", productAttributeController.updateAttributeValue);

// Delete attribute value
router.delete("/:id", productAttributeController.deleteAttributeValue);

module.exports = router;
