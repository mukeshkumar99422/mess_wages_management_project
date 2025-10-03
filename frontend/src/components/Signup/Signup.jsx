import { useState } from "react";
import { Link } from "react-router-dom";
import "./signup.css";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
    c_password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    password: "",
    c_password: "",
  });

  // ***********************validation functions**********************
  const validateEmail = (email) => {
    const regex = /^[1-9][0-9]{8}@nitkkr\.ac\.in$/;
    return regex.test(email) ? "" : "Please enter correct college email";
  };

  const validateOTP=(otp)=>{
    const regex=/^[0-9]{6}$/;
    return regex.test(otp) ? "" : "Please enter a valid OTP";
  }

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
    if(name=="otp"){
      setErrors({...errors, otp: validateOTP(value)});
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

  // ******************generate OTP for email validation********************
  const handleGetOTP=(e)=>{
    e.preventDefault();
    const emailErr = validateEmail(formData.email);
    if(emailErr){
      setErrors({...errors, email: emailErr});
      return;
    }

    //api call to send OTP to email
  }

  // *******************Submit handler******************
  const handleSubmit = (e) => {
    e.preventDefault();

    // Final validation before submit
    const emailErr = validateEmail(formData.email);
    const otpErr = validateOTP(formData.otp);
    const passErr = validatePassword(formData.password);
    const cPassErr = validateConfirmPassword(
      formData.password,
      formData.c_password
    );

    if (emailErr || otpErr || passErr || cPassErr) {
      setErrors({ email: emailErr, otp: otpErr, password: passErr, c_password: cPassErr });
      return;
    }

    console.log("Signup Data:", formData);
    // 👉 Later: send to backend API
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

          <div className="form-group">
            <div className="otp-group">
              <input 
              className="otp-input"
              type="otp" 
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              required/>
              <button className="btn-otp" onClick={handleGetOTP}>Validate Email</button>
            </div>
            {errors.otp && <div className="error_msg">{errors.otp}</div>}
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
