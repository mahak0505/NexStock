import { Routes, Route } from "react-router-dom";
import "./App.css";
 import Sidebar from "./components/SidebarNew.jsx";
import Navbar from "./components/NavbarNew.jsx";
import Footer from "./components/Footer.jsx";

import Categories from "./pages/Categories.jsx";
import PurchaseOrderItems from "./pages/PurchaseorderItemsNew.jsx";
import SaleItems from "./pages/SaleItems.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Inventory from "./pages/Inventory.jsx";
import Suppliers from "./pages/Suppliers.jsx";
import Purchases from "./pages/PurchasesNew.jsx";
import Sales from "./pages/Sales.jsx";
import Notifications from "./pages/Notifications.jsx";
export default function App() {
  return (
    <div className="app">
      <div className="app-sidebar">
        <Sidebar />
      </div>
      <div className="app-main">
        <div className="app-navbar">
          <Navbar />
        </div>
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/purchase-order-items" element={<PurchaseOrderItems />} />
            <Route path="/sale-items" element={<SaleItems />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </div>
  );
}