import { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Login() {
  const [formData, setFormData] = useState({
    role: "student", // default role
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // *********************** Validation functions **********************
  const validateEmail = (email) => {
    //$$ update for accountant email pattern if different
    const regex = /^[1-9][0-9]{8}@nitkkr\.ac\.in$/;
    return regex.test(email) ? "" : "Please enter a valid college email";
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(password)
      ? ""
      : "Password must be at least 8 characters and include one special character";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // live validation
    if (name === "email") {
      setErrors({ ...errors, email: validateEmail(value.trim().toLowerCase()) });
    } else if (name === "password") {
      setErrors({ ...errors, password: validatePassword(value) });
    }
  };

  // *********************** Form submission **********************
  const handleLogin = async (e) => {
    e.preventDefault();

    const emailErr = validateEmail(formData.email.trim().toLowerCase());
    const passwordErr = validatePassword(formData.password);

    if (emailErr || passwordErr) {
      setErrors({ email: emailErr, password: passwordErr });
      return;
    }

    try {
      // $$ API call to backend for login
      console.log("Logging in with data:", formData);
      toast.success("Login successful!");

      // Redirect user based on role
      if (formData.role === "student") {
        navigate("/student/home");
      } else {
        navigate("/accountant/home");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>
          <i className="fas fa-user-circle"></i> Login
        </h2>

        <form onSubmit={handleLogin}>
          {/* Role Selection */}
          <div className="form-group">
            <label htmlFor="role">
              <i className="fas fa-user-tag"></i> Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
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
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="error_msg">{errors.email}</div>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <div className="error_msg">{errors.password}</div>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
        </form>

        <p className="signup-text">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
