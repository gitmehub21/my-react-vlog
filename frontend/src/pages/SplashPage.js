import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const loader = document.querySelector(".loader-container");

      if (loader) {
        loader.classList.add("fade-out");

        setTimeout(() => {
          navigate("/home"); // ✅ FIXED (was "/thefolio")
        }, 500);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .splash-wrapper {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(-45deg, #667eea, #764ba2, #ff6a00, #ee0979);
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
          overflow: hidden;
          color: white;
        }

        @keyframes gradientBG {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }

        .loader-container {
          text-align: center;
          animation: fadeIn 1s ease forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          to {opacity: 1;}
        }

        .logo {
          font-size: 100px;
          margin-bottom: 20px;
          animation: float 3s ease-in-out infinite, glow 2s ease-in-out infinite alternate;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes glow {
          from { text-shadow: 0 0 10px #fff, 0 0 20px #ff6a00, 0 0 30px #ff6a00; }
          to { text-shadow: 0 0 20px #fff, 0 0 30px #ff6a00, 0 0 40px #ff6a00; }
        }

        h1 {
          font-size: 48px;
          margin-bottom: 30px;
          font-weight: 700;
          text-shadow: 2px 2px 10px rgba(0,0,0,0.3);
        }

        .spinner {
          width: 90px;
          height: 90px;
          border: 10px solid rgba(255,255,255,0.2);
          border-top: 10px solid #fff;
          border-radius: 50%;
          margin: 20px auto;
          animation: spin 1s linear infinite, neonPulse 1.5s ease-in-out infinite alternate;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes neonPulse {
          0% { box-shadow: 0 0 10px #fff, 0 0 20px #ff6a00; }
          100% { box-shadow: 0 0 20px #fff, 0 0 40px #ff6a00; }
        }

        .loading-text {
          font-size: 22px;
          margin-top: 15px;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.95);
        }

        .dots span {
          display: inline-block;
          animation: bounceDots 1s infinite;
        }

        .dots span:nth-child(1) { animation-delay: 0s; }
        .dots span:nth-child(2) { animation-delay: 0.2s; }
        .dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounceDots {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
        }

        .fade-out {
          animation: fadeOut 0.5s ease-out forwards;
        }

        @keyframes fadeOut {
          to { opacity: 0; transform: scale(0.95); }
        }
      `}</style>

      {/* ✅ Wrap everything instead of styling BODY */}
      <div className="splash-wrapper">
        <div className="loader-container">
          <div className="logo">🍳</div>
          <h1>Cooking Time</h1>
          <div className="spinner"></div>
          <div className="loading-text">
            Loading
            <span className="dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SplashPage;