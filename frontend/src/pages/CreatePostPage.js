import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", title);
    fd.append("body", body);
    if (image) fd.append("image", image);

    try {
      const { data } = await API.post("/posts", fd);
      setSuccess("Post created!");

      setTimeout(() => {
        navigate(`/posts/${data._id}`);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish post");
    }
  };

  // ✅ CANCEL HANDLER
  const handleCancel = () => {
    const confirmLeave = window.confirm(
      "Are you sure you want to cancel? Your post will not be saved."
    );

    if (confirmLeave) {
      navigate(-1); // go back to previous page
    }
  };

  return (
    <div className="create-wrapper">
      <style>{`
        .create-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding-top: 80px;
          background: #f4f4f4;
          font-family: Arial;
        }

        .create-card {
          width: 100%;
          max-width: 650px;
          background: white;
          padding: 30px;
          border-radius: 14px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);

          display: flex;
          flex-direction: column;
        }

        h2 {
          text-align: center;
          margin-bottom: 5px;
          color: #333;
        }

        .subtitle {
          text-align: center;
          font-size: 13px;
          color: #777;
          margin-bottom: 20px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        input, textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
        }

        textarea {
          resize: none;
          min-height: 180px;
        }

        input:focus, textarea:focus {
          border-color: #ff6b35;
        }

        .upload {
          border: 2px dashed #ddd;
          padding: 12px;
          border-radius: 10px;
          text-align: center;
          background: #fafafa;
        }

        .btn-group {
          display: flex;
          gap: 10px;
          margin-top: 5px;
        }

        .publish-btn {
          flex: 1;
          padding: 12px;
          background: #ff6b35;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
        }

        .publish-btn:hover {
          background: #e85a28;
        }

        .cancel-btn {
          flex: 1;
          padding: 12px;
          background: #777;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
        }

        .cancel-btn:hover {
          background: #555;
        }

        .error {
          background: #ffe5e5;
          color: red;
          padding: 10px;
          border-radius: 8px;
          font-size: 13px;
          text-align: center;
        }

        .success {
          background: #e8f5e9;
          color: green;
          padding: 10px;
          border-radius: 8px;
          font-size: 13px;
          text-align: center;
        }
      `}</style>

      <div className="create-card">
        <h1>Create Post</h1>
        <p className="subtitle">Share your ideas with the world</p>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            required
          />

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your post..."
            required
          />

          {user?.role === "admin" && (
            <div className="upload">
              <label>Upload Cover Image (Admin only)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
          )}

          {/* ✅ BUTTONS */}
          <div className="btn-group">
            <button type="submit" className="publish-btn">
              Publish
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;