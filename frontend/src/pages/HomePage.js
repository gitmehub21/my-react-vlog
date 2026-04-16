import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleReact = async (id) => {
    try {
      const { data } = await API.post(`/posts/${id}/react`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, reactions: data.reactions } : p
        )
      );
    } catch {
      alert("Failed to react");
    }
  };

  const handleComment = async (id, text) => {
    try {
      const { data } = await API.post(`/posts/${id}/comment`, { text });
      setPosts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, comments: data.comments } : p
        )
      );
    } catch {
      alert("Failed to comment");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete post");
    }
  };

  if (loading) {
    return <div className="loading">Loading TheFolio Posts...</div>;
  }

  return (
    <div className="page-wrapper">
      <style>{`
        .page-wrapper {
          font-family: Arial;
          min-height: 100vh;
          padding-top: 60px;
          display: flex;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .bg-slider {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -2;
        }

        .bg-slide {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          animation: fadeBG 20s infinite;
        }

        .bg-slide:nth-child(1) { animation-delay: 0s; }
        .bg-slide:nth-child(2) { animation-delay: 5s; }
        .bg-slide:nth-child(3) { animation-delay: 10s; }
        .bg-slide:nth-child(4) { animation-delay: 15s; }

        @keyframes fadeBG {
          0% { opacity: 0; }
          10% { opacity: 1; }
          25% { opacity: 1; }
          35% { opacity: 0; }
          100% { opacity: 0; }
        }

        .bg-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.35);
          z-index: -1;
        }

        .container {
          width: 100%;
          max-width: 700px;
          position: relative;
          z-index: 1;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        h2 {
          margin: 0;
          color: white;
        }

        .post-grid {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .post-card {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(6px);
          border-radius: 10px;
          padding: 15px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        .post-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
        }

        .content h3 a {
          text-decoration: none;
          color: #111;
        }

        .meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #777;
          margin-top: 10px;
        }

        .author {
          color: #ff6b35;
          font-weight: bold;
        }

        .react-btn {
          background: #ff6b35;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
        }

        .bottom-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 12px;
        }

        .edit-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
        }

        .delete-btn {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
        }

        .comment-box input {
          width: 90%;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #ccc;
          margin-top: 10px;
        }

        .comment {
          margin-top: 5px;
          font-size: 13px;
          background: #f2f2f2;
          padding: 6px;
          border-radius: 6px;
        }

        .empty {
          text-align: center;
          margin-top: 40px;
          color: white;
        }
      `}</style>

      {/* ✅ BACKGROUND IMAGES (FIXED) */}
      <div className="bg-slider">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836" className="bg-slide" alt="" />
        <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061" className="bg-slide" alt="" />
        <img src="https://images.unsplash.com/photo-1525755662778-989d0524087e" className="bg-slide" alt="" />
        <img src="https://images.unsplash.com/photo-1506089676908-3592f7389d4d" className="bg-slide" alt="" />
      </div>

      <div className="bg-overlay"></div>

      <div className="container">
        <div className="header">
          <h2>Latest Discoveries</h2>
        </div>

        {posts.length === 0 ? (
          <div className="empty">No posts yet 😢</div>
        ) : (
          <div className="post-grid">
            {posts.map((post) => (
              <div key={post._id} className="post-card">

                {post.image && (
                  <img
                    className="post-image"
                    src={`http://localhost:5000/uploads/${post.image}`}
                    alt={post.title}
                  />
                )}

                <div className="content">
                  <h3>
                    <Link to={`/posts/${post._id}`}>{post.title}</Link>
                  </h3>

                  <p>
                    {post.body?.length > 120
                      ? post.body.substring(0, 120) + "..."
                      : post.body}
                  </p>

                  <button
                    className="react-btn"
                    onClick={() => handleReact(post._id)}
                  >
                    ❤️ {post.reactions?.length || 0}
                  </button>

                  <div className="comment-box">
                    <input
                      placeholder="Write a comment..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleComment(post._id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>

                  {post.comments?.map((c, i) => (
                    <div key={i} className="comment">
                      💬 {c.text}
                    </div>
                  ))}

                  {(user?.role === "admin" ||
                    user?._id === post.author?._id) && (
                    <div className="bottom-actions">
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/edit-post/${post._id}`)}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(post._id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  )}

                  <div className="meta">
                    <span>
                      By <span className="author">
                        {post.author?.name || "Anonymous"}
                      </span>
                    </span>

                    <span>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;