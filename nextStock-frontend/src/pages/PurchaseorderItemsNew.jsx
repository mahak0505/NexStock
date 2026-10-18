import { useEffect, useState } from "react";
import {
  purchaseOrderItemApi,
  purchaseOrderApi,
  productApi,
} from "../services/api";
import "../styles/admin-page.css";

const emptyForm = {
  purchaseOrder: "",
  product: "",
  quantity: "",
  cost_price: "",
};

export default function PurchaseOrderItems() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
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
      const [itemsData, ordersData, productsData] = await Promise.all([
        purchaseOrderItemApi.getAll(),
        purchaseOrderApi.getAll(),
        productApi.getAll(),
      ]);
      setItems(itemsData);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (err) {
      setError("Failed to load purchase order items.");
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
      purchaseOrder: item.purchaseOrder?.purchase_order_id ?? "",
      product: item.product?.product_id ?? "",
      quantity: item.quantity ?? "",
      cost_price: item.cost_price ?? "",
    });
    setEditingId(item.purchase_order_item_id);
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
      purchaseOrder: form.purchaseOrder
        ? { purchase_order_id: form.purchaseOrder }
        : null,
      product: form.product ? { product_id: form.product } : null,
      quantity: parseInt(form.quantity, 10) || 0,
      cost_price: parseFloat(form.cost_price) || 0,
    };

    try {
      if (editingId) {
        await purchaseOrderItemApi.update(editingId, payload);
      } else {
        await purchaseOrderItemApi.create(payload);
      }
      setShowForm(false);
      await loadAll();
    } catch (err) {
      setError("Failed to save item.");
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
            Order <em>Items</em>
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
              <th>Purchase Order</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Cost Price</th>
              <th>Line Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={6}>No order items yet.</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.purchase_order_item_id}>
                  <td className="row-title">
                    #{item.purchaseOrder?.purchase_order_id ?? "—"}
                  </td>
                  <td>{item.product?.product_name ?? "—"}</td>
                  <td>{item.quantity}</td>
                  <td>{item.cost_price}</td>
                  <td>
                    {(
                      (item.quantity || 0) * (item.cost_price || 0)
                    ).toFixed(2)}
                  </td>
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
            <h2>{editingId ? "Edit item" : "Add item to order"}</h2>
            <form onSubmit={handleSubmit}>
              <label className="full">
                Purchase order
                <select
                  name="purchaseOrder"
                  value={form.purchaseOrder}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select order</option>
                  {orders.map((o) => (
                    <option
                      key={o.purchase_order_id}
                      value={o.purchase_order_id}
                    >
                      #{o.purchase_order_id} — {o.supplier?.supplier_name ?? "—"}
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