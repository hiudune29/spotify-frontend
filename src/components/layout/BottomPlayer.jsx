import React, { useState, useEffect, useRef } from "react";
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

const BottomPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [previousVolume, setPreviousVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [songData, setSongData] = useState(null);
  const [repeatMode, setRepeatMode] = useState(0); // 0: tắt, 1: lặp bài hiện tại, 2: lặp playlist
  const [isRandom, setIsRandom] = useState(false); // Trạng thái ngẫu nhiên
  const audioRef = useRef(null);

  // Hàm giả lập chọn bài hát (sử dụng dữ liệu giả lập)
  const selectSong = async () => {
    try {
      const mockData = {
        title: "Devil In A New Dress",
        artist: "Kanye West, Rick Ross",
        albumCover:
          "https://i.scdn.co/image/ab67616d0000b273d2a7d2231a8b3d9a9b27a5f",
        duration: 244,
        audioUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      };
      setSongData(mockData);
    } catch (error) {
      console.error("Error setting mock song data:", error);
      alert("Không thể tải bài hát. Vui lòng thử lại sau.");
    }
  };

  // Xử lý khi nhấn nút play/pause
  const togglePlayPause = () => {
    if (!songData) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Xử lý tua thời gian
  const handleTimeChange = (e) => {
    if (!songData) return;
    const newTime = e.target.value;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  // Xử lý thay đổi âm lượng
  const handleVolumeChange = (e) => {
    if (!songData) return;
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
    if (!songData) return;
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
    if (!songData) return;
    setRepeatMode((prevMode) => (prevMode + 1) % 3);
  };

  // Xử lý nút Random
  const toggleRandom = () => {
    if (!songData) return;
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

  return (
    <div className="bottom-player">
      {/* Phần thông tin bài nhạc */}
      {songData ? (
        <div className="song-info">
          <img
            src={songData.albumCover}
            alt="Album cover"
            className="album-cover"
          />
          <div className="song-details">
            <span className="song-title">{songData.title}</span>
            <span className="song-artist">{songData.artist}</span>
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
            disabled={!songData}
          >
            <FaRandom />
          </button>
          <button className="control-btn" disabled={!songData}>
            <FaStepBackward />
          </button>
          <button
            className="play-pause-btn"
            onClick={togglePlayPause}
            disabled={!songData}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button className="control-btn" disabled={!songData}>
            <FaStepForward />
          </button>
          <button
            className={`control-btn ${repeatMode > 0 ? "active" : ""}`}
            onClick={toggleRepeat}
            disabled={!songData}
          >
            <FaRedo />
            {repeatMode === 1 && <span className="repeat-indicator">1</span>}
          </button>
          <button className="control-btn select-song-btn" onClick={selectSong}>
            Select Song
          </button>
        </div>

        {/* Thanh thời gian */}
        <div className="progress-bar">
          {songData ? (
            <>
              <span className="current-time">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={songData.duration}
                value={currentTime}
                onChange={handleTimeChange}
                className="progress-slider"
                disabled={!songData}
              />
              <span className="remaining-time">
                -{formatTime(songData.duration - currentTime)}
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
        <button className="control-btn" disabled={!songData}>
          📜
        </button>
        <button className="control-btn" disabled={!songData}>
          ✏️
        </button>
        <button className="control-btn" disabled={!songData}>
          ≡
        </button>
        <button
          className="control-btn"
          onClick={toggleMute}
          disabled={!songData}
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
            disabled={!songData}
          />
        </div>

        <button className="control-btn" disabled={!songData}>
          🖥️
        </button>
        <button className="control-btn" disabled={!songData}>
          ↗️
        </button>
      </div>

      {/* Audio element ẩn để phát nhạc */}
      {songData && (
        <audio
          ref={audioRef}
          src={songData.audioUrl}
          onTimeUpdate={handleTimeUpdate}
        />
      )}
    </div>
  );
};

export default BottomPlayer;
