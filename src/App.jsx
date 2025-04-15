import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./components/layout/layout";
import LoginPage from "./pages/auth/login";
import SignUpPage from "./pages/auth/signup";
import AdminLayout from "./components/admin/layoutAdmin";
import Dashboard from "./pages/admin/Dashboard";
import Song from "./pages/admin/Song";
import Album from "./pages/admin/Album";
import Artist from "./pages/admin/Artist";

function App() {
  const userInfo = useSelector((state) => state.user.userInfo);
  const role = userInfo?.role;

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            role === "ADMIN" ? (
              <AdminLayout />
            ) : role === "USER" ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/song" element={<Song />} />
          <Route path="/artist" element={<Artist />} />
          <Route path="/album" element={<Album />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
