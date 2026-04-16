import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/admin" : "/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="page-wrapper">
      <style>{`
        .page-wrapper {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #f4f4f4;
          min-height: 100vh;
        }

        .main-content {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .login-card {
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.12);
          width: 100%;
          max-width: 380px;
          text-align: center;
        }

        .error-msg {
          color: red;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          background: #f1f4f9;
          box-sizing: border-box;
        }

        /* ✅ FIXED PASSWORD FIELD */
        .password-group {
          position: relative;
        }

        .password-group input {
          width: 100%;
          padding: 12px 70px 12px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          background: #f1f4f9;
          box-sizing: border-box;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #ff6b35;
          cursor: pointer;
          font-weight: bold;
          font-size: 12px;
        }

        .btn-login {
          width: 100%;
          padding: 12px;
          background-color: #ff6b35;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-login:hover {
          background-color: #e85a28;
        }

        .footer-text {
          margin-top: 15px;
          font-size: 14px;
        }

        .footer-text a {
          color: #4a148c;
        }
      `}</style>

      <main className="main-content">
        <section className="login-card">
          <h2>Login</h2>

          {error && <p className="error-msg">{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD (FIXED) */}
            <div className="form-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button type="submit" className="btn-login">
              Login
            </button>
          </form>

          <p className="footer-text">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
