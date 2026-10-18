import { useEffect, useState } from "react";
import { categoryApi } from "../services/api";
import "../styles/admin-page.css";

const emptyForm = {
  category_name: "",
  description: "",
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories. Is the backend running?");
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

  function openEditForm(category) {
    setForm({
      category_name: category.category_name ?? "",
      description: category.description ?? "",
    });
    setEditingId(category.category_id);
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
        await categoryApi.update(editingId, form);
      } else {
        await categoryApi.create(form);
      }
      setShowForm(false);
      await loadCategories();
    } catch (err) {
      setError("Failed to save category.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Catalog &middot; {categories.length} categories</p>
          <h1>
            Product <em>Categories</em>
          </h1>
        </div>
        <button className="add-btn" onClick={openAddForm}>
          Add Category
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={3}>No categories yet — add your first one.</td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.category_id}>
                  <td className="row-title">{c.category_name}</td>
                  <td>{c.description}</td>
                  <td>
                    <button className="edit-link" onClick={() => openEditForm(c)}>
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
            <h2>{editingId ? "Edit category" : "New category"}</h2>
            <form onSubmit={handleSubmit}>
              <label className="full">
                Category name
                <input
                  name="category_name"
                  value={form.category_name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="full">
                Description
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
              </label>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}