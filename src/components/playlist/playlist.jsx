import { Clock, Play } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { message } from "antd"; // Thêm import message
import {
  setCurrentSong,
  setCurrentSongIndex,
  fetchPlaylistSongs,
} from "../../redux/slice/playlistSlice";

message.config({
  duration: 2,
  maxCount: 3,
  bottom: 100, // Khoảng cách từ bottom lên
});

const Playlist = ({
  songs,
  currentPlayingSongId,
  showOptions = false,
  playlistId,
}) => {
  const dispatch = useDispatch();
  const [activeOptionsId, setActiveOptionsId] = useState(null);
  const menuRef = useRef();

  const handlePlaySong = (song, index) => {
    dispatch(setCurrentSong(song));
    dispatch(setCurrentSongIndex(index));
  };

  const handleViewInfo = (song) => {
    console.log("Thông tin bài hát:", song);
    setActiveOptionsId(null);
  };

  const handleRemoveFromPlaylist = async (song) => {
    try {
      await axios.put("http://localhost:8080/api/playlists/removesong", null, {
        params: {
          playlist: playlistId,
          song: song.songId,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      message.success(`Đã xóa bài hát "${song.songName}" khỏi playlist`);
      dispatch(fetchPlaylistSongs(playlistId));
    } catch (error) {
      console.error("Lỗi khi xóa bài hát khỏi playlist:", error);
      message.error("Không thể xóa bài hát khỏi playlist");
    } finally {
      setActiveOptionsId(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveOptionsId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <table
      className="w-full text-left table-fixed"
      style={{ borderSpacing: "8px 0" }}
    >
      <thead className="text-gray-400 text-sm font-semibold border-b border-gray-700">
        <tr>
          <th className="py-3 w-10 text-center">#</th>
          <th className="py-3 w-[50%]">Tiêu đề</th>
          <th className="py-3 w-[30%]">Ngày thêm</th>
          <th className="py-3 w-[20%] text-center">
            <Clock className="w-4 h-4 inline-block" />
          </th>
        </tr>
      </thead>
      <tbody>
        {songs.map((song, index) => {
          const isPlaying = song.songId === currentPlayingSongId;

          return (
            <tr
              key={song.songId}
              className={`group cursor-pointer text-gray-300 text-sm font-normal border-b border-gray-700 transition ${
                isPlaying
                  ? "bg-gradient-to-r from-[#3f3a4d] to-transparent"
                  : "hover:bg-gradient-to-r hover:from-[#2d2a31] hover:to-transparent"
              }`}
              onDoubleClick={() => handlePlaySong(song, index)}
            >
              <td className="py-3 text-center">
                {isPlaying ? (
                  <Play className="w-4 h-4 text-[#1ed760]" />
                ) : (
                  <>{index + 1}</>
                )}
              </td>
              <td className="py-3 w-[40%]">
                <div className="flex items-center gap-2">
                  <img
                    src={song.img || "https://via.placeholder.com/150"}
                    alt={song.songName}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                  <div>
                    <h1
                      className={`font-semibold truncate ${
                        isPlaying
                          ? "text-[#1ed760] hover:underline"
                          : "group-hover:text-white hover:underline"
                      }`}
                    >
                      {song.songName}
                    </h1>
                    <p className="text-[#9a9a9b] text-sm truncate hover:underline hover:text-white">
                      {song.artistName}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3 w-[20%] truncate">
                {new Date(song.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 w-[15%] text-center relative">
                {Math.floor(song.duration / 60)}:
                {(song.duration % 60).toString().padStart(2, "0")}
                {showOptions && (
                  <div className="inline-block ml-2 relative" ref={menuRef}>
                    <svg
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveOptionsId(
                          activeOptionsId === song.songId ? null : song.songId
                        );
                      }}
                      className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v.01M12 12v.01M12 18v.01"
                      />
                    </svg>
                    {activeOptionsId === song.songId && (
                      <div className="absolute top-full right-0 mt-2 z-50 bg-zinc-800 border border-zinc-700 rounded-md shadow-md w-40 text-sm">
                        <button
                          onClick={() => handleRemoveFromPlaylist(song)}
                          className="block w-full text-left px-4 py-2 hover:bg-zinc-700 text-red-400"
                        >
                          Xóa khỏi playlist
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Playlist;
