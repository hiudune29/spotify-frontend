const ButtonPlay = ({ onClick, isPlaying }) => {
  return (
    <button
      onClick={onClick}
      className="hover:cursor-pointer bg-[#1ed760] text-black rounded-full w-12 h-12 flex items-center justify-center"
    >
      {isPlaying ? (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
};

export default ButtonPlay;
