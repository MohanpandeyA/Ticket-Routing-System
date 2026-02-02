import { Form, Input, Button, Card, message, Tag, Divider } from "antd";
import { useState } from "react";
import axios from "axios";

const { TextArea } = Input;
const API_URL = "https://ticket-routing-system-backend.onrender.com";

function CreateTicket({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [form] = Form.useForm();

  const submitTicket = async (values) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/api/tickets`,   // 🔥 FIXED
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data);
      form.resetFields();
      message.success("Ticket submitted successfully");

      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {
      console.error(err);
      message.error("Failed to submit ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Create Support Ticket"
      style={{
        width: 520,
        borderRadius: 12,
        boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
      }}
    >
      <Form form={form} layout="vertical" onFinish={submitTicket}>
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: "Please enter title" },
            { min: 5, message: "Title must be at least 5 characters" },
          ]}
        >
          <Input placeholder="Issue title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please enter description" },
            { min: 15, message: "Description must be at least 15 characters" },
          ]}
        >
          <TextArea rows={4} placeholder="Describe the issue" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block>
          Submit Ticket
        </Button>
      </Form>

      {result && (
        <Card style={{ marginTop: 24 }} type="inner" title="Assigned Details">
          <Divider />

          <p>
            <b>Category:</b>{" "}
            <Tag color="blue">{result.category}</Tag>
          </p>

          <p>
            <b>Priority:</b>{" "}
            <Tag
              color={
                result.priority === "high"
                  ? "red"
                  : result.priority === "medium"
                  ? "orange"
                  : "green"
              }
            >
              {result.priority}
            </Tag>
          </p>

          <p>
            <b>Queue:</b>{" "}
            <Tag color="purple">{result.assignedQueue}</Tag>
          </p>
        </Card>
      )}
    </Card>
  );
}

export default CreateTicket;
