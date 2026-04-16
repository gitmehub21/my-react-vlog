import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await API.post("/auth/reset-password", {
        token,
        password,
      });

      setMessage("Password reset successful!");

      // redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to reset password"
      );
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2>Reset Password</h2>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Reset Password
          </button>
        </form>

        <p style={{ marginTop: "10px" }}>
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f4f4f4",
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    width: "350px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#ff6b35",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ResetPasswordPage;