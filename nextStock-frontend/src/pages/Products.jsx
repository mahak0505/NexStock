import { useEffect, useState } from "react";
import { productApi, categoryApi, supplierApi } from "../services/api";
import "../styles/admin-page.css";

const emptyForm = {
  product_name: "",
  sku: "",
  barcode: "",
  cost_price: "",
  selling_price: "",
  minimum_stock: "",
  expiry_date: "",
  category: "",
  supplier: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData, suppliersData] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll(),
        supplierApi.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
    } catch (err) {
      setError("Failed to load products. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openAddForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(product) {
    setForm({
      product_name: product.product_name ?? "",
      sku: product.sku ?? "",
      barcode: product.barcode ?? "",
      cost_price: product.cost_price ?? "",
      selling_price: product.selling_price ?? "",
      minimum_stock: product.minimum_stock ?? "",
      expiry_date: product.expiry_date ?? "",
      category: product.category?.category_id ?? "",
      supplier: product.supplier?.supplier_id ?? "",
    });
    setEditingId(product.product_id);
    setShowForm(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      product_name: form.product_name,
      sku: form.sku,
      barcode: form.barcode,
      cost_price: parseFloat(form.cost_price) || 0,
      selling_price: parseFloat(form.selling_price) || 0,
      minimum_stock: parseInt(form.minimum_stock, 10) || 0,
      expiry_date: form.expiry_date || null,
      category: form.category ? { category_id: form.category } : null,
      supplier: form.supplier ? { supplier_id: form.supplier } : null,
    };

    try {
      if (editingId) {
        await productApi.update(editingId, payload);
      } else {
        await productApi.create(payload);
      }
      setShowForm(false);
      await loadAll();
    } catch (err) {
      setError("Failed to save product.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Catalog &middot; {products.length} items</p>
          <h1>
            Product <em>Inventory</em>
          </h1>
        </div>
        <button className="add-btn" onClick={openAddForm}>
          Add Product
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Cost Price</th>
              <th>Selling Price</th>
              <th>Min. Stock</th>
              <th>Expiry</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={9}>No products yet — add your first one.</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.product_id}>
                  <td className="row-title">{p.product_name}</td>
                  <td>{p.sku}</td>
                  <td>{p.category?.category_name ?? "—"}</td>
                  <td>{p.supplier?.supplier_name ?? "—"}</td>
                  <td>{p.cost_price}</td>
                  <td>{p.selling_price}</td>
                  <td>{p.minimum_stock}</td>
                  <td>{p.expiry_date ?? "—"}</td>
                  <td>
                    <button className="edit-link" onClick={() => openEditForm(p)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? "Edit product" : "New product"}</h2>
            <form onSubmit={handleSubmit}>
              <label className="full">
                Product name
                <input
                  name="product_name"
                  value={form.product_name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                SKU
                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Barcode
                <input
                  name="barcode"
                  value={form.barcode}
                  onChange={handleChange}
                />
              </label>

              <label>
                Cost price
                <input
                  type="number"
                  step="0.01"
                  name="cost_price"
                  value={form.cost_price}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Selling price
                <input
                  type="number"
                  step="0.01"
                  name="selling_price"
                  value={form.selling_price}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Minimum stock
                <input
                  type="number"
                  name="minimum_stock"
                  value={form.minimum_stock}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Expiry date
                <input
                  type="date"
                  name="expiry_date"
                  value={form.expiry_date}
                  onChange={handleChange}
                />
              </label>

              <label>
                Category
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.category_name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Supplier
                <select
                  name="supplier"
                  value={form.supplier}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.supplier_id} value={s.supplier_id}>
                      {s.supplier_name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}