const ButtonPlay = ({ onClick }) => {
  return (
    <button className="bg-[#1ed760] rounded-full w-15 h-15 flex items-center justify-center hover:bg-[#36F479] hover:cursor-pointer transition hover:scale-105 duration-200 ease-in-out">
      <svg
        className="w-8 h-8 text-black"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 3v18l15-9L5 3z" />
      </svg>
    </button>
  );
};

export default ButtonPlay;
