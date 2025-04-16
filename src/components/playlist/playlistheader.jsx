import { React, useState } from "react";
import { ImagePlus } from "lucide-react";
import PlaylistEditModal from "../sidebar/editPlaylist";

const Avatar = ({ src }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mr-6 relative group" onClick={() => setIsModalOpen(true)}>
        <img
          src={src || "https://via.placeholder.com/150"}
          alt="Playlist Cover"
          className="w-48 h-48 object-cover shadow-lg m-5 rounded-sm transition-opacity group-hover:opacity-70"
        />
        <div className="absolute inset-0 m-5 w-48 h-48 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm" />
        <ImagePlus className="absolute top-8 left-8 w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <PlaylistEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Rap On Trap"
        description="Playlist A selection of carefully selected synthwave tracks to recharge your inspiration upon"
        cover={src || "https://via.placeholder.com/150"}
      />
    </>
  );
};

const PlaylistHeader = ({ content, type = "playlist", songs = [] }) => {
  if (!content) return null;

  const { name, description, coverImage, user } = content;
  const creator = user.fullName;

  const songCount = songs.length;
  const totalDuration = songs.reduce((sum, s) => sum + (s.duration || 0), 0);
  const totalMinutes = Math.floor(totalDuration / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const charCount = name.length;
  const titleSizeClass =
    charCount <= 15 ? "text-7xl" : charCount <= 35 ? "text-5xl" : "text-2xl";

  return (
    <div className="flex flex-row w-full text-white">
      <Avatar src={coverImage} />
      <div className="flex flex-col justify-end my-6">
        <h1 className="text-sm font-semibold my-2">
          {type === "playlist" ? "Playlist" : "Bài hát"}
        </h1>
        <h1 className={`font-bold mb-2 ${titleSizeClass}`}>{name}</h1>

        <div className="relative group max-w-lg">
          <p className="mb-2 text-gray-300 truncate text-xs">{description}</p>
          <div className="absolute hidden group-hover:block bottom-full mb-2 w-max max-w-md bg-gray-800 text-white text-xs p-2 rounded-lg shadow-lg z-10">
            {description}
          </div>
        </div>

        <span className="flex flex-row text-sm font-semibold justify-start items-center">
          <img
            alt="avatar"
            className="w-8 h-8 object-cover shadow-lg me-2 rounded-3xl"
          />
          <span className="font-bold hover:cursor-pointer hover:underline">
            {creator}
          </span>
          <span className="ms-2 text-gray-300">
            {type === "playlist"
              ? `${songCount} bài hát, ${
                  hours > 0 ? `${hours} giờ ` : ""
                }${minutes} phút`
              : `${minutes}:${(totalDuration % 60)
                  .toString()
                  .padStart(2, "0")}`}
          </span>
        </span>
      </div>
    </div>
  );
};

export default PlaylistHeader;
