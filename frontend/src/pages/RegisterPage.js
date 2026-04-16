import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await API.post("/auth/register", form);
      localStorage.setItem("token", data.token);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="page-wrapper">
      <style>{`
        .page-wrapper {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: #f4f4f4;
          min-height: 100vh;
        }

        .main-content {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .auth-card {
          background: white;
          padding: 40px;
          border-radius: 8px;
          width: 100%;
          max-width: 380px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          text-align: center;
        }

        .form-group {
          margin-bottom: 15px;
          position: relative;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          background: #f1f4f9;
        }

        .password-wrapper {
          position: relative;
        }

        .toggle-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #ff6b35;
          font-weight: bold;
          font-size: 12px;
        }

        .btn-submit {
          width: 100%;
          padding: 12px;
          background-color: #ff6b35;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-submit:hover {
          background-color: #e85a28;
        }

        .error-text {
          color: #d32f2f;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .footer-text {
          margin-top: 20px;
          font-size: 14px;
        }

        .footer-text a {
          color: #4a148c;
        }
      `}</style>

      <main className="main-content">
        <div className="auth-card">
          <h2>Create an Account</h2>

          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group password-wrapper">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
                required
                minLength={6}
              />

              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button type="submit" className="btn-submit">
              Register
            </button>
          </form>

          <p className="footer-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;