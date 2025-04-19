import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import PlaylistHeader from "./playlistheader";
import { Check } from "lucide-react";
import ButtonPlay from "../ui/buttonplay";
import Playlist from "./playlist";
import {
  setQueue,
  togglePlay,
  setCurrentSong,
  clearQueue,
  togglePlaylistPrivate, // Add this import
} from "../../redux/slice/playlistSlice";
import { message } from "antd";

const PlaylistContent = ({ type = "playlist", singleSong = null }) => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.user.userId); // Thêm dòng này

  const {
    currentPlaylist,
    currentPlayingSongId,
    isPlaying,
    loading,
    isRandom,
  } = useSelector((state) => state.playlists);
  const { showPlaylist, selectedPlaylist } = useSelector(
    (state) => state.search
  );

  // Sửa lại cách lấy playlistData với kiểm tra null
  const playlistData = useMemo(() => {
    if (showPlaylist && selectedPlaylist) {
      return selectedPlaylist;
    }
    return currentPlaylist;
  }, [showPlaylist, selectedPlaylist, currentPlaylist]);

  // Kiểm tra và log dữ liệu
  console.log("PlaylistContent received:", {
    type,
    playlistData,
    selectedPlaylist,
    currentPlaylist,
  });

  const handlePlay = () => {
    if (type === "song" && singleSong) {
      // Xử lý cho single song
      if (currentPlayingSongId === singleSong.songId) {
        dispatch(togglePlay(!isPlaying));
      } else {
        // Xóa queue cũ và thêm bài hát mới vào queue
        dispatch(clearQueue());
        dispatch(setQueue([singleSong]));
        dispatch(setCurrentSong(singleSong));
        dispatch(togglePlay(true));
      }
    } else if (playlistData?.songs?.length > 0) {
      // Xử lý cho playlist
      const isPlayingFromThisPlaylist = playlistData.songs.some(
        (song) => song.songId === currentPlayingSongId
      );

      if (isPlayingFromThisPlaylist) {
        dispatch(togglePlay(!isPlaying));
      } else {
        const newQueue = [...playlistData.songs];
        dispatch(setQueue(newQueue));
        // Chọn bài hát để phát dựa trên chế độ random
        if (isRandom) {
          const randomIndex = Math.floor(Math.random() * newQueue.length);
          dispatch(setCurrentSong(newQueue[randomIndex]));
        } else {
          dispatch(setCurrentSong(newQueue[0]));
        }
        dispatch(togglePlay(true));
      }
    }
  };

  const renderContent = () => {
    // Log để debug
    console.log("PlaylistContent data:", {
      playlistData,
      type,
      selectedPlaylist,
      currentPlaylist,
    });

    // Xử lý cho playlist trống
    if (!playlistData) {
      return (
        <div className="text-white text-center p-8">
          No playlist data available
        </div>
      );
    }

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
            </div>
            <Playlist
              songs={[singleSong]}
              currentPlayingSongId={currentPlayingSongId}
            />
          </div>
        </>
      );
    }

    // Xử lý cho playlist thường với kiểm tra null
    const contentData = type === "album" ? playlistData : playlistData.playlist;

    if (!contentData) {
      return (
        <div className="text-white text-center p-8">
          Invalid playlist data format
        </div>
      );
    }

    // Add handleTogglePrivate here where contentData is available
    const handleTogglePrivate = async () => {
      if (contentData?.playlistId) {
        try {
          const resultAction = await dispatch(
            togglePlaylistPrivate(contentData.playlistId)
          );
          if (togglePlaylistPrivate.fulfilled.match(resultAction)) {
            message.success(
              `Chuyển đổi trạng thái playlist thành ${
                resultAction.payload.isPrivate ? "Private" : "Public"
              }`
            );
          }
        } catch (error) {
          console.error("Failed to toggle playlist privacy:", error);
        }
      }
    };

    return (
      <>
        <PlaylistHeader
          content={{
            name: contentData.name || contentData.title || "Untitled Playlist",
            description: contentData.description || "",
            coverImage: contentData.coverImage,
            user: contentData.user || { fullName: "Unknown User" },
            playlistId: contentData.playlistId,
            isPrivate: contentData.isPrivate,
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
            {/* Chỉ hiển thị nút toggle private khi userId trùng khớp */}
            {currentUserId === contentData.user?.userId && (
              <div className="flex items-center gap-2">
                <Check
                  className={`scale-110 cursor-pointer ${
                    !contentData.isPrivate ? "text-green-500" : "text-gray-400"
                  }`}
                  onClick={handleTogglePrivate}
                />
                <span className="text-sm text-gray-400">
                  {contentData.isPrivate ? "Private" : "Public"}
                </span>
              </div>
            )}
          </div>
          <Playlist
            songs={playlistData.songs || []}
            currentPlayingSongId={currentPlayingSongId}
            showOptions={currentUserId === contentData.user?.userId}
            playlistId={contentData.playlistId}
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
