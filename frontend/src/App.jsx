import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import CreateTicket from "./pages/CreateTicket";
import MyTickets from "./pages/MyTickets";
import TicketStats from "./components/TicketStats";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";


function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/tickets/my",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <>
      <Navbar />

      {/* TOP ROW */}
      <div
        style={{
          display: "flex",
          gap: 40,
          maxWidth: 1200,
          margin: "40px auto",
          alignItems: "flex-start",
        }}
      >
        {/* LEFT: STATS BOX */}
        <TicketStats tickets={tickets} />

        {/* RIGHT: CREATE TICKET */}
        <div style={{ flex: 1 }}>
          <CreateTicket onSuccess={fetchTickets} />
        </div>
      </div>

      {/* BOTTOM: TICKETS GRID */}
      <MyTickets tickets={tickets} setTickets={setTickets} />
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
