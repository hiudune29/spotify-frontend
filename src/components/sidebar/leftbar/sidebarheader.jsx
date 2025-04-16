// SidebarHeader.jsx
import React, { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { VscLibrary } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { createPlaylist } from "../../../redux/slice/playlistSlice";
import defaultCover from "../../../assets/default.png"; // Add this import

const SidebarHeader = ({ onToggle, isExpanded }) => {
  const userId = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePlaylist = async () => {
    setIsLoading(true);
    try {
      const newPlaylistData = {
        name: "Playlist mới",
        isPrivate: true,
        description: "Playlist của tôi",
        coverImage: defaultCover, // Using imported default cover image
        isPlaylistLiked: false,
        userId: userId, // Should be dynamic based on logged in user
      };

      await dispatch(createPlaylist(newPlaylistData)).unwrap();
      // Optional: Show success notification
    } catch (error) {
      console.error("Failed to create playlist:", error);
      // Optional: Show error notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2 hover:cursor-pointer hover:text-gray-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition duration-300">
        <VscLibrary className="text-2xl" />
        <h1 className="text-lg font-semibold">Thư viện</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleCreatePlaylist}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
          <span className="text-sm font-semibold">
            {isLoading ? "Đang tạo..." : "Tạo"}
          </span>
        </button>
        <button
          onClick={onToggle}
          className="p-2 rounded-full hover:bg-zinc-800 transition-transform duration-200"
        >
          <ArrowRight
            size={20}
            className={`${
              isExpanded ? "rotate-180" : ""
            } transition-transform duration-300`}
          />
        </button>
      </div>
    </div>
  );
};

export default SidebarHeader;
