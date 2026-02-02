import { Card, Statistic } from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
} from "@ant-design/icons";

function TicketStats({ tickets }) {
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "open").length;
  const resolved = tickets.filter((t) => t.status === "resolved").length;
  const highPriority = tickets.filter((t) => t.priority === "high").length;

  return (
    <Card
      title="📊 Ticket Summary"
      style={{
        width: 320,
        borderRadius: 12,
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
      }}
    >
      <Statistic
        title="Total Tickets"
        value={total}
        prefix={<FileTextOutlined />}
      />
      <Statistic
        title="Open Tickets"
        value={open}
        prefix={<ClockCircleOutlined />}
        style={{ marginTop: 16 }}
      />
      <Statistic
        title="Resolved Tickets"
        value={resolved}
        prefix={<CheckCircleOutlined />}
        style={{ marginTop: 16 }}
      />
      <Statistic
        title="High Priority"
        value={highPriority}
        prefix={<FireOutlined />}
        style={{ marginTop: 16 }}
      />
    </Card>
  );
}

export default TicketStats;
