// frontend/src/pages/ForgotPasswordPage.js

import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios"; // ✅ IMPORTANT

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      // ✅ REAL API CALL
      const { data } = await API.post("/auth/forgot-password", { email });

      setMessage(data.message || "Reset link sent! Check console or email.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to send reset instructions. Try again."
      );
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: "white", padding: "30px", borderRadius: "10px", width: "400px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
        <h2>Forgot Password</h2>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#ff6b35",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            Send Reset Link
          </button>
        </form>

        <p style={{ marginTop: "10px" }}>
          Remember your password? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;