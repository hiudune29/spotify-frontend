import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  playNextSong,
  playPreviousSong,
  togglePlay,
  toggleRandom,
  setRepeatMode,
  fetchRandomSong,
  clearQueue, // Thêm clearQueue vào đây
  setQueue, // Thêm setQueue vào đây
  setCurrentSong, // Thêm setCurrentSong vào đây
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
    // Nếu bật chế độ lặp lại, tắt chế độ ngẫu nhiên
    if (isRandom) {
      dispatch(toggleRandom());
    }
    const nextMode = (repeatMode + 1) % 3;
    dispatch(setRepeatMode(nextMode));
  };

  const handleToggleRandom = () => {
    if (!currentSong) return;
    // Nếu bật chế độ ngẫu nhiên, tắt chế độ lặp lại
    if (repeatMode > 0) {
      dispatch(setRepeatMode(0));
    }
    dispatch(toggleRandom());
  };

  const handleNextSong = () => {
    if (!currentSong || queue.length === 0) return;

    const currentIndex = queue.findIndex(
      (s) => s.songId === currentSong.songId
    );

    // Nếu đang ở bài cuối cùng
    if (currentIndex === queue.length - 1) {
      // Chỉ cho phép phát lại từ đầu nếu repeatMode === 2 (lặp lại playlist/album)
      if (repeatMode === 2) {
        dispatch(playNextSong());
      }
      return;
    }

    dispatch(playNextSong());
  };

  const handlePreviousSong = () => {
    if (!currentSong || queue.length === 0) return;

    const currentIndex = queue.findIndex(
      (s) => s.songId === currentSong.songId
    );

    // Nếu đang ở bài đầu tiên
    if (currentIndex === 0) {
      // Chỉ cho phép phát bài cuối nếu repeatMode === 2 (lặp lại playlist/album)
      if (repeatMode === 2) {
        dispatch(playPreviousSong());
      }
      return;
    }

    dispatch(playPreviousSong());
  };

  const handleSongEnded = async () => {
    if (repeatMode === 1) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    const currentIndex = queue.findIndex(
      (s) => s?.songId === currentSong?.songId
    );

    // Debug log để kiểm tra giá trị currentSong
    console.log("Current song before fetch:", {
      currentSong,
      songId: currentSong?.songId,
    });

    if (currentIndex === queue.length - 1 || queue.length === 0) {
      console.log("Queue ended, fetching random song...");

      if (repeatMode === 2) {
        dispatch(playNextSong());
      } else {
        try {
          // Kiểm tra currentSong tồn tại trước khi truy cập songId
          const excludeSongId = currentSong?.songId || undefined;

          // Clear queue cũ
          dispatch(clearQueue());

          // Log để debug
          console.log("Fetching random song with exclude id:", excludeSongId);

          // Fetch random song với proper error handling
          const result = await dispatch(
            fetchRandomSong(excludeSongId)
          ).unwrap();

          if (result) {
            console.log("Random song received:", result);
            dispatch(setQueue([result]));
            dispatch(setCurrentSong(result));
            dispatch(togglePlay(true));
          } else {
            console.error("Received empty result from random song fetch");
          }
        } catch (error) {
          console.error("Error fetching random song:", error);
        }
      }
    } else {
      dispatch(playNextSong());
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
            title={isRandom ? "Tắt phát ngẫu nhiên" : "Bật phát ngẫu nhiên"}
          >
            <FaRandom />
          </button>
          <button
            className="control-btn"
            onClick={handlePreviousSong}
            disabled={
              !currentSong ||
              queue.length === 0 ||
              (queue.findIndex((s) => s.songId === currentSong.songId) === 0 &&
                repeatMode !== 2)
            }
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
            disabled={
              !currentSong ||
              queue.length === 0 ||
              (queue.findIndex((s) => s.songId === currentSong.songId) ===
                queue.length - 1 &&
                repeatMode !== 2)
            }
          >
            <FaStepForward />
          </button>
          <button
            className={`control-btn ${repeatMode > 0 ? "active" : ""}`}
            onClick={toggleRepeat}
            disabled={!currentSong}
            title={
              repeatMode === 0
                ? "Bật lặp lại"
                : repeatMode === 1
                ? "Lặp lại một bài"
                : "Lặp lại playlist"
            }
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
