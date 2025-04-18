import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo, clearUser } from "../../redux/slice/userSlice";
import BottomPlayer from "./BottomPlayer";
import PlaylistContent from "../playlist/playlistcontent";
import Sidebar from "../sidebar/leftbar/sidebar";
import ContentPlaylist from "../listContent/contentPlaylist";
import UserProfile from "../../pages/UserProfile/UserProfile";
import TopBar from "./TopBar";
import Result_Searched from "../playlist/Result_Searched";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, userId, loading, error } = useSelector(
    (state) => state.user
  );
  const { showPlaylistContent, selectedSong, currentPlaylist } = useSelector(
    (state) => state.playlists
  );
  const { searchQuery, showUserProfile, showPlaylist, selectedPlaylist } =
    useSelector((state) => state.search);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(fetchUserInfo());
  }, [dispatch, navigate]);

  useEffect(() => {
    if (error) {
      handleLogout();
    } else if (!userInfo && !loading) {
      navigate("/login");
    }
  }, [error, userInfo, loading, navigate]);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
  };

  const renderContent = () => {
    // Ưu tiên hiển thị PlaylistContent nếu showPlaylist
    if (showPlaylist && selectedPlaylist) {
      return <PlaylistContent type="playlist" />;
    }
    // Hiển thị Result_Searched nếu có searchQuery
    if (searchQuery) {
      return <Result_Searched />;
    }
    // Hiển thị UserProfile nếu showUserProfile
    if (showUserProfile) {
      return <UserProfile />;
    }
    // Logic hiện tại
    if (selectedSong) {
      return <PlaylistContent type="song" singleSong={selectedSong} />;
    }
    if (showPlaylistContent && currentPlaylist) {
      return <PlaylistContent />;
    }
    return <ContentPlaylist />;
  };

  if (loading) {
    return <p className="text-white text-center">Đang tải...</p>;
  }

  if (!userInfo) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="fixed top-0 left-0 w-full z-10">
        <TopBar userInfo={userInfo} userId={userId} onLogout={handleLogout} />
      </div>
      <div className="flex flex-1 overflow-hidden pt-16 pb-16">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </div>
      <div className="fixed bottom-0 left-0 w-full z-10">
        <BottomPlayer />
      </div>
    </div>
  );
};

export default Layout;
