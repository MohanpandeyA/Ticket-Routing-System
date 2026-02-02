import { Form, Input, Button, Card, Select, message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

function Register() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/auth/register", values);

      message.success("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      message.error(
        err.response?.data?.error || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Register"
      style={{
        width: 420,
        margin: "100px auto",
        borderRadius: 12,
      }}
    >
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, min: 6 }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label="Register As" name="role" initialValue="user">
          <Select onChange={setRole}>
            <Option value="user">User</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>

        {role === "admin" && (
          <Form.Item
            label="Admin Registration Code"
            name="adminCode"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="Enter admin code" />
          </Form.Item>
        )}

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
        >
          Register
        </Button>
      </Form>
    </Card>
  );
}

export default Register;
