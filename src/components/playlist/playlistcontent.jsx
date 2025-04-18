import React from "react";
import { useSelector, useDispatch } from "react-redux";
import PlaylistHeader from "./playlistheader";
import { Ellipsis } from "lucide-react";
import ButtonPlay from "../ui/buttonplay";
import Playlist from "./playlist";
import {
  setQueue,
  togglePlay,
  setCurrentSong,
} from "../../redux/slice/playlistSlice";

const PlaylistContent = ({ type = "playlist", singleSong = null }) => {
  const dispatch = useDispatch();
  const { currentPlaylist, currentPlayingSongId, isPlaying, loading } =
    useSelector((state) => state.playlists);
  const { showPlaylist, selectedPlaylist } = useSelector(
    (state) => state.search
  );

  // Sử dụng selectedPlaylist nếu showPlaylist là true
  const playlistData =
    showPlaylist && selectedPlaylist ? selectedPlaylist : currentPlaylist;

  const handlePlay = () => {
    if (type === "song" && singleSong) {
      // Nếu bài hát đang phát là single song này
      if (currentPlayingSongId === singleSong.songId) {
        dispatch(togglePlay(!isPlaying));
      } else {
        // Nếu là bài khác, set queue mới và phát
        dispatch(setQueue([singleSong]));
        dispatch(setCurrentSong(singleSong));
        dispatch(togglePlay(true));
      }
    } else if (playlistData?.songs?.length > 0) {
      // Kiểm tra xem có bài hát nào đang phát từ playlist này không
      const isPlayingFromThisPlaylist = playlistData.songs.some(
        (song) => song.songId === currentPlayingSongId
      );

      if (isPlayingFromThisPlaylist) {
        // Nếu đang phát từ playlist này thì toggle play/pause
        dispatch(togglePlay(!isPlaying));
      } else {
        // Nếu chưa phát từ playlist này, set queue mới và phát từ đầu
        dispatch(setQueue(playlistData.songs));
        dispatch(setCurrentSong(playlistData.songs[0]));
        dispatch(togglePlay(true));
      }
    }
  };

  const renderContent = () => {
    if (type === "song" && singleSong) {
      const songData = {
        name: singleSong.songName,
        description: singleSong.artistName,
        coverImage: singleSong.img,
        user: { fullName: singleSong.artistName },
      };

      return (
        <>
          <PlaylistHeader content={songData} type="song" songs={[singleSong]} />
          <div className="flex flex-col flex-1 w-full p-4 bg-black/20">
            <div className="flex flex-row items-center gap-4 m-3">
              <ButtonPlay
                onClick={handlePlay}
                isPlaying={
                  isPlaying && currentPlayingSongId === singleSong.songId
                }
              />
              <Ellipsis className="scale-110 text-gray-400 hover:text-white cursor-pointer" />
            </div>
            <Playlist
              songs={[singleSong]}
              currentPlayingSongId={currentPlayingSongId}
            />
          </div>
        </>
      );
    }

    if (!playlistData || !playlistData.playlist) {
      return (
        <div className="text-white text-center">No playlist data available</div>
      );
    }

    return (
      <>
        <PlaylistHeader
          content={playlistData.playlist}
          type="playlist"
          songs={playlistData.songs}
        />
        <div className="flex flex-col flex-1 w-full p-4 bg-black/20">
          <div className="flex flex-row items-center gap-4 m-3">
            <ButtonPlay
              onClick={handlePlay}
              isPlaying={
                isPlaying &&
                playlistData?.songs?.some(
                  (song) => song.songId === currentPlayingSongId
                )
              }
            />
            <Ellipsis className="scale-110 text-gray-400 hover:text-white cursor-pointer" />
          </div>
          <Playlist
            songs={playlistData.songs || []}
            currentPlayingSongId={currentPlayingSongId}
          />
        </div>
      </>
    );
  };

  if (loading) return <div className="text-white text-center">Loading...</div>;

  return (
    <div className="flex flex-col h-full w-full rounded-xl bg-gradient-to-b from-[#6c04ab] to-[#1A0A12] text-white overflow-auto custom-scrollbar">
      <div className="flex flex-col h-full">{renderContent()}</div>
    </div>
  );
};

export default PlaylistContent;
