import { useEffect, useState } from "react";
import { supplierApi } from "../services/api";
import "../styles/admin-page.css";

const emptyForm = {
  supplier_name: "",
  email: "",
  phone: "",
  address: "",
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    setLoading(true);
    setError(null);
    try {
      const data = await supplierApi.getAll();
      setSuppliers(data);
    } catch (err) {
      setError("Failed to load suppliers. Is the backend running?");
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

  function openEditForm(supplier) {
    setForm({
      supplier_name: supplier.supplier_name ?? "",
      email: supplier.email ?? "",
      phone: supplier.phone ?? "",
      address: supplier.address ?? "",
    });
    setEditingId(supplier.supplier_id);
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

    try {
      if (editingId) {
        await supplierApi.update(editingId, form);
      } else {
        await supplierApi.create(form);
      }
      setShowForm(false);
      await loadSuppliers();
    } catch (err) {
      setError("Failed to save supplier.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Partners &middot; {suppliers.length} suppliers</p>
          <h1>
            Supplier <em>Directory</em>
          </h1>
        </div>
        <button className="add-btn" onClick={openAddForm}>
          Add Supplier
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p>Loading suppliers...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={5}>No suppliers yet — add your first one.</td>
              </tr>
            ) : (
              suppliers.map((s) => (
                <tr key={s.supplier_id}>
                  <td className="row-title">{s.supplier_name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>{s.address}</td>
                  <td>
                    <button className="edit-link" onClick={() => openEditForm(s)}>
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
            <h2>{editingId ? "Edit supplier" : "New supplier"}</h2>
            <form onSubmit={handleSubmit}>
              <label className="full">
                Supplier name
                <input
                  name="supplier_name"
                  value={form.supplier_name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Phone
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </label>

              <label className="full">
                Address
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </label>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}