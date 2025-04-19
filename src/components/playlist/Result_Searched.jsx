import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentSong,
  setSelectedSong,
  setQueue,
  clearQueue,
  togglePlay, // Added clearQueue
} from "../../redux/slice/playlistSlice";
import {
  setShowUserProfile,
  clearSearchQuery,
  fetchSearchResults,
  setShowPlaylist,
} from "../../redux/slice/searchSlice";
import "./Result_Searched.css";

// Component: AddSongPlaylist
const AddSongPlaylist = ({ song, onClose }) => {
  const [playlistSearch, setPlaylistSearch] = useState("");
  const { items: playlists = [] } = useSelector((state) => state.playlists);

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(playlistSearch.toLowerCase())
  );

  const handleAddToPlaylist = (playlist) => {
    console.log(`Added song "${song.songName}" to playlist "${playlist.name}"`);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Add to Playlist</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="playlist-search">
          <input
            type="text"
            placeholder="Find a playlist"
            value={playlistSearch}
            onChange={(e) => setPlaylistSearch(e.target.value)}
            className="playlist-search-input"
          />
        </div>
        <div className="playlist-list">
          {filteredPlaylists.length > 0 ? (
            filteredPlaylists.map((playlist) => (
              <div
                key={playlist.playlistId}
                className="playlist-item"
                onClick={() => handleAddToPlaylist(playlist)}
              >
                <div className="playlist-details">
                  <span className="playlist-name">{playlist.name}</span>
                  <span className="playlist-artist">
                    {playlist.description || "Playlist"}
                  </span>
                </div>
                <span className="playlist-duration">-</span>
              </div>
            ))
          ) : (
            <div className="text-white text-center">No playlists found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component: CardSong
const CardSong = ({ song }) => {
  const dispatch = useDispatch();

  const handlePlay = (song) => {
    // Clear existing queue to ensure only the clicked song is included
    dispatch(clearQueue());
    // Create new queue with only the clicked song
    const newQueue = [song];
    dispatch(setQueue(newQueue));
    dispatch(setSelectedSong(song));
    dispatch(setCurrentSong(song)); // Ensure the song plays immediately
  };

  return (
    <div
      className="w-[200px] bg-[#121212] rounded-lg shadow-sm flex-shrink-0 p-2 relative group hover:bg-[#1f1f1f]"
      onClick={() => handlePlay(song)}
    >
      <div className="relative">
        <img
          src={song.img || "https://via.placeholder.com/180"}
          alt={song.songName}
          className="w-[180px] h-[180px] object-cover rounded-md"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlay(song);
          }}
          className="play-button"
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

// Component: ArtistCard
const ArtistCard = ({ artist, onClick }) => {
  return (
    <div className="artist-card" onClick={() => onClick(artist)}>
      <div className="relative">
        <img
          src={artist.img || "https://via.placeholder.com/180"}
          alt={artist.name}
          className="w-[180px] h-[180px] object-cover rounded-md"
        />
      </div>
      <h3>{artist.name}</h3>
      <p>{artist.description}</p>
    </div>
  );
};

// Component: AlbumCard
const AlbumCard = ({ album, onClick }) => {
  const dispatch = useDispatch();
  const { isRandom } = useSelector((state) => state.playlists);

  const handlePlay = (e) => {
    e.stopPropagation();
    // Kiểm tra xem album và songs có tồn tại không
    if (album?.songs?.length > 0) {
      try {
        // Clear queue trước
        dispatch(clearQueue());

        // Tạo mảng mới từ tất cả bài hát của album
        const newQueue = [...album.songs].map((song) => ({
          ...song,
          albumId: album.album?.albumId, // Thêm albumId vào mỗi bài hát
        }));

        // Set queue mới
        dispatch(setQueue(newQueue));

        // Chọn bài hát để phát
        if (isRandom) {
          const randomIndex = Math.floor(Math.random() * newQueue.length);
          dispatch(setCurrentSong(newQueue[randomIndex]));
        } else {
          dispatch(setCurrentSong(newQueue[0]));
        }

        // Bật phát nhạc
        dispatch(togglePlay(true));
      } catch (error) {
        console.error("Error playing album:", error);
      }
    } else {
      console.log("No songs available in this album");
    }
  };

  const handleAlbumClick = () => {
    const formattedAlbum = {
      type: "album",
      songs: album.songs || [],
      album: album.album,
    };
    onClick("album", formattedAlbum);
  };

  return (
    <div
      className="w-[200px] bg-[#121212] rounded-lg shadow-sm flex-shrink-0 p-2 relative group hover:bg-[#1f1f1f] cursor-pointer"
      onClick={handleAlbumClick}
    >
      <div className="relative">
        <img
          src={album.album?.coverImage || "https://via.placeholder.com/180"}
          alt={album.album?.name || "Album"}
          className="w-[180px] h-[180px] object-cover rounded-md"
        />
        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 bg-[#1ed760] text-black rounded-full w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
        {album.album?.title || "Unknown Album"}
      </h3>
      <p className="mt-1 text-xs font-normal text-gray-400 truncate">
        {album.album?.artist?.name || "Unknown Artist"}
      </p>
    </div>
  );
};

// Component: PlaylistCard
const PlaylistCard = ({ playlist, onClick }) => {
  const handlePlaylistClick = () => {
    const formattedPlaylist = {
      playlist: {
        ...playlist.playlist,
        isPrivate: playlist.playlist.isPrivate, // Thêm isPrivate vào đây
      },
      songs: playlist.songs || [],
    };
    onClick("playlist", formattedPlaylist);
  };

  const dispatch = useDispatch();

  const handlePlay = (e) => {
    e.stopPropagation();
    if (playlist.songs && playlist.songs.length > 0) {
      dispatch(setCurrentSong(playlist.songs[0]));
    }
  };

  const playlistData = playlist.playlist || {};

  return (
    <div className="playlist-card" onClick={handlePlaylistClick}>
      {" "}
      {/* Thay đổi ở đây */}
      <div className="relative">
        <img
          src={playlistData.coverImage || "https://via.placeholder.com/180"}
          alt={playlistData.name || "Playlist"}
          className="w-[180px] h-[180px] object-cover rounded-md"
        />
        <button onClick={handlePlay} className="play-button">
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
      <h3>{playlistData.name || "Unknown Playlist"}</h3>
      <p>{playlistData.description || "No description"}</p>
    </div>
  );
};

// Component: SongItem
const SongItem = ({ title, artist, duration, explicit, song, img }) => {
  const dispatch = useDispatch();
  const [showAddPlaylist, setShowAddPlaylist] = useState(false);

  const handleAddClick = (e) => {
    e.stopPropagation();
    setShowAddPlaylist(true);
  };

  const handlePlay = () => {
    // Clear existing queue to ensure only the clicked song is included
    dispatch(clearQueue());
    // Create new queue with only the clicked song
    const newQueue = [song];
    dispatch(setQueue(newQueue));
    dispatch(setSelectedSong(song));
    dispatch(setCurrentSong(song));
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <>
      <div
        className="song-item group flex items-center gap-3 cursor-pointer hover:bg-[#1f1f1f]"
        onClick={handlePlay}
      >
        <img
          src={img || "https://via.placeholder.com/40"}
          alt={title}
          className="w-10 h-10 object-cover rounded-md"
        />
        <div className="song-details flex-1">
          <span className="song-title">{title}</span>
          <span className="song-artist">
            {explicit && <span className="explicit-label">E</span>}
            {artist}
          </span>
        </div>
        <div className="song-actions">
          <span className="song-duration">{formatDuration(duration)}</span>
          <button
            className="add-button opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleAddClick}
          >
            +
          </button>
        </div>
      </div>
      {showAddPlaylist && (
        <AddSongPlaylist
          song={song}
          onClose={() => setShowAddPlaylist(false)}
        />
      )}
    </>
  );
};

// Main Component: Result_Searched
const Result_Searched = () => {
  const dispatch = useDispatch();
  const { searchQuery, searchResults, loading, error } = useSelector(
    (state) => state.search
  );

  useEffect(() => {
    if (searchQuery) {
      dispatch(fetchSearchResults(searchQuery));
    }
  }, [searchQuery, dispatch]);

  const handleItemClick = (type, data) => {
    if (type === "playlist") {
      const playlistContent = {
        show: true,
        playlist: {
          type: "playlist",
          playlist: {
            ...data.playlist,
            isPrivate: data.playlist.isPrivate, // Đảm bảo isPrivate được truyền
          },
          songs: data.songs || [],
        },
      };
      console.log("Formatted playlist content:", playlistContent);
      dispatch(setShowPlaylist(playlistContent));
    } else if (type === "album") {
      // Format album data for PlaylistContent
      const albumContent = {
        show: true,
        playlist: {
          type: "album",
          songs: data.songs || [],
          album: data.album,
        },
      };
      console.log("Dispatching album data:", albumContent);
      dispatch(setShowPlaylist(albumContent));
    } else {
      dispatch(setShowPlaylist({ show: false, playlist: null }));
      dispatch(setShowUserProfile(true));
      dispatch(clearSearchQuery());
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!searchResults) {
    return (
      <div className="text-white text-center">
        No results found. Try searching for something else.
      </div>
    );
  }

  const { songResult = [], albumResult = [], playlists = [] } = searchResults;

  return (
    <div className="result-searched">
      {songResult.length > 0 && (
        <div className="section">
          <h2 className="section-title">Songs</h2>
          <div className="songs-list">
            {songResult.map((song) => (
              <SongItem
                key={song.songId}
                title={song.songName}
                artist={song.artistName}
                duration={song.duration}
                explicit={song.explicit || false}
                img={song.img}
                song={song}
              />
            ))}
          </div>
        </div>
      )}

      {albumResult.length > 0 && (
        <div className="section">
          <h2 className="section-title">Albums</h2>
          <div className="albums-list flex flex-wrap gap-4">
            {albumResult.map((album) => (
              <AlbumCard
                key={album.album?.albumId}
                album={album}
                onClick={() => handleItemClick("album", album)}
              />
            ))}
          </div>
        </div>
      )}

      {playlists.length > 0 && (
        <div className="section">
          <h2 className="section-title">Playlists</h2>
          <div className="playlists-list flex flex-wrap gap-4">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.playlist?.playlistId}
                playlist={playlist}
                onClick={() => handleItemClick("playlist", playlist)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Result_Searched;
