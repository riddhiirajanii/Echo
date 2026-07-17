import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/login", { email, password });
      console.log(res.data);
      localStorage.setItem("token", res.data.user.token);
      localStorage.setItem( "user",JSON.stringify(res.data.user.user));
      navigate("/dashboard");
    } catch (err) {
      setError("We couldn't find an account with those details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="page">
      {/* --- Actual structural crayon flowers --- */}
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

      {/* --- Login Card Container --- */}
      <div className="card form">
        <h1>Echo</h1>
        <p className="subtitle">Your AI Anxiety Companion</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />



          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading}>

            {loading ? "Taking a moment to log in..." : "Step Inside"}
          </button>
        </form>

        <p className="mt-1 text-center" style={{ color: "#786464" }}>
          Don't have an account?{" "}
          <Link to="/register">Register here</Link>
        </p>
      </div>

      {/* --- SVG filter engine for the waxy crayon texture edge --- */}
      <svg style={{ display: "none" }}>
        <filter id="crayon-texture">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </div>
  );
}

export default Login;