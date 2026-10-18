import { useEffect, useState } from "react";
import { purchaseOrderApi, supplierApi } from "../services/api";
import "../styles/admin-page.css";

const emptyForm = {
  supplier: "",
  order_date: "",
  expected_date: "",
  status: "PENDING",
  total_amount: "",
};

export default function Purchases() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [receivingId, setReceivingId] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

 

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [ordersData, suppliersData] = await Promise.all([
        purchaseOrderApi.getAll(),
        supplierApi.getAll(),
      ]);
      setOrders(ordersData);
      setSuppliers(suppliersData);
    } catch (err) {
      setError("Failed to load purchase orders. Is the backend running?");
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

  function openEditForm(order) {
    setForm({
      supplier: order.supplier?.supplier_id ?? "",
      order_date: order.order_date ?? "",
      expected_date: order.expected_date ?? "",
      status: order.status ?? "PENDING",
      total_amount: order.total_amount ?? "",
    });
    setEditingId(order.purchase_order_id);
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
      supplier: form.supplier ? { supplier_id: form.supplier } : null,
      order_date: form.order_date || null,
      expected_date: form.expected_date || null,
      status: form.status,
      total_amount: parseFloat(form.total_amount) || 0,
    };

    try {
      if (editingId) {
        await purchaseOrderApi.update(editingId, payload);
      } else {
        await purchaseOrderApi.create(payload);
      }
      setShowForm(false);
      await loadAll();
    } catch (err) {
      setError("Failed to save purchase order.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleReceive(id) {
    setReceivingId(id);
    setError(null);
    try {
      await purchaseOrderApi.receive(id);
      await loadAll();
    } catch (err) {
      setError("Failed to receive purchase order.");
      console.error(err);
    } finally {
      setReceivingId(null);
    }
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Restocking &middot; {orders.length} orders</p>
          <h1>
            Purchase <em>Orders</em>
          </h1>
        </div>
        <button className="add-btn" onClick={openAddForm}>
          New Purchase Order
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p>Loading purchase orders...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Order Date</th>
              <th>Expected</th>
              <th>Status</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={6}>No purchase orders yet.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.purchase_order_id}>
                  <td className="row-title">
                    {order.supplier?.supplier_name ?? "—"}
                  </td>
                  <td>{order.order_date ?? "—"}</td>
                  <td>{order.expected_date ?? "—"}</td>
                  <td>{order.status}</td>
                  <td>{order.total_amount}</td>
                  <td style={{ display: "flex", gap: 12 }}>
                    <button
                      className="edit-link"
                      onClick={() => openEditForm(order)}
                    >
                      Edit
                    </button>
                    {order.status !== "RECEIVED" && (
                      <button
                        className="edit-link"
                        disabled={receivingId === order.purchase_order_id}
                        onClick={() => handleReceive(order.purchase_order_id)}
                      >
                        {receivingId === order.purchase_order_id
                          ? "Receiving..."
                          : "Receive"}
                      </button>
                    )}
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
            <h2>{editingId ? "Edit purchase order" : "New purchase order"}</h2>
            <form onSubmit={handleSubmit}>
              <label className="full">
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

              <label>
                Order date
                <input
                  type="date"
                  name="order_date"
                  value={form.order_date}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Expected date
                <input
                  type="date"
                  name="expected_date"
                  value={form.expected_date}
                  onChange={handleChange}
                />
              </label>

              <label>
                Status
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="PENDING">Pending</option>
                  <option value="ORDERED">Ordered</option>
                  <option value="RECEIVED">Received</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </label>

              <label>
                Total amount
                <input
                  type="number"
                  step="0.01"
                  name="total_amount"
                  value={form.total_amount}
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