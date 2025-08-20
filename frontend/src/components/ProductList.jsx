import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../services/api";
import ProductForm from "./ProductForm";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      fetchProducts(); // Refresh list after delete
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Products</h1>

      {/* Product Form */}
      <ProductForm
        selectedProduct={editingProduct}
        onSuccess={() => {
          fetchProducts();
          setEditingProduct(null);
        }}
      />

      {/* Product Table */}
      <table border="1" cellPadding="5" cellSpacing="0" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Description</th>
            <th>Attributes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.category?.name}</td>
              <td>${p.price}</td>
              <td>{p.description}</td>
              <td>
                {p.attributeValues.map((av) => (
                  <div key={av.id}>
                    {av.attribute?.name}: {av.value}
                  </div>
                ))}
              </td>
              <td>
                <button onClick={() => setEditingProduct(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
