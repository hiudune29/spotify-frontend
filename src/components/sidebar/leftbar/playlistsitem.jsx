import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlaylistSongs,
  togglePlaylistContent,
  deletePlaylist,
  fetchPlaylistsByUserId,
} from "../../../redux/slice/playlistSlice";
import { Heart, Play, Trash2 } from "lucide-react";

const SidebarPlaylists = ({ playlists, isExpanded }) => {
  const dispatch = useDispatch();
  const { currentPlaylist, currentSong, isPlaying, currentPlayingSongId } =
    useSelector((state) => state.playlists);
  const userId = useSelector((state) => state.user.userId);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handlePlaylistClick = (playlistId) => {
    dispatch(fetchPlaylistSongs(playlistId));
    dispatch(togglePlaylistContent(true));
  };

  const isCurrentPlaylist = (playlist) => {
    if (!currentPlaylist?.playlist || !playlist) return false;
    return currentPlaylist.playlist.playlistId === playlist.id;
  };

  const isPlayingFromThisPlaylist = (playlist) => {
    if (!currentPlaylist?.playlist || !playlist || !currentSong) return false;
    const isCurrentPlaylistMatch =
      currentPlaylist.playlist.playlistId === playlist.id;
    const isThisSongPlaying = currentPlayingSongId === currentSong.songId;
    return isCurrentPlaylistMatch && isThisSongPlaying && isPlaying;
  };

  const renderDeleteIcon = (playlistId) => (
    <button
      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={(e) => {
        e.stopPropagation();
        setConfirmDeleteId(playlistId);
      }}
    >
      <Trash2 size={18} className="text-red-400 hover:text-red-500" />
    </button>
  );

  const renderCompactItem = (playlist) => (
    <div
      key={playlist.id}
      onClick={() => handlePlaylistClick(playlist.id)}
      className={`flex items-center gap-3 p-2 mx-2 rounded-md hover:bg-zinc-800 cursor-pointer group
        ${isCurrentPlaylist(playlist) ? "bg-zinc-800" : ""}`}
    >
      <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden group">
        {playlist.isLiked ? (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Heart className="text-white fill-white" size={24} />
          </div>
        ) : (
          <>
            <img
              src={playlist.coverUrl || "/placeholder.svg"}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
            {isPlayingFromThisPlaylist(playlist) && (
              <div className="absolute bottom-1 right-1 w-8 h-8 bg-[#1ed760] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play fill="black" size={16} />
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span
          className={`text-sm font-medium truncate ${
            isCurrentPlaylist(playlist) ? "text-[#1ed760]" : ""
          }`}
        >
          {playlist.title}
        </span>
        <div className="flex items-center text-xs text-zinc-400">
          <span className="truncate">{playlist.type}</span>
          <span className="mx-1">•</span>
          <span className="truncate">{playlist.creator}</span>
        </div>
      </div>
      {renderDeleteIcon(playlist.id)}
    </div>
  );

  const renderExpandedItem = (playlist) => (
    <div
      key={playlist.id}
      onClick={() => handlePlaylistClick(playlist.id)}
      className={`grid grid-cols-[1fr_120px_100px] items-center gap-2 p-2 mx-2 rounded-md hover:bg-zinc-800 cursor-pointer group
        ${isCurrentPlaylist(playlist) ? "bg-zinc-800" : ""}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden group">
          {playlist.isLiked ? (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Heart className="text-white fill-white" size={24} />
            </div>
          ) : (
            <>
              <img
                src={playlist.coverUrl || "/placeholder.svg"}
                alt={playlist.title}
                className="w-full h-full object-cover"
              />
              {isPlayingFromThisPlaylist(playlist) && (
                <div className="absolute bottom-1 right-1 w-8 h-8 bg-[#1ed760] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play fill="black" size={16} />
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span
            className={`text-sm font-medium truncate ${
              isCurrentPlaylist(playlist) ? "text-[#1ed760]" : ""
            }`}
          >
            {playlist.title}
          </span>
          <div className="flex items-center text-xs text-zinc-400">
            <span className="truncate">{playlist.type}</span>
            <span className="mx-1">•</span>
            <span className="truncate">{playlist.creator}</span>
          </div>
        </div>
        {renderDeleteIcon(playlist.id)}
      </div>
      <span className="text-sm text-zinc-400 text-right">
        {playlist.addedDate}
      </span>
      <span className="text-sm text-zinc-400 text-right">
        {playlist.lastPlayed}
      </span>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto relative">
      {!isExpanded ? (
        playlists.map(renderCompactItem)
      ) : (
        <>
          <div className="grid grid-cols-[1fr_120px_100px] gap-2 px-4 py-2 text-sm text-zinc-400">
            <span>Tiêu đề</span>
            <span className="text-right">Đã thêm Ngày</span>
            <span className="text-right">Đã phát</span>
          </div>
          {playlists.map(renderExpandedItem)}
        </>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-zinc-900 text-white p-6 rounded shadow-xl w-[300px]">
            <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
            <p className="mb-4">Bạn có chắc muốn xóa playlist này không?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
                onClick={() => setConfirmDeleteId(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded"
                onClick={() => {
                  dispatch(deletePlaylist(confirmDeleteId))
                    .unwrap()
                    .then(() => {
                      dispatch(fetchPlaylistsByUserId(userId));
                      setConfirmDeleteId(null);
                    })
                    .catch((err) => {
                      console.error("Xóa thất bại:", err);
                      setConfirmDeleteId(null);
                    });
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarPlaylists;
