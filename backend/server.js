// server.js
const express = require("express");
const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors());


// Middleware
app.use(express.json());

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

// Test DB connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("DB connection failed:", err));

// Import Routes
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const productAttributeRoutes = require("./routes/productAttributeRoutes");
const attributeRoutes = require("./routes/attributes");

// Use Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/product-attributes", productAttributeRoutes);
app.use("/api/attributes", attributeRoutes);

// Test root
app.get("/", (req, res) => {
  res.send("Internal Product Management Tool Backend is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app; 
