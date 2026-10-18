import { useEffect, useState } from "react";
import { saleItemApi, saleApi, productApi } from "../services/api";
import "../styles/admin-page.css";

const emptyForm = {
  sale: "",
  product: "",
  quantity: "",
  price: "",
};

export default function SaleItems() {
  const [items, setItems] = useState([]);
  const [sales, setSales] = useState([]);
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
      const [itemsData, salesData, productsData] = await Promise.all([
        saleItemApi.getAll(),
        saleApi.getAll(),
        productApi.getAll(),
      ]);
      setItems(itemsData);
      setSales(salesData);
      setProducts(productsData);
    } catch (err) {
      setError("Failed to load sale items.");
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
      sale: item.sale?.sale_id ?? "",
      product: item.product?.product_id ?? "",
      quantity: item.quantity ?? "",
      price: item.price ?? "",
    });
    setEditingId(item.sale_item_id);
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
  sale: {
    sale_id: Number(form.sale)
  },
  product: {
    product_id: Number(form.product)
  },
  quantity: Number(form.quantity),
  price: Number(form.price)
};

    try {
      if (editingId) {
        await saleItemApi.update(editingId, payload);
      } else {
        // Backend note: creating a sale item should reduce inventory
        // server-side per your API spec ("add sold item + reduce inventory")
        await saleItemApi.create(payload);
      }
      setShowForm(false);
      await loadAll();
    } catch (err) {
      setError("Failed to save sale item.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Line items &middot; {items.length} entries</p>
          <h1>
            Sale <em>Items</em>
          </h1>
        </div>
        <button className="add-btn" onClick={openAddForm}>
          Add Item
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p>Loading items...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Sale</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Line Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={6}>No sale items yet.</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.sale_item_id}>
                  <td className="row-title">#{item.sale?.sale_id ?? "—"}</td>
                  <td>{item.product?.product_name ?? "—"}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>{((item.quantity || 0) * (item.price || 0)).toFixed(2)}</td>
                  <td>
                    <button
                      className="edit-link"
                      onClick={() => openEditForm(item)}
                    >
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
            <h2>{editingId ? "Edit item" : "Add item to sale"}</h2>
            <form onSubmit={handleSubmit}>
              <label className="full">
                Sale
                <select name="sale" value={form.sale} onChange={handleChange} required>
                  <option value="">Select sale</option>
                  {sales.map((s) => (
                    <option key={s.sale_id} value={s.sale_id}>
                      #{s.sale_id} — {s.sale_date ?? "—"}
                    </option>
                  ))}
                </select>
              </label>

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

              <label>
                Quantity
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Price
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={form.price}
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