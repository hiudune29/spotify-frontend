import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux"; // Thêm useSelector
import Layout from "./components/layout/layout";
import LoginPage from "./pages/auth/login";
import SignUpPage from "./pages/auth/signup";
import AdminLayout from "./components/admin/layoutAdmin";
import Dashboard from "./pages/admin/Dashboard";
import Song from "./pages/admin/Song";
import Album from "./pages/admin/Album";
import Artist from "./pages/admin/Artist";

// Component bảo vệ route cho admin
const ProtectedAdminRoute = ({ children }) => {
  const { role } = useSelector((state) => state.user);

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="song" element={<Song />} />
          <Route path="artist" element={<Artist />} />
          <Route path="album" element={<Album />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
