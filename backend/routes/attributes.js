const express = require("express");
const router = express.Router();
const { Attribute } = require("../models");

// GET attributes for a specific category
router.get("/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const attributes = await Attribute.findAll({
      where: { categoryId },
    });
    res.json(attributes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
