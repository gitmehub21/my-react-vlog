import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaUser,
  FaPlus,
  FaShieldAlt,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  if (location.pathname === "/") return null;

  return (
    <header className="navbar">
      <style>{`
        .navbar {
          background-color: #ff6b35;
          padding: 10px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);

          /* ✨ FADE IN HEADER */
          animation: fadeDown 0.6s ease-out;
        }

        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .navbar h1 {
          color: white;
          font-size: 20px;
          margin: 0;
        }

        .nav-links {
          display: flex;
          gap: 10px;
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 6px;

          padding: 8px 12px;
          border-radius: 6px;

          font-size: 14px;
          color: white;
          text-decoration: none;

          background: rgba(255,255,255,0.12);

          transition: all 0.25s ease;

          /* optional fade for items */
          animation: fadeItem 0.5s ease both;
        }

        .nav-item:hover {
          transform: translateY(-2px) scale(1.03);
          background: rgba(255,255,255,0.25);
        }

        .nav-item:active {
          transform: scale(0.95);
        }

        .active {
          background: rgba(0,0,0,0.25);
        }

        .create { background: rgba(255, 255, 255, 0.25); }
        .admin { background: rgba(255, 255, 255, 0.18); }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;

          padding: 8px 12px;
          border-radius: 6px;
          border: none;

          background: #ff0000;
          color: white;

          cursor: pointer;
          transition: all 0.25s ease;
        }

        .logout-btn:hover {
          transform: translateY(-2px) scale(1.05);
          background: #c62828;
        }

        .logout-btn:active {
          transform: scale(0.95);
        }

        /* ✨ ITEM FADE IN */
        @keyframes fadeItem {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <h1>TheFolio</h1>

      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/home" className={`nav-item ${isActive("/home")}`}>
              <FaHome /> Home
            </Link>
          </li>

          <li>
            <Link to="/about" className={`nav-item ${isActive("/about")}`}>
              <FaInfoCircle /> About
            </Link>
          </li>

          <li>
            <Link to="/contact" className={`nav-item ${isActive("/contact")}`}>
              <FaEnvelope /> Contact
            </Link>
          </li>

          {user && (
            <li>
              <Link to="/profile" className="nav-item">
                <FaUser /> Profile
              </Link>
            </li>
          )}

          {user && (
            <li>
              <Link to="/create-post" className="nav-item create">
                <FaPlus /> Create Post
              </Link>
            </li>
          )}

          {user?.role === "admin" && (
            <li>
              <Link to="/admin" className="nav-item admin">
                <FaShieldAlt /> Admin
              </Link>
            </li>
          )}

          {!user ? (
            <>
              <li>
                <Link to="/login" className="nav-item">
                  <FaSignInAlt /> Login
                </Link>
              </li>

              <li>
                <Link to="/register" className="nav-item">
                  <FaUserPlus /> Register
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button className="logout-btn" onClick={logout}>
                <FaSignOutAlt /> Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;