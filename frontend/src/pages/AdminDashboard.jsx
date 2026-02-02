import { useEffect, useState } from "react";
import { Tag, Spin, message, Button } from "antd";
import { useNavigate } from "react-router-dom";

const API_URL = "https://ticket-routing-system-backend.onrender.com";

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: ""
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchAllTickets = async () => {
    try {
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.search) params.append("search", filters.search);

      const res = await fetch(
        `${API_URL}/api/tickets?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error("Admin fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const markResolved = async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/api/tickets/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "resolved" }),
        }
      );

      const updated = await res.json();

      setTickets((prev) =>
        prev.map((t) => (t._id === id ? updated : t))
      );

      message.success("Ticket resolved");
    } catch {
      message.error("Failed to update ticket");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Admin Dashboard</h2>

        <Button danger onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* FILTER BAR */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <select
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value }))
          }
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          onChange={(e) =>
            setFilters((f) => ({ ...f, priority: e.target.value }))
          }
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          placeholder="Search title..."
          style={{ padding: 6 }}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value }))
          }
        />

        <Button type="primary" onClick={fetchAllTickets}>
          Apply
        </Button>
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            style={{
              padding: 16,
              borderRadius: 12,
              background: "#fff",
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            }}
          >
            <h3>{ticket.title}</h3>
            <p style={{ color: "#555" }}>{ticket.description}</p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Tag color="blue">{ticket.category}</Tag>
              <Tag
                color={
                  ticket.priority === "high"
                    ? "red"
                    : ticket.priority === "medium"
                    ? "orange"
                    : "green"
                }
              >
                {ticket.priority}
              </Tag>
              <Tag color="purple">{ticket.assignedQueue}</Tag>
              <Tag>{ticket.status}</Tag>
            </div>

            {ticket.status === "open" && (
              <Button
                type="primary"
                size="small"
                style={{ marginTop: 10 }}
                onClick={() => markResolved(ticket._id)}
              >
                Resolve
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
