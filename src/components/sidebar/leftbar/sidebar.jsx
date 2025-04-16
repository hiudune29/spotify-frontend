import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarHeader from "./sidebarheader";
import SidebarTabs from "./sidebartab";
import SidebarSearchFilter from "./sidebarfilter";
import SidebarPlaylists from "./playlistsitem";
import { fetchPlaylistsByUserId } from "../../../redux/slice/playlistSlice";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();

  // Fake userId hoặc lấy từ Redux/Auth sau
  const userId = 1;

  useEffect(() => {
    dispatch(fetchPlaylistsByUserId(userId));
  }, [dispatch, userId]);

  const {
    items = [],
    loading,
    error,
  } = useSelector((state) => state.playlists || {});

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const mappedPlaylists = items.map((playlist) => ({
    id: playlist.playlistId,
    title: playlist.name,
    type: "Danh sách phát",
    creator: playlist.user.fullName,
    coverUrl: playlist.coverImage || "/placeholder.svg",
    addedDate: playlist.createAt?.slice(0, 10) || "",
    lastPlayed: "", // nếu muốn, có thể dùng thư viện date-fns để xử lý thời gian
  }));

  return (
    <div
      className={`flex flex-col h-full transition-[width] duration-300 ${
        isExpanded ? "w-[35%]" : "w-[25%]"
      } mx-2 bg-[#121212] rounded-xl text-white`}
    >
      <SidebarHeader onToggle={toggleSidebar} isExpanded={isExpanded} />

      {isExpanded ? (
        <div className="flex items-center justify-between gap-4 px-4 py-2">
          <SidebarTabs />
          <SidebarSearchFilter />
        </div>
      ) : (
        <>
          <SidebarTabs />
          <SidebarSearchFilter isExpanded={false} />
        </>
      )}

      {loading ? (
        <p className="text-center py-4">Đang tải danh sách...</p>
      ) : error ? (
        <p className="text-center py-4 text-red-400">Lỗi: {error}</p>
      ) : (
        <SidebarPlaylists playlists={mappedPlaylists} isExpanded={isExpanded} />
      )}
    </div>
  );
};

export default Sidebar;
