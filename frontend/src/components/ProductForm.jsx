import { useEffect, useState } from "react";
import {
  getCategories,
  getAttributesByCategory,
  createProduct,
  updateProduct,
  createCategory, // Make sure you have this API function
} from "../services/api";

export default function ProductForm({ selectedProduct, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState(selectedProduct?.name || "");
  const [description, setDescription] = useState(selectedProduct?.description || "");
  const [price, setPrice] = useState(selectedProduct?.price || "");
  const [categoryId, setCategoryId] = useState(selectedProduct?.categoryId || "");
  const [attributes, setAttributes] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Populate form when editing a product
  useEffect(() => {
    setName(selectedProduct?.name || "");
    setDescription(selectedProduct?.description || "");
    setPrice(selectedProduct?.price || "");
    setCategoryId(selectedProduct?.categoryId || "");
    setAttributes(
      selectedProduct?.attributeValues?.map((av) => ({
        attributeId: av.attributeId,
        name: av.attribute?.name,
        value: av.value,
      })) || []
    );
  }, [selectedProduct]);

  // Fetch attributes when category changes
  useEffect(() => {
    if (!categoryId) return;
    fetchAttributes(categoryId);
  }, [categoryId]);

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const fetchAttributes = async (categoryId) => {
    const attrs = await getAttributesByCategory(categoryId);
    setAttributes(
      attrs.map((a) => ({
        attributeId: a.id,
        name: a.name,
        value: "",
      }))
    );
  };

  const handleAttributeChange = (index, value) => {
    const newAttrs = [...attributes];
    newAttrs[index].value = value;
    setAttributes(newAttrs);
  };

  const handleAddCategory = async () => {
    if (!newCategory) return;
    try {
      const created = await createCategory({ name: newCategory });
      setCategories([...categories, created]);
      setCategoryId(created.id); // select the new category automatically
      setNewCategory("");
      setShowAddCategory(false);
    } catch (err) {
      console.error(err);
      alert("Error creating category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name,
      description,
      price,
      categoryId,
      attributeValues: attributes.map((a) => ({
        attributeId: a.attributeId,
        value: a.value,
      })),
    };

    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      onSuccess(); // Refresh list
      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
      setAttributes([]);
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <h2>{selectedProduct ? "Edit Product" : "Add Product"}</h2>

      <div>
        <label>Name:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <label>Description:</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label>Price:</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      {/* Category selection */}
      <div>
        <label>Category:</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowAddCategory(!showAddCategory)}
          style={{ marginLeft: "0.5rem" }}
        >
          Add Category
        </button>
      </div>

      {/* Add category input */}
      {showAddCategory && (
        <div style={{ marginTop: "0.5rem" }}>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category"
          />
          <button type="button" onClick={handleAddCategory}>
            Save
          </button>
        </div>
      )}

      {/* Product attributes */}
      <div>
        <h3>Attributes</h3>
        {attributes.map((attr, index) => (
          <div key={index}>
            <label>{attr.name}:</label>
            <input
              type="text"
              value={attr.value}
              onChange={(e) => handleAttributeChange(index, e.target.value)}
              placeholder={`Enter ${attr.name}`}
              required
            />
          </div>
        ))}
      </div>

      <button type="submit" style={{ marginTop: "1rem" }}>
        Save Product
      </button>
    </form>
  );
}
