import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  playNextSong,
  playPreviousSong,
  togglePlay,
  toggleRandom,
  setRepeatMode,
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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const audioRef = useRef(null);

  const { currentSong, isPlaying, queue, isRandom, repeatMode } = useSelector(
    (state) => state.playlists
  );

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      // Chỉ set src khi currentSong thay đổi hoặc src chưa được set
      if (audioRef.current.src !== currentSong.fileUpload) {
        audioRef.current.src = currentSong.fileUpload;
        if (isPlaying) {
          audioRef.current
            .play()
            .catch((error) => console.error("Lỗi khi phát:", error));
        }
      } else {
        // Nếu là cùng một bài hát, chỉ xử lý play/pause
        if (isPlaying) {
          audioRef.current
            .play()
            .catch((error) => console.error("Lỗi khi phát:", error));
        } else {
          audioRef.current.pause();
        }
      }
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (!currentSong) return;
    dispatch(togglePlay(!isPlaying));
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    setPreviousVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      if (audioRef.current) audioRef.current.volume = previousVolume / 100;
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const toggleRepeat = () => {
    const nextMode = (repeatMode + 1) % 3;
    dispatch(setRepeatMode(nextMode));
  };

  const handleToggleRandom = () => {
    if (!currentSong) return;
    dispatch(toggleRandom());
  };

  const handleNextSong = () => {
    if (!currentSong || queue.length === 0) return;
    dispatch(playNextSong());
  };

  const handlePreviousSong = () => {
    if (!currentSong || queue.length === 0) return;
    dispatch(playPreviousSong());
  };

  const handleSongEnded = () => {
    if (repeatMode === 1) {
      // Lặp lại bài hiện tại
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    if (queue.length === 0) {
      dispatch(togglePlay(false));
      return;
    }

    if (isRandom) {
      dispatch(playNextSong());
    } else {
      const currentIndex = queue.findIndex(
        (s) => s.songId === currentSong.songId
      );

      if (currentIndex < queue.length - 1 || repeatMode === 2) {
        // Phát bài tiếp theo hoặc lặp lại queue
        dispatch(playNextSong());
      } else {
        // Hết queue và không lặp
        dispatch(togglePlay(false));
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  return (
    <div className="bottom-player">
      {currentSong ? (
        <div className="song-info">
          <img src={currentSong.img} alt="Album" className="album-cover" />
          <div className="song-details">
            <span className="song-title">{currentSong.songName}</span>
            <span className="song-artist">{currentSong.artistName}</span>
          </div>
        </div>
      ) : (
        <div className="song-placeholder text-gray-400">
          Chưa có bài hát nào được chọn.
        </div>
      )}

      <div className="controls">
        <div className="control-buttons">
          <button
            className={`control-btn ${isRandom ? "active" : ""}`}
            onClick={handleToggleRandom}
            disabled={!currentSong}
          >
            <FaRandom />
          </button>
          <button
            className="control-btn"
            onClick={handlePreviousSong}
            disabled={!currentSong || queue.length === 0}
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
            disabled={!currentSong || queue.length === 0}
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

        <div className="progress-bar">
          {currentSong ? (
            <>
              <span className="current-time">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={currentSong.duration || 244}
                value={currentTime}
                onChange={handleTimeChange}
                className="progress-slider"
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

      <div className="extra-controls">
        <button
          className="control-btn"
          onClick={toggleMute}
          disabled={!currentSong}
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
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
        <button className="control-btn maximize-btn" onClick={toggleFullScreen}>
          {isFullScreen ? <Minimize /> : <Maximize />}
        </button>
      </div>

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
