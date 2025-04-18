import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentSong,
  setSelectedSong,
} from "../../redux/slice/playlistSlice";
import {
  setShowUserProfile,
  clearSearchQuery,
  fetchSearchResults,
} from "../../redux/slice/searchSlice";
import "./Result_Searched.css";

// Component mới: AddSongPlaylist
const AddSongPlaylist = ({ song, onClose }) => {
  const [playlistSearch, setPlaylistSearch] = useState("");
  const { searchResults } = useSelector((state) => state.search);
  const playlists = searchResults?.playlists || [];

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
                key={playlist.playlist_id}
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

// Component CardSong (Giữ nguyên nhưng không sử dụng trong Songs Section)
const CardSong = ({ song, onSongClick }) => {
  const dispatch = useDispatch();

  const handlePlay = (e) => {
    e.stopPropagation();
    dispatch(setCurrentSong(song));
  };

  return (
    <div
      className="w-[200px] bg-[#121212] rounded-lg shadow-sm flex-shrink-0 p-2 relative group hover:bg-[#1f1f1f]"
      onClick={() => onSongClick(song)}
    >
      <div className="relative">
        <img
          src={song.img}
          alt={song.songName}
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
      <h3 className="mt-2 text-sm font-medium text-white leading-tight">
        {song.songName}
      </h3>
      <p className="mt-1 text-xs font-normal text-gray-400 truncate">
        {song.artistName}
      </p>
    </div>
  );
};

// Component: ArtistCard (sử dụng artist_id, name, img, description)
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

// Component: AlbumCard (sử dụng album_id, title, cover_image, artist_id)
const AlbumCard = ({ album, onClick }) => {
  const dispatch = useDispatch();

  const handlePlay = (e) => {
    e.stopPropagation();
    dispatch(setCurrentSong(album));
  };

  return (
    <div className="album-card" onClick={() => onClick(album)}>
      <div className="relative">
        <img
          src={album.cover_image || "https://via.placeholder.com/180"}
          alt={album.title}
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
      <h3>{album.title}</h3>
      <p>{album.artistName || "Unknown Artist"}</p>
    </div>
  );
};

// Component: PlaylistCard (sử dụng playlist_id, name, cover_image, description)
const PlaylistCard = ({ playlist, onClick }) => {
  const dispatch = useDispatch();

  const handlePlay = (e) => {
    e.stopPropagation();
    dispatch(setCurrentSong(playlist));
  };

  return (
    <div className="playlist-card" onClick={() => onClick(playlist)}>
      <div className="relative">
        <img
          src={playlist.cover_image || "https://via.placeholder.com/180"}
          alt={playlist.name}
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
      <h3>{playlist.name}</h3>
      <p>{playlist.description}</p>
    </div>
  );
};

// Song Item Component (Thêm sự kiện click để phát bài hát)
const SongItem = ({ title, artist, duration, explicit, song, img }) => {
  const dispatch = useDispatch();
  const [showAddPlaylist, setShowAddPlaylist] = useState(false);

  const handleAddClick = (e) => {
    e.stopPropagation(); // Ngăn sự kiện click trên nút "+" kích hoạt phát nhạc
    setShowAddPlaylist(true);
  };

  const handlePlay = () => {
    dispatch(setCurrentSong(song)); // Phát bài hát khi click vào SongItem
  };

  // Chuyển đổi duration từ giây sang định dạng phút:giây
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <>
      <div
        className="song-item group flex items-center gap-3 cursor-pointer hover:bg-[#1f1f1f]"
        onClick={handlePlay} // Thêm sự kiện click để phát bài hát
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

// Main Result_Searched Component
const Result_Searched = () => {
  const dispatch = useDispatch();
  const { searchQuery, searchResults, loading, error } = useSelector(
    (state) => state.search
  );

  // Gọi API tìm kiếm khi searchQuery thay đổi
  useEffect(() => {
    if (searchQuery) {
      dispatch(fetchSearchResults(searchQuery));
    }
  }, [searchQuery, dispatch]);

  const handleItemClick = () => {
    dispatch(setShowUserProfile(true));
    dispatch(clearSearchQuery());
  };

  // Nếu đang tải, hiển thị thông báo loading
  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  // Nếu không có kết quả tìm kiếm, hiển thị thông báo
  if (!searchResults) {
    return (
      <div className="text-white text-center">
        No results found. Try searching for something else.
      </div>
    );
  }

  // Destructure searchResults với key chính xác từ API
  const { songResult = [], albumResult = [], playlists = [] } = searchResults;

  return (
    <div className="result-searched">
      {/* Songs Section */}
      {songResult.length > 0 && (
        <div className="section">
          <h2 className="section-title">Songs</h2>
          <div className="songs-list">
            {songResult.map((song) => (
              <SongItem
                key={song.songId}
                title={song.songName}
                artist={song.artistName}
                duration={song.duration} // API trả về duration dạng giây
                explicit={song.explicit || false} // API không trả về explicit, mặc định là false
                img={song.img} // Thêm trường img để hiển thị ảnh
                song={song}
              />
            ))}
          </div>
        </div>
      )}

      {/* Artists Section (Comment vì chưa có dữ liệu) */}
      {/* {artists.length > 0 && (
        <div className="section">
          <h2 className="section-title">Artists</h2>
          <div className="artists-list">
            {artists.map((artist) => (
              <ArtistCard
                key={artist.artist_id}
                artist={artist}
                onClick={handleItemClick}
              />
            ))}
          </div>
        </div>
      )} */}

      {/* Albums Section */}
      {albumResult.length > 0 && (
        <div className="section">
          <h2 className="section-title">Albums</h2>
          <div className="albums-list">
            {albumResult.map((album) => (
              <AlbumCard
                key={album.album_id}
                album={album}
                onClick={handleItemClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Playlists Section */}
      {playlists.length > 0 && (
        <div className="section">
          <h2 className="section-title">Playlists</h2>
          <div className="playlists-list">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.playlist_id}
                playlist={playlist}
                onClick={handleItemClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Result_Searched;
