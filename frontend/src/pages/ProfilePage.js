import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const ProfilePage = () => {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [pic, setPic] = useState(null);

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= PROFILE UPDATE =================
  const handleProfile = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("name", name);
      fd.append("bio", bio);

      if (pic) {
        fd.append("profilePic", pic);
      }

      // ❌ IMPORTANT FIX: DO NOT set Content-Type manually
      const { data } = await API.put("/auth/profile", fd);

      setUser(data);
      setMsg("Profile updated successfully!");
      setPic(null);
    } catch (err) {
      console.log(err);
      setMsg(err.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const picSrc = user?.profilePic
    ? `http://localhost:5000/uploads/${user.profilePic}`
    : "https://via.placeholder.com/120";

  if (!user) {
    return <div className="center">Loading profile...</div>;
  }

  return (
    <div className="profile-wrapper">
      <style>{`
        .profile-wrapper {
          min-height: 100vh;
          padding: 100px 20px;
          background: #f4f4f4;
          display: flex;
          justify-content: center;
          font-family: Arial;
        }

        .profile-card {
          width: 100%;
          max-width: 600px;
          background: white;
          border-radius: 14px;
          padding: 25px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        }

        .profile-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .profile-pic {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #ff6b35;
          margin-bottom: 10px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        input, textarea {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #ff6b35;
        }

        button {
          padding: 10px;
          background: #ff6b35;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.2s;
        }

        button:hover {
          background: #e85a28;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .msg {
          text-align: center;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .center {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
      `}</style>

      <div className="profile-card">
        <div className="profile-header">
          <img src={picSrc} alt="Profile" className="profile-pic" />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>

        {msg && <div className="msg">{msg}</div>}

        <form onSubmit={handleProfile}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            rows={4}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPic(e.target.files[0])}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;