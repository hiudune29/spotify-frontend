import React, { useState } from "react";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import SpotifyIcon from "../ui/spotify-icon";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Tổng quan", "dashboard", <PieChartOutlined />),
  getItem("Bài hát", "song", <PieChartOutlined />),
  getItem("Nghệ sĩ", "", <DesktopOutlined />, [
    getItem("Danh sách nghệ sĩ", "artist"),
    getItem("Thêm nghệ sĩ", "add-artist"),
    getItem("Cập nhật nghệ sĩ", "update-artist"),
  ]),
  getItem("Album/EP", "", <DesktopOutlined />, [
    getItem("Danh sách Album/EP", "album"),
    getItem("Thêm Album/EP", "add-album"),
    getItem("Cập nhật nghệ sĩ", "update-album"),
  ]),
  getItem("Danh sách phát", "playlist", <DesktopOutlined />),
];
const pageTitles = {
  dashboard: "Tổng quan",
  song: "Danh sách Bài hát",
  artist: "Danh sách Nghệ sĩ",
  album: "Danh sách Album",
  playlist: "Danh sách phát",
};

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation(); // <-- Lấy URL hiện tại
  const navigate = useNavigate(); // <-- Để điều hướng khi click menu

  const path = location.pathname.split("/")[2] || "dashboard";
  // Giả sử path là /admin/songs => lấy "songs"

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo p-2">
          <SpotifyIcon />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[path]} // <-- Auto select theo route hiện tại
          onClick={({ key }) => navigate(`/admin/${key}`)} // <-- Điều hướng khi click
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: "0 24px", background: colorBgContainer }}>
          <h1 className="text-xl font-bold py-4">{pageTitles[path]}</h1>
        </Header>
        <Content style={{ margin: "10px 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
