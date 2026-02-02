import { useEffect, useState } from "react";
import { Tag, Spin, message, Button } from "antd";

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchAllTickets = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setTickets(data);
    } catch {
      message.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const markResolved = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/tickets/${id}/status`,
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

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto" }}>
      <h2>Admin Dashboard</h2>

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
