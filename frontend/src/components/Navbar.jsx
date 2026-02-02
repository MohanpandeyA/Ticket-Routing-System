import { Button } from "antd";
import { logout, getUser } from "../utils/auth";

function Navbar() {
  const user = getUser();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        background: "#001529",
        color: "#fff",
      }}
    >
      <h3 style={{ color: "#fff", margin: 0 }}>
        Ticket System
      </h3>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span>
          {user?.email} ({user?.role})
        </span>
        <Button danger onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Navbar;
