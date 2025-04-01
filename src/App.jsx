import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import "./App.scss";
import LoginPage from "./pages/auth/login";
import SignUpPage from "./pages/auth/signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Các route con sẽ được render bên trong Layout qua Outlet */}
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route index element={<div>Trang chủ (Home Page)</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
