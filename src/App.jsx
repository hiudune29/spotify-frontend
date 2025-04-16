import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import LoginPage from "./pages/auth/login";
import SignUpPage from "./pages/auth/signup";
import AdminLayout from "./components/admin/layoutAdmin";
import Dashboard from "./pages/admin/Dashboard";
import Song from "./pages/admin/Song";
import Album from "./pages/admin/album/Album";
import Artist from "./pages/admin/artist/Artist";
import CreateAlbum from "./pages/admin/album/CreateAlbum";
import UpdateAlbum from "./pages/admin/album/UpdateAlbum";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="song" element={<Song />} />
          <Route path="artist" element={<Artist />}>
            {/* <Route path="create" element={<div>Create Artist</div>} />
            <Route path="update" element={<div>Update Artist</div>} /> */}
          </Route>

          <Route path="album" element={<Album />} />
          <Route path="album/create" element={<CreateAlbum />} />
          <Route path="album/update" element={<UpdateAlbum />} />
          {/* <Route path="playlists" element={<Playlists />} />
          <Route path="users" element={<Users />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
