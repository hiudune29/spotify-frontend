import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import BottomPlayer from "./BottomPlayer";
import "./layout.css";

const Layout = () => {
  return (
    <div className="layout">
      <TopBar />
      <main>
        <Outlet />
      </main>
      <BottomPlayer />
    </div>
  );
};

export default Layout;
