import { Clock, Play } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import {
  setCurrentSong,
  setCurrentSongIndex,
} from "../../redux/slice/playlistSlice";

// Thêm currentPlayingSongId vào props
const Playlist = ({ songs, currentPlayingSongId }) => {
  const dispatch = useDispatch();

  const handlePlaySong = (song, index) => {
    dispatch(setCurrentSong(song));
    dispatch(setCurrentSongIndex(index));
  };

  return (
    <table
      className="w-full text-left table-fixed"
      style={{ borderSpacing: "8px 0" }}
    >
      <thead className="text-gray-400 text-sm font-semibold border-b border-gray-700">
        <tr>
          <th className="py-3 w-10 text-center">#</th>
          <th className="py-3 w-[40%]">Tiêu đề</th>
          <th className="py-3 w-[25%]">Album</th>
          <th className="py-3 w-[20%]">Ngày thêm</th>
          <th className="py-3 w-[15%] text-center">
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
              <td className="py-3 w-10 text-center">
                <div className="flex items-center justify-center">
                  {isPlaying ? (
                    <Play className="w-4 h-4 text-[#1ed760]" />
                  ) : (
                    <>
                      <span className="group-hover:hidden">{index + 1}</span>
                      <Play className="w-4 h-4 text-gray-500 hidden group-hover:block" />
                    </>
                  )}
                </div>
              </td>
              <td className="py-3 w-[40%]">
                <div className="flex items-center gap-2">
                  <img
                    src={song.img}
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
              <td className="py-3 w-[25%] truncate hover:underline hover:text-white">
                {song.album}
              </td>
              <td className="py-3 w-[20%] truncate">
                {new Date(song.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 w-[15%] text-center relative">
                {Math.floor(song.duration / 60)}:
                {(song.duration % 60).toString().padStart(2, "0")}
                <svg
                  className="w-4 h-4 text-gray-400 hidden group-hover:block absolute right-4 top-1/2 transform -translate-y-1/2"
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
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Playlist;
