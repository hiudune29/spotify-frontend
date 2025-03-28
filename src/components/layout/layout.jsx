import React from "react";
import { Outlet } from "react-router-dom";
import PlaylistContent from "../playlist/playlistcontent";
import Rightbar from "../sidebar/rightbar/rightbar";
import Sidebar from "../sidebar/leftbar/sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1">
        <PlaylistContent />
      </div>
      {/* <Rightbar /> */}
    </div>
  );
};

export default Layout;
