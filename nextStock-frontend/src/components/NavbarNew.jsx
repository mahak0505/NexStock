import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <p className="navbar-greeting">Welcome back</p>
      <div className="navbar-user">
        <span className="navbar-avatar">M</span>
      </div>
    </header>
  );
}