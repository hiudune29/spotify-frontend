import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  playNextSong,
  playPreviousSong,
  togglePlay,
} from "../../redux/slice/playlistSlice";
import "./BottomPlayer.css";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaRandom,
  FaRedo,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { Maximize, Minimize } from "lucide-react";

const BottomPlayer = () => {
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [previousVolume, setPreviousVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: tắt, 1: lặp bài hiện tại, 2: lặp playlist
  const [isRandom, setIsRandom] = useState(false); // Trạng thái ngẫu nhiên
  const [isFullScreen, setIsFullScreen] = useState(false); // Trạng thái toàn màn hình
  const audioRef = useRef(null);

  // Lấy currentSong từ Redux
  const { currentSong, currentPlaylist, isPlaying } = useSelector(
    (state) => state.playlists
  );

  // Xử lý chuyển đổi toàn màn hình
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullScreen(true);
        })
        .catch((err) => {
          console.error("Lỗi khi vào chế độ toàn màn hình:", err);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullScreen(false);
        })
        .catch((err) => {
          console.error("Lỗi khi thoát chế độ toàn màn hình:", err);
        });
    }
  };

  // Cập nhật trạng thái toàn màn hình khi thay đổi
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  // Cập nhật khi currentSong thay đổi
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.fileUpload;
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((error) => console.error("Lỗi khi phát nhạc:", error));
      }
    }
  }, [currentSong]);

  // Cập nhật khi isPlaying thay đổi
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((error) => console.error("Lỗi khi phát nhạc:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Xử lý khi nhấn nút play/pause
  const togglePlayPause = () => {
    if (!currentSong) return;
    dispatch(togglePlay(!isPlaying));
  };

  // Xử lý tua thời gian
  const handleTimeChange = (e) => {
    if (!currentSong) return;
    const newTime = e.target.value;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  // Xử lý thay đổi âm lượng
  const handleVolumeChange = (e) => {
    if (!currentSong) return;
    const newVolume = e.target.value;
    setVolume(newVolume);
    setPreviousVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    setIsMuted(false);
  };

  // Xử lý bật/tắt âm thanh
  const toggleMute = () => {
    if (!currentSong) return;
    if (isMuted) {
      setVolume(previousVolume);
      if (audioRef.current) {
        audioRef.current.volume = previousVolume / 100;
      }
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
    setIsMuted(!isMuted);
  };

  // Xử lý nút Repeat
  const toggleRepeat = () => {
    if (!currentSong) return;
    setRepeatMode((prevMode) => (prevMode + 1) % 3);
  };

  // Xử lý nút Random
  const toggleRandom = () => {
    if (!currentSong) return;
    setIsRandom((prev) => !prev);
  };

  // Cập nhật thời gian hiện tại khi bài hát đang chạy
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Định dạng thời gian (giây -> mm:ss)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Thêm handlers cho next và previous
  const handleNextSong = () => {
    if (!currentSong || !currentPlaylist?.songs?.length) return;
    dispatch(playNextSong());
  };

  const handlePreviousSong = () => {
    if (!currentSong || !currentPlaylist?.songs?.length) return;
    dispatch(playPreviousSong());
  };

  const handleSongEnded = () => {
    const index = currentPlaylist.songs.findIndex(
      (s) => s.songId === currentSong.songId
    );
    if (index < currentPlaylist.songs.length - 1) {
      dispatch(playNextSong());
    } else {
      dispatch(togglePlay(false)); // Dừng khi hết playlist
    }
  };

  return (
    <div className="bottom-player">
      {/* Phần thông tin bài nhạc */}
      {currentSong ? (
        <div className="song-info">
          <img
            src={currentSong.img}
            alt="Album cover"
            className="album-cover"
          />
          <div className="song-details">
            <span className="song-title">{currentSong.songName}</span>
            <span className="song-artist">{currentSong.artistName}</span>
          </div>
          <div className="check-icon">✔</div>
        </div>
      ) : (
        <div className="song-placeholder text-gray-400">
          Chưa có bài hát nào được chọn.
        </div>
      )}

      {/* Phần điều khiển trung tâm */}
      <div className="controls">
        {/* Các nút điều khiển */}
        <div className="control-buttons">
          <button
            className={`control-btn ${isRandom ? "active" : ""}`}
            onClick={toggleRandom}
            disabled={!currentSong}
          >
            <FaRandom />
          </button>
          <button
            className="control-btn"
            onClick={handlePreviousSong}
            disabled={!currentSong || !currentPlaylist?.songs?.length}
          >
            <FaStepBackward />
          </button>
          <button
            className="play-pause-btn"
            onClick={togglePlayPause}
            disabled={!currentSong}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button
            className="control-btn"
            onClick={handleNextSong}
            disabled={!currentSong || !currentPlaylist?.songs?.length}
          >
            <FaStepForward />
          </button>
          <button
            className={`control-btn ${repeatMode > 0 ? "active" : ""}`}
            onClick={toggleRepeat}
            disabled={!currentSong}
          >
            <FaRedo />
            {repeatMode === 1 && <span className="repeat-indicator">1</span>}
          </button>
        </div>

        {/* Thanh thời gian */}
        <div className="progress-bar">
          {currentSong ? (
            <>
              <span className="current-time">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={currentSong.duration || 244} // Giả sử duration có sẵn, nếu không thì mặc định 244 giây
                value={currentTime}
                onChange={handleTimeChange}
                className="progress-slider"
                disabled={!currentSong}
              />
              <span className="remaining-time">
                -{formatTime((currentSong.duration || 244) - currentTime)}
              </span>
            </>
          ) : (
            <>
              <span className="current-time">0:00</span>
              <input
                type="range"
                min="0"
                max="100"
                value="0"
                className="progress-slider"
                disabled
              />
              <span className="remaining-time">0:00</span>
            </>
          )}
        </div>
      </div>

      {/* Phần điều khiển bên phải (âm lượng, v.v.) */}
      <div className="extra-controls">
        <button
          className="control-btn"
          onClick={toggleMute}
          disabled={!currentSong}
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>

        {/* Thanh âm lượng */}
        <div className="volume-control">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            disabled={!currentSong}
          />
        </div>
        {/* Nút Maximize/Minimize với chức năng toàn màn hình */}
        <button className="control-btn maximize-btn" onClick={toggleFullScreen}>
          {isFullScreen ? <Minimize /> : <Maximize />}
        </button>
      </div>

      {/* Audio element ẩn để phát nhạc */}
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.fileUpload}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleSongEnded}
        />
      )}
    </div>
  );
};

export default BottomPlayer;
