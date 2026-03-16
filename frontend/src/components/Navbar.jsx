import { useState } from "react";
import "./Navbar.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/actions";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <Link to="/" className="logo-container">
          <img src={logo} alt="logo" className="logo-img" />
          <span className="logo-text">LuxDrive</span>
        </Link>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>

          <li>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </li>
          <li>
            <Link to="/cars" onClick={() => setMenuOpen(false)}>
              Cars
            </Link>
          </li>

          {/* Connecté comme user */}
          {user && user.role === "user" && (
            <li>
              <Link to="/my-reservations" onClick={() => setMenuOpen(false)}>
                My Reservations
              </Link>
            </li>
          )}

          {/* Connecté comme admin */}
          {user && user.role === "admin" && (
            <li>
              <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar-right">
          {user ? (
            <>
              <Link to="/profile" className="user-pill">
                <div className="user-avatar-sm">
                  {user?.avatar ? (
                    <img
                      src={`${user.avatar}`}
                      alt="avatar"
                    />
                  ) : (
                    user?.firstname?.charAt(0).toUpperCase()
                  )}
                </div>
                <span>{user?.firstname}</span>
              </Link>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register">
                <button className="signup-btn">Sign Up</button>
              </Link>
              <Link to="/login">
                <button className="login-btn">Login</button>
              </Link>
            </>
          )}

          <div
            className="menu-icon"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
