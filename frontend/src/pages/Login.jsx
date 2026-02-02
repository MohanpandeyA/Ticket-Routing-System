import { Form, Input, Button, Card, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://ticket-routing-system-backend.onrender.com";

function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,   // 🔥 FIXED
        values
      );

      const { token, user } = res.data;

      // Save auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      message.success("Login successful");

      // Role redirect
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      message.error(
        err.response?.data?.error || "Login failed"
      );
    }
  };

  return (
    <Card
      title="Login"
      style={{
        width: 400,
        margin: "100px auto",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      }}
    >
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Invalid email" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter password" },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form>
    </Card>
  );
}

export default Login;
