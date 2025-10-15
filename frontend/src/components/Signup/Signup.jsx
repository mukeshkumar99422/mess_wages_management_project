import { useState } from "react";
import { Link } from "react-router-dom";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";



export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    c_password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    c_password: "",
  });

  const navigate=useNavigate();

  // ***********************validation functions**********************
  const validateEmail = (email) => {
    const regex = /^[1-9][0-9]{8}@nitkkr\.ac\.in$/;
    return regex.test(email) ? "" : "Please enter correct college email";
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(password)
      ? ""
      : "Password must be at least 8 characters long and include at least one special character";
  };

  const validateConfirmPassword = (password, c_password) => {
    return password === c_password ? "" : "Passwords do not match";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // update data
    setFormData({
      ...formData,
      [name]: value,
    });

    // live validation
    if (name === "email") {
      setErrors({ ...errors, email: validateEmail(value.trim().toLowerCase()) });
    }
    if (name === "password") {
      setErrors({
        ...errors,
        password: validatePassword(value),
        c_password: validateConfirmPassword(value, formData.c_password),
      });
    }
    if (name === "c_password") {
      setErrors({
        ...errors,
        c_password: validateConfirmPassword(formData.password, value),
      });
    }
  };

  // *******************Submit handler******************
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submit
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);
    const cPassErr = validateConfirmPassword(
      formData.password,
      formData.c_password
    );

    if (emailErr || passErr || cPassErr) {
      setErrors({ email: emailErr, password: passErr, c_password: cPassErr });
      return;
    }

    try{
      console.log("Signup Data:", formData);
      //$$Later: send to backend API
      navigate('/otp-validation',{state:{email:formData.email}});
    }catch(err){
      //$$ handle error appropriately
      console.error("Signup error:", err);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create an Account</h2>
        <p className="subtitle">Sign up to continue to Diet Manager</p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your college email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="error_msg">{errors.email}</div>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <div className="error_msg">{errors.password}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="c_password"
              placeholder="Re-enter password"
              value={formData.c_password}
              onChange={handleChange}
              required
            />
            {errors.c_password && (
              <div className="error_msg">{errors.c_password}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            <i className="fas fa-user-plus"></i> Sign Up
          </button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
