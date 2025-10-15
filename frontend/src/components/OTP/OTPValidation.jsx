import { useEffect, useState } from "react";
import "./otp_validation.css";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function OTPValidationPage() {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(true);
  const [resendCounter, setResendCounter] = useState(0);

  // Load email from signup page
  useEffect(() => {
    if (location.state && location.state.email) {
      setFormData((prev) => ({ ...prev, email: location.state.email }));
    } else {
      navigate("/signup");
    }
  }, [location, navigate]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (resendCounter > 0) {
      timer = setInterval(() => {
        setResendCounter((prev) => prev - 1);
      }, 1000);
    } else {
      setOtpSent(false);
      setMsg("");
    }
    return () => clearInterval(timer);
  }, [resendCounter]);

  const verifyOtp = (otp) => {
    const regex = /^[0-9]{6}$/;
    return regex.test(otp) ? "" : "Please enter a valid 6-digit OTP";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, otp: e.target.value });
    setError(verifyOtp(e.target.value));
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otpErr = verifyOtp(formData.otp);
    if (otpErr) {
      setError(otpErr);
      setLoading(false);
      return;
    }

    try {
      // $$ const response = await api.verifyOtp(formData.email, formData.otp);
      setMsg("OTP verified successfully. Redirecting to login...");
      toast.success("Email verified successfully!");
      setLoading(false);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("OTP verification failed. Please try again.");
      console.error(err);
      setLoading(false);
    }
  };

  const handleGetOTP = async (e) => {
    e.preventDefault();
    if (otpSent || resendCounter > 0) return;

    setError("");
    setMsg("");
    setLoading(true);

    try {
      // $$ const response = await api.sendOtp(formData.email);
      setMsg("OTP sent to your email");
      toast.success("OTP sent successfully!");
      setOtpSent(true);
      setResendCounter(20); // 20-second cooldown
      setLoading(false);
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>Email Verification</h2>
        <p className="subtitle">Verify your email to activate your account.</p>

        <form>
          {/* Email Field */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              required
            />
          </div>

          {/* OTP Field */}
          <div className="form-group">
            <label>Enter OTP</label>
            <input
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={formData.otp}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleVerifyOTP}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {/* Resend OTP Section */}
          <div className="resend-section">
            {otpSent && resendCounter > 0 ? (
              <p className="resend-timer">
                Resend OTP in <strong>{resendCounter}s</strong>
              </p>
            ) : (
              <button
                className="btn btn-outline"
                onClick={handleGetOTP}
                disabled={loading}
              >
                {loading ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>
        </form>

        {error && <div className="error_msg">{error}</div>}
        {msg && <div className="success_msg">{msg}</div>}
      </div>
    </div>
  );
}
