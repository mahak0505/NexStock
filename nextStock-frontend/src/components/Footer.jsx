import "./Footer.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-brand">
        <p className="footer-logo">NextStock</p>
        <p className="footer-tagline">
          Inventory, purchasing, and sales — tracked in one place. An
          editorial approach to stock management.
        </p>
      </div>

      <div className="footer-col">
        <p className="footer-col-title">Contact</p>
        <p>support@nextstock.app</p>
        <p>Mon–Sat, 9am–6pm</p>
      </div>

      <div className="footer-col">
        <p className="footer-col-title">Modules</p>
        <a href="#products">Products</a>
        <a href="#inventory">Inventory</a>
        <a href="#suppliers">Suppliers</a>
        <a href="#purchases">Purchases</a>
        <a href="#sales">Sales</a>
      </div>

      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} NextStock</span>
      </div>
    </footer>
  );
}