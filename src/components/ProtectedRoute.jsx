import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isSuperUser }) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Add superuser check here (future step)
  return <Outlet />;
};

export default ProtectedRoute;
