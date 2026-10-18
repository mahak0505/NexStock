import { useEffect, useState } from "react";
import { inventoryApi, productApi } from "../services/api";
import "../styles/admin-page.css";

const emptyForm = {
  product: "",
  quantity: "",
};

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
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
      const [inventoryData, productsData] = await Promise.all([
        inventoryApi.getAll(),
        productApi.getAll(),
      ]);
      setInventory(inventoryData);
      setProducts(productsData);
    } catch (err) {
      setError("Failed to load inventory. Is the backend running?");
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

  function openEditForm(item) {
    setForm({
      product: item.product?.product_id ?? "",
      quantity: item.quantity ?? "",
    });
    setEditingId(item.inventory_id);
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
      product: form.product ? { product_id: form.product } : null,
      quantity: parseInt(form.quantity, 10) || 0,
    };

    try {
      if (editingId) {
        await inventoryApi.update(editingId, payload);
      } else {
        await inventoryApi.create(payload);
      }
      setShowForm(false);
      await loadAll();
    } catch (err) {
      setError("Failed to save inventory record.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Stock &middot; {inventory.length} tracked</p>
          <h1>
            Inventory <em>Levels</em>
          </h1>
        </div>
        <button className="add-btn" onClick={openAddForm}>
          Add Stock Record
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p>Loading inventory...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Minimum Stock</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={6}>No inventory records yet.</td>
              </tr>
            ) : (
              inventory.map((item) => {
                const min = item.product?.minimum_stock ?? 0;
                const low = item.quantity <= min;
                return (
                  <tr key={item.inventory_id}>
                    <td className="row-title">
                      {item.product?.product_name ?? "—"}
                    </td>
                    <td>{item.quantity}</td>
                    <td>{min}</td>
                    <td style={{ color: low ? "var(--terracotta)" : "inherit" }}>
                      {low ? "Low stock" : "OK"}
                    </td>
                    <td>{item.last_updated ?? "—"}</td>
                    <td>
                      <button
                        className="edit-link"
                        onClick={() => openEditForm(item)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? "Edit stock record" : "New stock record"}</h2>
            <form onSubmit={handleSubmit}>
              <label className="full">
                Product
                <select
                  name="product"
                  value={form.product}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.product_id} value={p.product_id}>
                      {p.product_name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="full">
                Quantity
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}