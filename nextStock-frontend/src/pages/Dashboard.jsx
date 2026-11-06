import { useEffect, useState } from "react";
import {
  productApi,
  inventoryApi,
  saleApi,
  notificationApi,
  purchaseOrderApi,
} from "../services/api";
import "../styles/admin-page.css";
import "./Dashboard.css";

export default function Dashboard() {
   const [stats, setStats] = useState({
  products: 0,
  lowStock: 0,
  sales: 0,
  unread: 0,
  activeAlerts: 0,
});
  const [loading, setLoading] = useState(true);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [pendingPurchases, setPendingPurchases] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

   async function loadStats() {
  setLoading(true);

  try {
    const [products, inventory, sales, notifications] =
      await Promise.all([
        productApi.getAll(),
        inventoryApi.getAll(),
        saleApi.getAll(),
        notificationApi.getAll(),
      ]);

    const lowStockItems = inventory.filter((item) => {
      const min = item.product?.minimum_stock ?? 0;
      return item.quantity <= min;
    });

    setLowStockProducts(lowStockItems);

    setStats({
      products: products.length,
      lowStock: lowStockItems.length,
      sales: sales.length,
      unread: notifications.filter(
        (n) => !n.is_read && !n.is_resolved
      ).length,
      activeAlerts: notifications.filter(
        (n) => !n.is_resolved
      ).length,
    });

    // Fetch purchase orders separately
    try {
      const purchases = await purchaseOrderApi.getAll();

      setPendingPurchases(
        purchases.filter((p) => p.status !== "RECEIVED")
      );
    } catch (err) {
      console.error("Purchase orders error:", err);
    }

  } catch (err) {
    console.error("Dashboard error:", err);
  } finally {
    setLoading(false);
  }
}

  
const cards = [
  { label: "Total Products", value: stats.products },
  { label: "Low Stock Products", value: stats.lowStock, accent: true },
  { label: "Total Sales", value: stats.sales },
  { label: "Pending Purchase Orders", value: pendingPurchases.length, accent: true },
  { label: "Active Alerts", value: stats.activeAlerts, accent: true },
  { label: "Unread Active Alerts", value: stats.unread },
];


  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>
            Today&rsquo;s <em>Summary</em>
          </h1>
        </div>
      </div>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <div className="stat-grid">
          {cards.map((card) => (
            <div className="stat-card" key={card.label}>
              <p className="stat-value" data-accent={card.accent || undefined}>
                {card.value}
              </p>
              <p className="stat-label">{card.label}</p>
            </div>
          ))}
        </div>
      )}
      <div className="dashboard-section">
  <h2>Low Stock Products</h2>
  <p>Products that need restocking.</p>

  {lowStockProducts.length === 0 ? (
    <p>All products have sufficient stock!</p>
  ) : (
    <table className="dashboard-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Available Stock</th>
          <th>Minimum Stock</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {lowStockProducts.map((item) => (
          <tr key={item.inventory_id}>
            <td>{item.product?.product_name}</td>
            <td>{item.quantity}</td>
            <td>{item.product?.minimum_stock}</td>
            <td>
              <span className="stock-warning">
                {item.quantity === 0 ? "Out of Stock" : "Low Stock"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
<div className="dashboard-section">
  <h2>Pending Purchase Orders</h2>
  <p>Purchase orders awaiting receipt.</p>

  {pendingPurchases.length === 0 ? (
    <p>No pending purchase orders.</p>
  ) : (
    <table className="dashboard-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Supplier</th>
          <th>Order Date</th>
          <th>Expected Date</th>
          <th>Status</th>
          <th>Amount</th>
        </tr>
      </thead>

      <tbody>
        {pendingPurchases.map((purchase) => (
          <tr key={purchase.purchase_order_id}>
            <td>#{purchase.purchase_order_id}</td>
            <td>{purchase.supplier?.supplier_name}</td>
            <td>{purchase.order_date}</td>
            <td>{purchase.expected_date}</td>
            <td>{purchase.status}</td>
            <td>₹{Number(purchase.total_amount).toLocaleString("en-IN")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
    </div>
  );
}