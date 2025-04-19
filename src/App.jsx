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
import Song from "./pages/admin/song/Song";
import Album from "./pages/admin/album/Album";
import Artist from "./pages/admin/artist/Artist";
import Playlist from "./pages/admin/playlist/Playlist";
import CreateSong from "./pages/admin/song/CreateSong";
import UpdateSong from "./pages/admin/song/UpdateSong";
import CreateAlbum from "./pages/admin/album/CreateAlbum";
import UpdateAlbum from "./pages/admin/album/UpdateAlbum";
import CreateArtist from "./pages/admin/artist/CreateArtist";
import UpdateArtist from "./pages/admin/artist/UpdateArtist";
import CreatePlaylist from "./pages/admin/playlist/CreatePlaylist";
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
            // <ProtectedAdminRoute>
            <AdminLayout />
            // </ProtectedAdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="song" element={<Song />} />
          <Route path="song/create" element={<CreateSong />} />
          <Route path="song/update" element={<UpdateSong />} />
          <Route path="artist" element={<Artist />} />
          <Route path="artist/create" element={<CreateArtist />} />
          <Route path="artist/update" element={<UpdateArtist />} />
          <Route path="album" element={<Album />} />
          <Route path="album/create" element={<CreateAlbum />} />
          <Route path="album/update" element={<UpdateAlbum />} />
          <Route path="playlist" element={<Playlist />} />
          <Route path="playlist/create" element={<CreatePlaylist />} />
          {/* <Route path="users" element={<Users />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
