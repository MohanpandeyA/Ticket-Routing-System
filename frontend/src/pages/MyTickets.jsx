import { Tag, Spin, message, Button, Popconfirm } from "antd";

const API_URL = "https://ticket-routing-system-backend.onrender.com";

function MyTickets({ tickets, setTickets }) {

  if (!tickets) {
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: 40 }}>
        No tickets created yet.
      </p>
    );
  }

  const token = localStorage.getItem("token");

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(
        `${API_URL}/api/tickets/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const updated = await res.json();

      setTickets((prev) =>
        prev.map((t) => (t._id === id ? updated : t))
      );

      message.success("Ticket marked as resolved");
    } catch {
      message.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/api/tickets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTickets((prev) => prev.filter((t) => t._id !== id));
      message.success("Ticket deleted");
    } catch {
      message.error("Failed to delete ticket");
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 24,
        maxWidth: 1200,
        margin: "40px auto",
      }}
    >
      {tickets.map((ticket) => (
        <div
          key={ticket._id}
          style={{
            height: 230,
            padding: 16,
            borderRadius: 12,
            background: "#fff",
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* TITLE + DELETE */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <h3 style={{ margin: 0 }}>{ticket.title}</h3>

            <Popconfirm
              title="Delete this ticket?"
              onConfirm={() => handleDelete(ticket._id)}
            >
              <Button danger size="small">
                Delete
              </Button>
            </Popconfirm>
          </div>

          {/* DESCRIPTION */}
          <div style={{ color: "#555", fontSize: 14, marginTop: 12 }}>
            {ticket.description}
          </div>

          {/* TAGS */}
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
              onClick={() =>
                handleStatusUpdate(ticket._id, "resolved")
              }
            >
              Mark as Resolved
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

export default MyTickets;
