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

  // Sửa lại cách lấy playlistData
  const playlistData =
    showPlaylist && selectedPlaylist ? selectedPlaylist : currentPlaylist;

  // Kiểm tra và log dữ liệu
  console.log("PlaylistContent received:", {
    type,
    playlistData,
    selectedPlaylist,
    currentPlaylist,
  });

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
    // Log để debug
    console.log("Rendering content with:", {
      playlistData,
      type,
      selectedPlaylist,
    });

    // Xử lý cho album
    if (playlistData?.type === "album") {
      const albumData = {
        name: playlistData.album.title,
        description: playlistData.album.description || "",
        coverImage: playlistData.album.coverImage,
        user: {
          fullName: playlistData.album.artist?.name || "Unknown Artist",
          userId: playlistData.album.artist?.artistId,
        },
        playlistId: playlistData.album.albumId,
      };

      return (
        <>
          <PlaylistHeader
            content={albumData}
            type="album"
            songs={playlistData.songs || []}
          />
          <div className="flex flex-col flex-1 w-full p-4 bg-black/20">
            <div className="flex flex-row items-center gap-4 m-3">
              <ButtonPlay
                onClick={handlePlay}
                isPlaying={
                  isPlaying &&
                  playlistData.songs?.some(
                    (song) => song.songId === currentPlayingSongId
                  )
                }
              />
            </div>
            <Playlist
              songs={playlistData.songs || []}
              currentPlayingSongId={currentPlayingSongId}
              showOptions={false}
            />
          </div>
        </>
      );
    }

    // Xử lý cho single song
    if (singleSong) {
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

    // Xử lý cho playlist thường
    if (!playlistData?.playlist && !singleSong) {
      return (
        <div className="text-white text-center p-8">
          No playlist data available
        </div>
      );
    }

    const contentData = type === "album" ? playlistData : playlistData.playlist;

    return (
      <>
        <PlaylistHeader
          content={{
            name: contentData.name || contentData.title,
            description: contentData.description,
            coverImage: contentData.coverImage,
            user: contentData.user,
          }}
          type={type}
          songs={playlistData.songs || []}
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
            showOptions={true}
            playlistId={currentPlaylist.playlist?.playlistId}
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
