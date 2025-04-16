import React from "react";
import { useSelector } from "react-redux";
import BottomPlayer from "./BottomPlayer";
import PlaylistContent from "../playlist/playlistcontent";
import Rightbar from "../sidebar/rightbar/rightbar";
import Sidebar from "../sidebar/leftbar/sidebar";
import ContentPlaylist from "../listContent/contentPlaylist";
import UserProfile from "../../pages/UserProfile/UserProfile";
import TopBar from "./TopBar";

const Layout = () => {
  const { showPlaylistContent, selectedSong, currentPlaylist } = useSelector(
    (state) => state.playlists
  );

  const renderContent = () => {
    if (selectedSong) {
      return <PlaylistContent type="song" singleSong={selectedSong} />;
    }
    if (showPlaylistContent && currentPlaylist) {
      return <PlaylistContent />;
    }
    return <ContentPlaylist />;
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full z-10">
        <TopBar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden pt-16 pb-16">
        {/* Sidebar */}
        <Sidebar />

        {/* Playlist Content */}
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>

        {/* Rightbar */}
        {/* <Rightbar /> */}
      </div>

      {/* Bottom Player */}
      <div className="fixed bottom-0 left-0 w-full z-10">
        <BottomPlayer />
      </div>
    </div>
  );
};

export default Layout;
