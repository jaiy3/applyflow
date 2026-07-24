import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Applications from "./pages/applications/Applications";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      

  <Route
    path="/applications"
    element={
      <ProtectedRoute>
        <Applications />
      </ProtectedRoute>
    }
  />

    <Route path="*" element={<NotFound />} />
  </Routes>
  );
}