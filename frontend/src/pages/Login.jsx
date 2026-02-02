import { Form, Input, Button, Card, Select, message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const API_URL = "https://ticket-routing-system-backend.onrender.com";

function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      if (isRegister) {
        // REGISTER
        await axios.post(
          `${API_URL}/api/auth/register`,
          values
        );

        message.success("Registered successfully. Please login.");
        setIsRegister(false);
      } else {
        // LOGIN
        const res = await axios.post(
          `${API_URL}/api/auth/login`,
          values
        );

        const { token, user } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        message.success("Login successful");

        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (err) {
      message.error(err.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={isRegister ? "Register" : "Login"}
      style={{
        width: 420,
        margin: "100px auto",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      }}
    >
      <Form layout="vertical" onFinish={onFinish}>
        {isRegister && (
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        )}

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

        {isRegister && (
          <>
            <Form.Item label="Register As" name="role" initialValue="user">
              <Select onChange={setRole}>
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>

            {role === "admin" && (
              <Form.Item
                label="Admin Code"
                name="adminCode"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
            )}
          </>
        )}

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
        >
          {isRegister ? "Register" : "Login"}
        </Button>

        <Button
          type="link"
          block
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </Button>
      </Form>
    </Card>
  );
}

export default Login;
