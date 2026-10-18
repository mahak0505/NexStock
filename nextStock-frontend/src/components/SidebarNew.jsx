import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Categories" },
  { to: "/inventory", label: "Inventory" },
  { to: "/suppliers", label: "Suppliers" },
  { to: "/purchases", label: "Purchases" },
  { to: "/purchase-order-items", label: "Order Items" },
  { to: "/sales", label: "Sales" },
  { to: "/sale-items", label: "Sale Items" },
  { to: "/notifications", label: "Notifications" },
];

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <p className="sidebar-logo">NextStock</p>
      <ul className="sidebar-links">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}