import { useState } from "react";
import API from "../api/axios";

const ContactPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!form.fullName.trim() || !form.email.trim() || !form.message.trim()) {
      setError(true);
      setSuccess(false);
      return;
    }

    try {
      setLoading(true);

      await API.post("/messages", form);

      setSuccess(true);
      setError(false);

      setForm({ fullName: "", email: "", message: "" });

      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
        }

        .page-wrapper {
          min-height: 100vh;
          width: 100vw;

          display: flex;
          justify-content: center;
          align-items: center;

          font-family: Arial;
          position: relative;

          /* 🌄 IMAGE BACKGROUND */
          background: url("https://images.unsplash.com/photo-1521791136064-7986c2920216")
            center/cover no-repeat;
        }

        /* 🌑 DARK OVERLAY */
        .page-wrapper::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
        }

        /* GLASS CARD */
        .card {
          position: relative;
          z-index: 1;

          width: 100%;
          max-width: 400px;
          padding: 35px;

          border-radius: 16px;

          backdrop-filter: blur(12px);
          background: rgba(255,255,255,0.12);

          box-shadow: 0 8px 30px rgba(0,0,0,0.3);

          color: white;

          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        h2 {
          text-align: center;
          margin-bottom: 15px;
        }

        input, textarea {
          width: 100%;
          padding: 12px;
          margin-top: 10px;

          border-radius: 8px;
          border: none;

          background: rgba(255,255,255,0.2);
          color: white;

          outline: none;
        }

        input::placeholder,
        textarea::placeholder {
          color: rgba(255,255,255,0.7);
        }

        input:focus,
        textarea:focus {
          background: rgba(255,255,255,0.3);
        }

        button {
          width: 100%;
          padding: 12px;
          margin-top: 15px;

          border: none;
          border-radius: 8px;

          background: ${loading ? "#999" : "#ff6b35"};
          color: white;

          font-weight: bold;
          cursor: pointer;

          transition: 0.25s ease;
        }

        button:hover {
          transform: translateY(-2px);
        }

        button:active {
          transform: scale(0.95);
        }

        .msg {
          text-align: center;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .success {
          color: #00ffae;
        }

        .error {
          color: #ff4d4d;
        }
      `}</style>

      <div className="card">
        <h2>Contact Us</h2>

        {success && <p className="msg success">Message Sent! ✅</p>}
        {error && <p className="msg error">Please fill all fields!</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <textarea
            name="message"
            placeholder="Your message..."
            value={form.message}
            onChange={handleChange}
            rows={5}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;