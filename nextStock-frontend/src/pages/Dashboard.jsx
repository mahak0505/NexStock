import { useEffect, useState } from "react";
import {
  productApi,
  inventoryApi,
  saleApi,
  notificationApi,
} from "../services/api";
import "../styles/admin-page.css";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    lowStock: 0,
    sales: 0,
    unread: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const [products, inventory, sales, notifications] = await Promise.all([
        productApi.getAll(),
        inventoryApi.getAll(),
        saleApi.getAll(),
        notificationApi.getAll(),
      ]);

      const lowStock = inventory.filter((item) => {
        const min = item.product?.minimum_stock ?? 0;
        return item.quantity <= min;
      }).length;

      setStats({
        products: products.length,
        lowStock,
        sales: sales.length,
        unread: notifications.filter((n) => !n.is_read).length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    { label: "Products", value: stats.products },
    { label: "Low stock alerts", value: stats.lowStock, accent: true },
    { label: "Total sales", value: stats.sales },
    { label: "Unread notifications", value: stats.unread },
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
    </div>
  );
}