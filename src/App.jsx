import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import UserProfile from "./pages/UserProfile/UserProfile";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="test" element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
