import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setCurrentSong,
  setSelectedSong,
} from "../../redux/slice/playlistSlice";
import {
  setShowUserProfile,
  clearSearchQuery,
} from "../../redux/slice/searchSlice";
import "./Result_Searched.css";

// Component mới: AddSongPlaylist
const AddSongPlaylist = ({ song, onClose }) => {
  const [playlistSearch, setPlaylistSearch] = useState("");
  const playlists = [
    { id: 1, name: "APT.", artist: "ROSÉ, Bruno Mars" },
    { id: 2, name: "Chill Hits", artist: "Various Artists" },
    { id: 3, name: "My Playlist #2", artist: "User" },
  ];

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
          {filteredPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="playlist-item"
              onClick={() => handleAddToPlaylist(playlist)}
            >
              <div className="playlist-details">
                <span className="playlist-name">{playlist.name}</span>
                <span className="playlist-artist">{playlist.artist}</span>
              </div>
              <span className="playlist-duration">2:49</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component CardSong (giữ nguyên)
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
        <img src={artist.img} alt={artist.name} />
      </div>
      <h3>{artist.name}</h3>
      <p>{artist.description}</p>
    </div>
  );
};

// Component: AlbumCard (sử dụng album_id, title, cover_image, artist_id)
const AlbumCard = ({ album, onClick }) => {
  const dispatch = useDispatch();
  const artistName =
    artistsData.find((artist) => artist.artist_id === album.artist_id)?.name ||
    "Unknown Artist";

  const handlePlay = (e) => {
    e.stopPropagation();
    dispatch(setCurrentSong(album));
  };

  return (
    <div className="album-card" onClick={() => onClick(album)}>
      <div className="relative">
        <img src={album.cover_image} alt={album.title} />
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
      <p>{artistName}</p>
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
        <img src={playlist.cover_image} alt={playlist.name} />
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

// Dữ liệu mẫu cho Songs (giữ nguyên)
const songsData = [
  {
    songId: 1,
    songName: "Anxiety",
    artistName: "Doechii",
    duration: "4:09",
    explicit: true,
    img: "https://via.placeholder.com/180",
  },
  {
    songId: 2,
    songName: "Another Love",
    artistName: "Tom Odell",
    duration: "4:04",
    explicit: true,
    img: "https://via.placeholder.com/180",
  },
  {
    songId: 3,
    songName: "Animals",
    artistName: "Maroon 5",
    duration: "3:51",
    explicit: false,
    img: "https://via.placeholder.com/180",
  },
  {
    songId: 4,
    songName: "Angels Like You",
    artistName: "Miley Cyrus",
    duration: "3:16",
    explicit: false,
    img: "https://via.placeholder.com/180",
  },
];

// Dữ liệu mẫu cho Artists (sử dụng artist_id, name, img, description)
const artistsData = [
  {
    artist_id: 5,
    name: "Anuel AA",
    img: "https://via.placeholder.com/180",
    description: "Latin Trap Artist",
  },
  {
    artist_id: 6,
    name: "Romeo Santos",
    img: "https://via.placeholder.com/180",
    description: "Bachata King",
  },
  {
    artist_id: 7,
    name: "Anuv Jain",
    img: "https://via.placeholder.com/180",
    description: "Indie Pop Artist",
  },
  {
    artist_id: 8,
    name: "Anne-Marie",
    img: "https://via.placeholder.com/180",
    description: "Pop Sensation",
  },
  {
    artist_id: 9,
    name: "Anirudh Ravichander",
    img: "https://via.placeholder.com/180",
    description: "Tamil Music Composer",
  },
  {
    artist_id: 10,
    name: "Anyma",
    img: "https://via.placeholder.com/180",
    description: "Electronic Music Artist",
  },
  {
    artist_id: 11,
    name: "Angèle",
    img: "https://via.placeholder.com/180",
    description: "French Pop Star",
  },
  {
    artist_id: 12,
    name: "Lady Gaga",
    img: "https://via.placeholder.com/180",
    description: "Pop Icon",
  },
];

// Dữ liệu mẫu cho Albums (sử dụng album_id, title, cover_image, artist_id)
const albumsData = [
  {
    album_id: 13,
    title: "After Hours",
    cover_image: "https://via.placeholder.com/180",
    artist_id: 10,
  },
  {
    album_id: 14,
    title: "Future Nostalgia",
    cover_image: "https://via.placeholder.com/180",
    artist_id: 8,
  },
  {
    album_id: 15,
    title: "Midnight Marauders",
    cover_image: "https://via.placeholder.com/180",
    artist_id: 7,
  },
  {
    album_id: 16,
    title: "Evermore",
    cover_image: "https://via.placeholder.com/180",
    artist_id: 6,
  },
  {
    album_id: 17,
    title: "Plastic Hearts",
    cover_image: "https://via.placeholder.com/180",
    artist_id: 5,
  },
];

// Dữ liệu mẫu cho Playlists (sử dụng playlist_id, name, cover_image, description)
const playlistsData = [
  {
    playlist_id: 18,
    name: "Chill Vibes",
    cover_image: "https://via.placeholder.com/180",
    description: "Relax and unwind",
  },
  {
    playlist_id: 19,
    name: "Workout Hits",
    cover_image: "https://via.placeholder.com/180",
    description: "Get pumped up",
  },
  {
    playlist_id: 20,
    name: "Road Trip",
    cover_image: "https://via.placeholder.com/180",
    description: "Perfect for long drives",
  },
  {
    playlist_id: 21,
    name: "Study Focus",
    cover_image: "https://via.placeholder.com/180",
    description: "Stay concentrated",
  },
  {
    playlist_id: 22,
    name: "Party Mix",
    cover_image: "https://via.placeholder.com/180",
    description: "Dance all night",
  },
];

// Song Item Component (giữ nguyên)
const SongItem = ({ title, artist, duration, explicit, song }) => {
  const [showAddPlaylist, setShowAddPlaylist] = useState(false);

  const handleAddClick = (e) => {
    e.stopPropagation();
    setShowAddPlaylist(true);
  };

  return (
    <>
      <div className="song-item group">
        <div className="song-details">
          <span className="song-title">{title}</span>
          <span className="song-artist">
            {explicit && <span className="explicit-label">E</span>}
            {artist}
          </span>
        </div>
        <div className="song-actions">
          <span className="song-duration">{duration}</span>
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

  const handleItemClick = () => {
    dispatch(setShowUserProfile(true));
    dispatch(clearSearchQuery());
  };

  return (
    <div className="result-searched">
      {/* Songs Section */}
      <div className="section">
        <h2 className="section-title">Songs</h2>
        <div className="songs-list">
          {songsData.map((song) => (
            <SongItem
              key={song.songId}
              title={song.songName}
              artist={song.artistName}
              duration={song.duration}
              explicit={song.explicit}
              song={song}
            />
          ))}
        </div>
      </div>

      {/* Artists Section */}
      <div className="section">
        <h2 className="section-title">Artists</h2>
        <div className="artists-list">
          {artistsData.map((artist) => (
            <ArtistCard
              key={artist.artist_id}
              artist={artist}
              onClick={handleItemClick}
            />
          ))}
        </div>
      </div>

      {/* Albums Section */}
      <div className="section">
        <h2 className="section-title">Albums</h2>
        <div className="albums-list">
          {albumsData.map((album) => (
            <AlbumCard
              key={album.album_id}
              album={album}
              onClick={handleItemClick}
            />
          ))}
        </div>
      </div>

      {/* Playlists Section */}
      <div className="section">
        <h2 className="section-title">Playlists</h2>
        <div className="playlists-list">
          {playlistsData.map((playlist) => (
            <PlaylistCard
              key={playlist.playlist_id}
              playlist={playlist}
              onClick={handleItemClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Result_Searched;
