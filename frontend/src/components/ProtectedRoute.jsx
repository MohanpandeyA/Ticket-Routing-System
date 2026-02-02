import { Navigate } from "react-router-dom";
import { getUser, isAuthenticated } from "../utils/auth";

function ProtectedRoute({ children, role }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const user = getUser();

  if (role && user?.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
