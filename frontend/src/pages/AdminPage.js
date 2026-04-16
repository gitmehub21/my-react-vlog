import { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);

  const [tab, setTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const usersRes = await API.get("/admin/users");
        const postsRes = await API.get("/admin/posts");

        let messagesData = [];
        try {
          const messagesRes = await API.get("/messages");
          messagesData = messagesRes?.data || [];
        } catch (err) {
          console.log("Messages API not ready yet");
        }

        setUsers(usersRes?.data || []);
        setPosts(postsRes?.data || []);
        setMessages(messagesData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user?.role === "admin") {
      fetchData();
    }
  }, [authLoading, user]);

  const toggleUserStatus = async (id) => {
    try {
      setUpdatingUserId(id);

      const { data } = await API.put(`/admin/users/${id}/status`);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, status: data.user.status } : u
        )
      );

      setUpdatingUserId(null);
    } catch (err) {
      setUpdatingUserId(null);
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  const removePost = async (id) => {
    try {
      await API.put(`/admin/posts/${id}/remove`);

      setPosts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, status: "removed" } : p
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove post");
    }
  };

  const toggleMessageRead = async (id) => {
    try {
      const { data } = await API.put(`/messages/${id}/read`);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? data : m))
      );
    } catch {
      alert("Failed to update message");
    }
  };

  const deleteMessage = async (id) => {
    try {
      await API.delete(`/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch {
      alert("Failed to delete message");
    }
  };

  if (authLoading) return <div className="center">Checking auth...</div>;
  if (!user) return <div className="center">Loading user...</div>;
  if (user.role !== "admin")
    return <div className="center error">Access denied</div>;
  if (loading) return <div className="center">Loading dashboard...</div>;
  if (error) return <div className="center error">{error}</div>;

  return (
    <div className="page">
      <style>{`
        .page {
          min-height: 100vh;
          background: #f4f6fb;
          display: flex;
          justify-content: center;
          padding: 40px;
          font-family: Arial;
        }

        .container {
          width: 100%;
          max-width: 1000px;
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
        }

        /* ================= TABS ================= */
        .tabs {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .tab-btn {
          padding: 10px 15px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          background: #ddd;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          transform: translateY(-2px);
          background: #cfcfcf;
        }

        .tab-btn:active {
          transform: scale(0.95);
        }

        .tab-btn.active {
          background: #111;
          color: white;
        }

        /* ================= CARD ================= */
        .card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 12px;
          border-top: 1px solid #eee;
          text-align: left;
        }

        th {
          background: #fafafa;
        }

        /* ================= BUTTONS ================= */
        .btn {
          padding: 6px 10px;
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .btn-red { background: #e74c3c; }
        .btn-green { background: #2ecc71; }

        /* ✨ ANIMATIONS */
        .btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
        }

        .btn:active {
          transform: scale(0.92);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* ================= CENTER ================= */
        .center {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .error { color: red; }
      `}</style>

      <div className="container">
        <h1>Admin Dashboard</h1>

        {/* TABS */}
        <div className="tabs">
          <button
            className={`tab-btn ${tab === "users" ? "active" : ""}`}
            onClick={() => setTab("users")}
          >
            Members ({users.length})
          </button>

          <button
            className={`tab-btn ${tab === "posts" ? "active" : ""}`}
            onClick={() => setTab("posts")}
          >
            Posts ({posts.length})
          </button>

          <button
            className={`tab-btn ${tab === "messages" ? "active" : ""}`}
            onClick={() => setTab("messages")}
          >
            Messages ({messages.length})
          </button>
        </div>

        {/* USERS */}
        {tab === "users" && (
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span style={{ color: u.status === "active" ? "green" : "red" }}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn ${u.status === "active" ? "btn-red" : "btn-green"}`}
                        onClick={() => toggleUserStatus(u._id)}
                        disabled={updatingUserId === u._id}
                      >
                        {u.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* POSTS */}
        {tab === "posts" && (
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {posts.map((p) => (
                  <tr key={p._id}>
                    <td>{p.title}</td>
                    <td>{p.author?.name}</td>
                    <td>{p.status}</td>
                    <td>
                      <button className="btn btn-red" onClick={() => removePost(p._id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MESSAGES */}
        {tab === "messages" && (
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {messages.map((m) => (
                  <tr key={m._id}>
                    <td>{m.fullName}</td>
                    <td>{m.email}</td>
                    <td>{m.message}</td>
                    <td>{m.isRead ? "Read" : "Unread"}</td>
                    <td>
                      <button className="btn btn-green" onClick={() => toggleMessageRead(m._id)}>
                        Toggle
                      </button>

                      <button className="btn btn-red" onClick={() => deleteMessage(m._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}