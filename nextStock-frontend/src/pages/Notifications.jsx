import { useEffect, useState } from "react";
import { notificationApi } from "../services/api";
import "../styles/admin-page.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationApi.getAll();
      setNotifications(data);
    } catch (err) {
      setError("Failed to load notifications. Is the backend running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(notification) {
    setUpdatingId(notification.notification_id);
    setError(null);
    try {
      await notificationApi.markAsRead(notification.notification_id);
      await loadNotifications();
    } catch (err) {
      setError("Failed to update notification.");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  }

  const unreadCount = notifications.filter(
  (n) => !n.is_read && !n.is_resolved
).length;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Alerts &middot; {unreadCount} unread</p>
          <h1>
            Notification <em>Feed</em>
          </h1>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p>Loading notifications...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Type</th>
              <th>Message</th>
              <th>Created</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={5}>No notifications yet.</td>
              </tr>
            ) : (
              notifications.map((n) => (
                <tr
                  key={n.notification_id}
                  style={{ opacity: n.is_read ? 0.55 : 1 }}
                >
                  <td className="row-title">{n.product?.product_name ?? "—"}</td>
                  <td>{n.notification_type}</td>
                  <td>{n.message}</td>
                  <td>{n.created_at ?? "—"}</td>
                  
                 <td>
                   <span
                     style={{
                     color: n.is_resolved ? "green" : "#c45a35",
                     fontWeight: 600,
                    }}
                  >
                   {n.is_resolved ? "Resolved" : "Active"}
                 </span>
                </td>

                  <td>
                    {!n.is_read && (
                      <button
                        className="edit-link"
                        disabled={updatingId === n.notification_id}
                        onClick={() => markAsRead(n)}
                      >
                        {updatingId === n.notification_id
                          ? "Marking..."
                          : "Mark as read"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}