import { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import logo from '../../../public/logo1.png'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = () => {
    //$$ Simulate logout (later replace with real logic)
    alert("Logged out successfully!");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/student/home" className="navbar-logo">
              <img src={logo} alt="Hostel Mess Logo" className="logo-img" /> Hostel Mess
            </Link>

            <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
              <li><Link to="/purchase">Purchase Extra</Link></li>
              <li><Link to="/dashboard">Analyse Extra Diet</Link></li>

              {/* Show profile in dropdown on mobile */}
            {isMenuOpen && (
              <li className="mobile-profile">
                <button onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Right section: profile (hidden on mobile) */}
        <div className="navbar-right">
          <i
            className="fas fa-user-circle profile-icon"
            onClick={toggleProfile}
          ></i>
          {isProfileOpen && (
            <div className="profile-dropdown">
              <button onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>
      </div>
    </nav>
  );
}
