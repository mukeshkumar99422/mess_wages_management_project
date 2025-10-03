import "./landing.css";
import heroImg from '../../assets/heroImg.png';
import { Link } from "react-router-dom";


export default function LandingPage() {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <i className="fas fa-utensils"></i> Diet Manager
        </div>
        <div className="nav-buttons">
            <Link to="/login">
          <button className="btn btn-outline" >
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
          </Link>
          <Link to="/register">
          <button className="btn btn-primary">
            <i className="fas fa-user-plus"></i> Sign Up
          </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Smart Hostel Mess Diet Management</h1>
          <p>
            A modern web app for students to check menus, track extra items, and
            analyze expenses — while accountants can easily manage daily updates.
          </p>
          <button className="btn btn-primary hero-btn">
            <i className="fas fa-rocket"></i> Get Started
          </button>
        </div>
        <div className="hero-image">
          <img
            src={heroImg}
            alt="Mess Illustration"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>
              <i className="fas fa-calendar-day icon"></i> Daily Menu
            </h3>
            <p>Students can view the daily mess menu updated by the accountant.</p>
          </div>
          <div className="feature-card">
            <h3>
              <i className="fas fa-drumstick-bite icon"></i> Extra Items
            </h3>
            <p>See today’s extra dishes with prices and manage your choices.</p>
          </div>
          <div className="feature-card">
            <h3>
              <i className="fas fa-chart-pie icon"></i> Expense Analysis
            </h3>
            <p>Track your monthly extra food expenses with clear reports.</p>
          </div>
          <div className="feature-card">
            <h3>
              <i className="fas fa-user-tie icon"></i> Easy Management
            </h3>
            <p>
              Accountants can update menus and extras with just a few clicks.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} Mess Manager. All Rights Reserved. | Made
          with <i className="fas fa-heart"></i>
        </p>
      </footer>
    </div>
  );
}
