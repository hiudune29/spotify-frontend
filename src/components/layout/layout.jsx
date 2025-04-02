import React from "react";
import { Outlet } from "react-router-dom";
import BottomPlayer from "./BottomPlayer";
import "./layout.css";
import PlaylistContent from "../playlist/playlistcontent";
import Rightbar from "../sidebar/rightbar/rightbar";
import Sidebar from "../sidebar/leftbar/sidebar";
import ContentPlaylist from "../listContent/contentPlaylist";
import TopBar from "./TopBar";

const Layout = () => {
  console.log("Layout is rendering"); // Log để debug
  return (
    <div className="layout">
      <TopBar />
      {/* Thêm div bọc phần chính để đảm bảo top-bar không che mất nội dung */}
      <div className="main-container">
        <Sidebar />
        <div className="main-content">
          <PlaylistContent />
          {/* <ContentPlaylist /> */}
          <Outlet /> {/* Điểm render các route con */}
        </div>
        <Rightbar />
      </div>
      <BottomPlayer />
    </div>
  );
};

export default Layout;
