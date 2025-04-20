import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  togglePlaylistContent,
  clearSelectedSong,
  resetPlaylistState,
} from "../../redux/slice/playlistSlice";
import {
  setSearchQuery,
  clearSearchQuery,
  setShowUserProfile,
  setShowPlaylist,
} from "../../redux/slice/searchSlice";
import { Home, Search } from "lucide-react";
import "./TopBar.css";

// Left Icon Group Component
const LeftIconGroup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSpotifyClick = () => {
    navigate("/");
    dispatch(togglePlaylistContent(false));
    dispatch(clearSearchQuery());
    dispatch(setShowUserProfile(false));
    dispatch(setShowPlaylist({ show: false, playlist: null })); // Reset playlist
  };

  return (
    <div className="left-icons">
      <button className="top-bar-icon" onClick={handleSpotifyClick}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="#1DB954">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      </button>
    </div>
  );
};

// Center Section Component (Home + Search Bar)
const CenterSection = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedSong } = useSelector((state) => state.playlists);
  const { searchQuery } = useSelector((state) => state.search);

  const goToHome = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
    dispatch(resetPlaylistState());
    dispatch(clearSearchQuery());
    dispatch(setShowUserProfile(false));
    dispatch(setShowPlaylist({ show: false, playlist: null })); // Reset playlist
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
    dispatch(setShowUserProfile(false));
    dispatch(setShowPlaylist({ show: false, playlist: null })); // Reset playlist
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  return (
    <div className="center-section">
      <button
        className={`top-bar-icon ${location.pathname === "/" ? "active" : ""}`}
        onClick={goToHome}
      >
        <Home size={20} />
      </button>
      <div className={`search-container ${isSearchFocused ? "focused" : ""}`}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          placeholder="What do you want to play?"
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
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProfileClick = () => {
    dispatch(setShowUserProfile(true));
    dispatch(clearSearchQuery());
    dispatch(setShowPlaylist({ show: false, playlist: null })); // Reset playlist
    setIsMenuOpen(false);
  };

  return (
    <div className="right-icons">
      <button className="profile-icon" onClick={toggleMenu}>
        <img
          src={userInfo?.avatar || "https://i.pravatar.cc/300"}
          alt="Profile"
          className="avatar"
        />
      </button>
      {isMenuOpen && (
        <div className="menu">
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
