import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const EditPostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setTitle(data.title);
        setBody(data.body);
        setCurrentImage(data.image || "");
      } catch (err) {
        setError("Post not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("body", body);
    if (image) fd.append("image", image);

    try {
      await API.put(`/posts/${id}`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update post");
    }
  };

  const handleCancel = () => {
    navigate(`/posts/${id}`); // or navigate(-1) if you prefer going back
  };

  if (loading) {
    return <div className="edit-page-loading">Loading post...</div>;
  }

  return (
    <div className="edit-page">
      <style>{`
        .edit-page {
          min-height: 100vh;
          background: #f4f6fb;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          font-family: Arial, sans-serif;
        }

        .edit-card {
          width: 100%;
          max-width: 700px;
          background: white;
          padding: 30px;
          border-radius: 14px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .edit-title {
          text-align: center;
          margin-bottom: 20px;
          font-size: 26px;
          font-weight: bold;
          color: #222;
        }

        .error-msg {
          background: #ffe6e6;
          color: #d63031;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 15px;
          text-align: center;
        }

        .current-image {
          margin-bottom: 20px;
          text-align: center;
        }

        .current-image p {
          margin-bottom: 8px;
          color: #555;
        }

        .current-image img {
          width: 100%;
          max-height: 280px;
          object-fit: cover;
          border-radius: 10px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        input, textarea {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          outline: none;
          font-size: 14px;
        }

        textarea {
          resize: none;
        }

        input:focus, textarea:focus {
          border-color: #ff6b35;
        }

        label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          color: #444;
        }

        .file-input {
          padding: 10px;
          background: #fafafa;
          border-radius: 8px;
        }

        .btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          background: #ff6b35;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: 0.2s;
          margin-top: 10px;
        }

        .btn:hover {
          transform: scale(1.02);
        }

        .cancel-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          background: #ccc;
          color: #333;
          font-weight: bold;
          cursor: pointer;
          transition: 0.2s;
          margin-top: 10px;
        }

        .cancel-btn:hover {
          background: #bbb;
          transform: scale(1.02);
        }

        .edit-page-loading {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          color: #555;
        }
      `}</style>

      <div className="edit-card">
        <h2 className="edit-title">Edit Post</h2>

        {error && <div className="error-msg">{error}</div>}

        {currentImage && (
          <div className="current-image">
            <p>Current cover image</p>
            <img
              src={`http://localhost:5000/uploads/${currentImage}`}
              alt="Current cover"
            />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              required
            />
          </div>

          <div className="form-group">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your post here..."
              rows={10}
              required
            />
          </div>

          {user?.role === "admin" && (
            <div className="form-group">
              <label>Replace Cover Image (Admin only)</label>
              <input
                className="file-input"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
          )}

          <button type="submit" className="btn">
            Update Post
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage; 