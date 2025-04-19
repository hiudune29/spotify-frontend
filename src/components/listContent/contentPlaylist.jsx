import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import {
  fetchSongs,
  setCurrentSong,
  setSelectedSong,
  setQueue,
  togglePlay,
  clearQueue,
} from "../../redux/slice/playlistSlice";
import PlaylistContent from "../playlist/playlistcontent";
import "../../style/contentPlaylist.css";

const CardSong = ({ song, onSongClick }) => {
  const dispatch = useDispatch();

  // Sửa lại hàm xử lý khi nhấn nút play
  const handlePlay = (e) => {
    e.stopPropagation();

    // Xóa queue cũ và tạo queue mới chỉ với bài hát được chọn
    dispatch(clearQueue());
    dispatch(setQueue([song]));
    dispatch(setCurrentSong(song));
    dispatch(togglePlay(true));
    // Không cần bật random mode nữa
  };

  return (
    <div
      className="w-[200px] bg-[#121212] rounded-lg shadow-sm flex-shrink-0 p-2 relative group hover:bg-[#1f1f1f]"
      onClick={() => onSongClick(song)} // Thêm onClick để xử lý khi click vào card
    >
      <div className="relative">
        <img
          src={song.img || "https://via.placeholder.com/150"}
          alt={song.songName}
          className="w-[180px] h-[180px] object-cover rounded-md"
        />
        <button
          onClick={handlePlay}
          className="hover:cursor-pointer absolute bottom-2 right-2 bg-[#1ed760] text-black rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
      <h3 className="mt-2 text-sm font-medium text-white leading-tight">
        {song.songName}
      </h3>
      <p className="mt-1 text-xs font-normal text-gray-400 truncate">
        {song.artistName}
      </p>
    </div>
  );
};

const MusicSession = () => {
  const dispatch = useDispatch();
  const { songs, loading, selectedSong, showPlaylistContent } = useSelector(
    (state) => state.playlists
  );
  const recommendedRef = useRef(null);

  useEffect(() => {
    dispatch(fetchSongs());
  }, [dispatch]);

  // Thêm effect để reset selectedSong khi showPlaylistContent thay đổi
  useEffect(() => {
    if (!showPlaylistContent) {
      dispatch(setSelectedSong(null)); // Sử dụng dispatch thay vì gọi trực tiếp
    }
  }, [showPlaylistContent, dispatch]);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  const handleSongClick = (song) => {
    // Thêm log để kiểm tra
    console.log("Single song clicked:", song);

    // Tạo queue mới chỉ với bài hát được chọn
    const newQueue = [song];
    console.log("New queue:", newQueue);

    dispatch(setQueue(newQueue));
    dispatch(setSelectedSong(song)); // Vẫn giữ lại để hiển thị chi tiết bài hát
  };

  // Nếu có bài hát được chọn, hiển thị PlaylistContent
  if (selectedSong) {
    return <PlaylistContent type="song" singleSong={selectedSong} />;
  }

  return (
    <div className="p-5 bg-[#121212] rounded-xl h-full text-white">
      <h2 className="text-xl font-bold mb-3">Recommended for You</h2>
      <div className="relative w-full">
        <button
          onClick={() => scroll(recommendedRef, "left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full shadow-lg z-10"
        >
          <LeftOutlined />
        </button>

        <div
          ref={recommendedRef}
          className="flex gap-1 overflow-x-auto hidden-scrollbar scroll-smooth px-12"
        >
          {loading ? (
            <p>Loading...</p>
          ) : (
            songs?.map((song) => (
              <CardSong
                key={song.songId}
                song={song}
                onSongClick={handleSongClick}
              />
            ))
          )}
        </div>

        <button
          onClick={() => scroll(recommendedRef, "right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full shadow-lg z-10"
        >
          <RightOutlined />
        </button>
      </div>
    </div>
  );
};

export default MusicSession;
