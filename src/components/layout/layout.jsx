import React from "react";
import { Outlet } from "react-router-dom";
import BottomPlayer from "./BottomPlayer";
import "./layout.css";
import PlaylistContent from "../playlist/playlistcontent";
import Rightbar from "../sidebar/rightbar/rightbar";
import Sidebar from "../sidebar/leftbar/sidebar";
import ContentPlaylist from "../listContent/contentPlaylist";
const Layout = () => {
  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <PlaylistContent />
        {/* <ContentPlaylist /> */}
      </div>
      <Rightbar />
      <BottomPlayer />
    </div>
  );
};

export default Layout;
