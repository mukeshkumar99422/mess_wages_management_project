import { useState } from "react";
import "./login.css";
import { Link } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login Attempt:", { role, email, password });
    // TODO: Add API call for login authentication
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>
          Login
        </h2>
        <form onSubmit={handleLogin}>
          {/* Role Selection */}
          <div className="form-group">
            <label htmlFor="role">
              <i className="fas fa-user-tag"></i> Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="accountant">Accountant</option>
            </select>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i> Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
        </form>

        <p className="signup-text">
          Don’t have an account? <Link to='/register'>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
