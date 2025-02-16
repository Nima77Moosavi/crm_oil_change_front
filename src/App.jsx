import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/Admin/AdminLayout";
import ServicesManagement from "./components/Admin/ServicesManagement/ServicesManagement";
import InventoryManagement from "./components/Admin/InventoryManagement/InventoryManagement";
import AppointmentsManagement from "./components/Admin/AppointmentsManagement/AppointmentsManagement";
import CustomersManagement from "./components/Admin/CustomersManagement/CustomersManagement";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/admin" replace /> : <Login />
          }
        />
        <Route element={<ProtectedRoute isSuperuser={true} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/customers" element={<CustomersManagement />} />
            <Route path="/admin/services" element={<ServicesManagement />} />
            <Route path="/admin/inventory" element={<InventoryManagement />} />
            <Route
              path="/admin/appointments"
              element={<AppointmentsManagement />}
            />
            <Route
              path="/admin"
              element={<Navigate to="/admin/services" replace />}
            />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
