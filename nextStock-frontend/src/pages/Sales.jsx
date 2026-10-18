import { useEffect, useState } from "react";
import { saleApi, userApi } from "../services/api";
import "../styles/admin-page.css";

const emptyForm = {
  sale_date: "",
  total_amount: "",
  user: "",
};

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([]);
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
      const [salesData, usersData] = await Promise.all([
        saleApi.getAll(),
        userApi.getAll(),
      ]);
      setSales(salesData);
      setUsers(usersData);
    } catch (err) {
      setError("Failed to load sales. Is the backend running?");
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

  function openEditForm(sale) {
    setForm({
      sale_date: sale.sale_date ?? "",
      total_amount: sale.total_amount ?? "",
      user: sale.user?.user_id ?? "",
    });
    setEditingId(sale.sale_id);
    setShowForm(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    

     if (!form.user) {
    alert("Please select a user");
    return;
     }
     setSaving(true);
    setError(null);
     const payload = {
      total_amount: Number(form.total_amount),
     user: {
       user_id: Number(form.user)
     }
    };

    
    try {
      if (editingId) {
        await saleApi.update(editingId, payload);
      } else {
        await saleApi.create(payload);
      }
      setShowForm(false);
      await loadAll();
    } catch (err) {
      setError("Failed to save sale.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Revenue &middot; {sales.length} sales</p>
          <h1>
            Sales <em>Ledger</em>
          </h1>
        </div>
        <button className="add-btn" onClick={openAddForm}>
          New Sale
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p>Loading sales...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Sold By</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={4}>No sales recorded yet.</td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.sale_id}>
                  <td className="row-title">{sale.sale_date ?? "—"}</td>
                  <td>{sale.user?.name ?? "—"}</td>
                  <td>{sale.total_amount}</td>
                  <td>
                    <button
                      className="edit-link"
                      onClick={() => openEditForm(sale)}
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
            <h2>{editingId ? "Edit sale" : "New sale"}</h2>
            <form onSubmit={handleSubmit}>
              <label className="full">
                Sale date
                <input
                  type="date"
                  name="sale_date"
                  value={form.sale_date}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="full">
                Sold by
                <select name="user" value={form.user} onChange={handleChange} required>
                  <option value="">Select user</option>
                  {users.map((u) => (
                    <option key={u.user_id} value={u.user_id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="full">
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