import React from "react";
import PlaylistHeader from "./playlistheader";
import { Play } from "lucide-react";

const PlaylistContent = () => {
  return (
    <div className="flex flex-col h-full w-full rounded-xl bg-gradient-to-b from-[#6c04ab] to-[#1A0A12] text-white">
      <PlaylistHeader />
      <div className="flex flex-col h-full w-full p-4 bg-black/20"></div>
    </div>
  );
};

export default PlaylistContent;
