import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="page">
      <style>{`
        .page {
          min-height: 100vh;
          background: #f4f6fb;
          display: flex;
          justify-content: center;
          padding: 40px 20px;
          font-family: Arial, sans-serif;
        }

        /* ✅ CENTER CONTAINER PROPERLY */
        .container {
          width: 100%;
          max-width: 1000px;

          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .top-bar {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        h2 {
          margin: 0;
          color: #222;
        }

        /* ✅ CENTER GRID */
        .posts-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          justify-content: center;
        }

        .post-card {
          background: white;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);

          display: flex;
          flex-direction: column;
          justify-content: space-between;

          min-height: 160px;
        }

        .post-card h3 {
          margin-bottom: 10px;
          color: #111;
          text-align: center;
        }

        .post-card p {
          color: #555;
          font-size: 14px;
          text-align: center;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 10px;
        }

        .edit-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          text-decoration: none;
        }

        .delete-btn {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
        }

        .empty {
          text-align: center;
          color: #666;
          margin-top: 40px;
        }
      `}</style>

      <div className="container">
        <div className="top-bar">
          <h2>Latest Posts</h2>
        </div>

        {posts.length === 0 ? (
          <p className="empty">No posts available.</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.body?.slice(0, 120)}...</p>
                </div>

                {(user?.role === "admin" ||
                  user?._id === post.author?._id) && (
                  <div className="action-buttons">
                    <a href={`/edit-post/${post._id}`} className="edit-btn">
                      Edit
                    </a>

                    <button
                      onClick={() => handleDelete(post._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage;