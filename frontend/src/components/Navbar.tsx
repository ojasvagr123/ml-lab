import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-brand">Multi-Model Predictor</div>

      <nav className="navbar-links">
        <Link className={isActive("/") ? "active" : ""} to="/">Home</Link>
        <Link className={isActive("/house") ? "active" : ""} to="/house">House</Link>
        <Link className={isActive("/cricket") ? "active" : ""} to="/cricket">Cricket</Link>
        <Link className={isActive("/flag") ? "active" : ""} to="/flag">Flag</Link>
        <Link className={isActive("/audio") ? "active" : ""} to="/audio">Audio</Link>
      </nav>
    </header>
  );
}