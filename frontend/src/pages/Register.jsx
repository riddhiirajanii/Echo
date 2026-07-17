import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifyingLoading, setVerifyingLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- REGISTER ----------------
  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // If your backend returns token immediately
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      if (res.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );
      }

      // Show verification page instead of dashboard
      setIsVerifying(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- VERIFY EMAIL ----------------
  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    try {
      setVerifyingLoading(true);
      setError("");

      await api.post("/auth/verifyemail", {
        email: formData.email,
        code: verificationCode,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We couldn't verify your email. Please try again."
      );
    } finally {
      setVerifyingLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="crayon-flower flower-top">
        <div className="petal p1"></div>
        <div className="petal p2"></div>
        <div className="petal p3"></div>
        <div className="petal p4"></div>
        <div className="petal p5"></div>
        <div className="flower-center"></div>
      </div>

      <div className="crayon-flower flower-bottom">
        <div className="petal p1"></div>
        <div className="petal p2"></div>
        <div className="petal p3"></div>
        <div className="petal p4"></div>
        <div className="flower-center"></div>
      </div>

      <div className="card form">
        {!isVerifying ? (
          <>
            <h1>Echo</h1>

            <p className="subtitle">
              Begin your wellness journey
            </p>

            <form onSubmit={handleRegister}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                required
              />

              {error && (
                <div className="error">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}>
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>
            </form>

            <p
              className="mt-1 text-center"
              style={{ color: "#786464" }}
            >
              Already have an account?{" "}
              <Link to="/login">Login here</Link>
            </p>
          </>
        ) : (
          <form
            onSubmit={handleVerifyEmail}
            className="auth-card verification-view"
          >
            <div className="verification-icon-badge">
              📩
            </div>

            <h2>Verify Your Email</h2>

            <p className="auth-subtitle">
              We have sent a verification code to{" "}
              <strong>{formData.email}</strong>.
            </p>

            <div className="input-group-custom">
              <label>6-Digit Verification Code</label>

              <input
                type="text"
                maxLength={6}
                placeholder="• • • • • •"
                className="verification-digits-input"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                required
              />
            </div>

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-btn verification-btn"
              disabled={
                verifyingLoading ||
                verificationCode.length !== 6
              }
            >
              {verifyingLoading
                ? "Verifying..."
                : "Verify & Complete ✨"}
            </button>

          </form>
        )}
      </div>
    </div>
  );
}

export default Register;