import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Thêm useSelector
import {
  togglePlaylistContent,
  clearSelectedSong,
  resetPlaylistState,
} from "../../redux/slice/playlistSlice";
import { Home, Search } from "lucide-react";
import "./TopBar.css";
import avatar from "../../assets/avatar.png";

// Left Icon Group Component
const LeftIconGroup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSpotifyClick = () => {
    navigate("/");
    dispatch(togglePlaylistContent(false));
  };

  return (
    <div className="left-icons">
      <button className="top-bar-icon" onClick={handleSpotifyClick}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.375 16.875c-.621.621-1.551.621-2.172 0l-3.664-3.664a.75.75 0 0 0-1.058 0L8.797 16.875c-.621.621-1.551.621-2.172 0-.621-.621-.621-1.551 0-2.172l3.664-3.664a.75.75 0 0 0 0-1.058L6.625 6.297c-.621-.621-.621-1.551 0-2.172.621-.621 1.551-.621 2.172 0l3.664 3.664a.75.75 0 0 0 1.058 0l3.664-3.664c.621-.621 1.551-.621 2.172 0 .621.621.621 1.551 0 2.172l-3.664 3.664a.75.75 0 0 0 0 1.058l3.664 3.664c.621.621.621 1.551 0 2.172z" />
        </svg>
      </button>
    </div>
  );
};

// Center Section Component (Home + Search Bar)
const CenterSection = () => {
  const [searchQuery, setSearchQuery] = useState("What do you want to play?");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy trạng thái xem có đang xem bài hát đơn lẻ hay không
  const { selectedSong } = useSelector((state) => state.playlists);

  const goToHome = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
    // Reset toàn bộ state
    dispatch(resetPlaylistState());
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value || "What do you want to play?");
  };

  const handleSearchFocus = () => {
    if (searchQuery === "What do you want to play?") {
      setSearchQuery("");
    }
  };

  const handleSearchBlur = () => {
    if (!searchQuery) {
      setSearchQuery("What do you want to play?");
    }
  };

  return (
    <div className="center-section">
      <button
        className={`top-bar-icon ${location.pathname === "/" ? "active" : ""}`}
        onClick={goToHome}
      >
        <Home size={20} />
      </button>
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          className="search-input"
        />
        <button className="search-icon">
          <Search size={16} />
        </button>
      </div>
    </div>
  );
};

// Right Icon Group Component (Profile Icon + Menu)
const RightIconGroup = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="right-icons">
      <button className="profile-icon" onClick={toggleMenu}>
        <img src={avatar} alt="Profile" className="avatar" />
      </button>
      {isMenuOpen && (
        <div className="menu">
          <div className="menu-item">Account</div>
          <div className="menu-item">Profile</div>
          <div className="menu-item" onClick={handleLogout}>
            Log out
          </div>
        </div>
      )}
    </div>
  );
};

// Main TopBar Component
const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="top-bar-content">
        <LeftIconGroup />
        <CenterSection />
        <RightIconGroup />
      </div>
    </div>
  );
};

export default TopBar;
