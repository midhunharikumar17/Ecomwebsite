import { useEffect, useState } from "react";
import "./AdminModal.css";
import AdminLayout from "../../components/common/AdminLayout";
import axiosInstance from "../../services/axiosInstance";

const EMPTY_FORM = { name: "", description: "", price: "", discount: "", stock: "", category: "", images: "" };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axiosInstance.get("/products");
      setProducts(data);
    } finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get("/admin/categories");
      setCategories(data);
    } catch {}
  };

  const openAdd = () => { setEditProduct(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ name: p.name, description: p.description || "", price: p.price, discount: p.discount || 0, stock: p.stock, category: p.category?._id || p.category || "", images: p.images?.[0] || "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), discount: Number(form.discount), stock: Number(form.stock), images: form.images ? [form.images] : [] };
      if (editProduct) {
        await axiosInstance.put(`/products/${editProduct._id}`, payload);
      } else {
        await axiosInstance.post("/products", payload);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving product");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axiosInstance.delete(`/products/${id}`);
    fetchProducts();
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Products">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 12, flexWrap: "wrap" }}>
        <input className="admin-input" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 260 }} />
        <button className="admin-btn admin-btn--primary" onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Product
        </button>
      </div>

      <div className="admin-card">
        {loading ? <div className="admin-loading">Loading products...</div> : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr><th>Product</th><th>Category</th><th>Price</th><th>Discount</th><th>Stock</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {p.images?.[0] && <img src={p.images[0]} alt={p.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} />}
                        <span style={{ fontWeight: 500 }}>{p.name}</span>
                      </div>
                    </td>
                    <td><span className="admin-badge admin-badge--blue">{p.category?.name || "—"}</span></td>
                    <td><strong style={{ color: "#f1f5f9" }}>₹{p.price}</strong></td>
                    <td>{p.discount > 0 ? <span className="admin-badge admin-badge--green">{p.discount}% off</span> : "—"}</td>
                    <td><span className={`admin-badge admin-badge--${p.stock > 5 ? "green" : p.stock > 0 ? "yellow" : "red"}`}>{p.stock}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="admin-btn admin-btn--ghost" onClick={() => openEdit(p)} style={{ padding: "6px 12px" }}>Edit</button>
                        <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(p._id)} style={{ padding: "6px 12px" }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="admin-empty">No products found</div>}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3>{editProduct ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => setShowModal(false)} className="admin-modal__close">✕</button>
            </div>
            <div className="admin-modal__body">
              {[["name","Product Name","text"],["description","Description","text"],["price","Price (₹)","number"],["discount","Discount (%)","number"],["stock","Stock","number"],["images","Image URL","text"]].map(([key, label, type]) => (
                <div key={key} className="admin-modal__field">
                  <label>{label}</label>
                  <input type={type} className="admin-input" style={{ width: "100%" }} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={label} />
                </div>
              ))}
              <div className="admin-modal__field">
                <label>Category</label>
                <select className="admin-select" style={{ width: "100%", height: 38 }} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="admin-btn admin-btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Product"}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;