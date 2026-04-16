const AboutPage = () => {
  return (
    <div className="page-wrapper">
      <style>{`
        /* 🚨 REMOVE DEFAULT BROWSER GAPS */
        html, body {
          margin: 0;
          padding: 0;
        }

        .page-wrapper {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

          /* FULL SCREEN FIX */
          width: 100vw;
          min-height: 100vh;

          color: white;
          position: relative;
          overflow-x: hidden;

          /* 🌄 IMAGE BACKGROUND */
          background: url("https://images.unsplash.com/photo-1504674900247-0877df9cc836")
            center/cover no-repeat;
        }

        /* 🌑 DARK OVERLAY */
        .page-wrapper::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
        }

        /* CONTENT ABOVE OVERLAY */
        .content-container {
          position: relative;
          z-index: 1;

          max-width: 800px;
          margin: 0 auto;

          /* FIX GAP ISSUE HERE */
          padding: 80px 20px 40px;

          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        /* CARD STYLE */
        .info-card {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }

        .info-card h2 {
          text-align: center;
          margin-bottom: 25px;
        }

        .profile-img {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          margin: 0 auto 20px;
          border: 4px solid white;
        }

        .about-text {
          text-align: center;
          line-height: 1.7;
          max-width: 600px;
          margin: 0 auto 15px;
        }

        .skills-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          list-style: none;
          padding: 0;
          margin-top: 20px;
        }

        .skills-list li {
          background: rgba(255,255,255,0.15);
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          font-weight: bold;
          transition: 0.3s;
        }

        .skills-list li:hover {
          background: white;
          color: black;
          transform: scale(1.05);
        }

        footer {
          text-align: center;
          padding: 20px;
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* CONTENT (UNCHANGED STRUCTURE) */}
      <main className="content-container">

        <section className="info-card">
          <h2>Cooking Portfolio</h2>

          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            alt="Cooking"
            className="profile-img"
          />

          <p className="about-text">
            Welcome to my cooking portfolio! 🍽️ Here you can explore recipes,
            cooking tips, and food inspirations.
          </p>

          <p className="about-text">
            I love creating simple, delicious meals using easy-to-find ingredients
            to make professional cooking accessible to everyone.
          </p>
        </section>

        <section className="info-card">
          <h2>My Cooking Skills</h2>

          <ul className="skills-list">
            <li>Quick & Easy Recipes</li>
            <li>Baking & Desserts</li>
            <li>Healthy Meal Prep</li>
            <li>Food Presentation</li>
          </ul>
        </section>

      </main>

      <footer>
        © 2026 Student Portfolio · Created with Passion
      </footer>
    </div>
  );
};

export default AboutPage;