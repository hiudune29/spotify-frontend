import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center bg-green-600 p-4">
      <div className="text-white text-2xl font-bold">
        Spotify
      </div>
      <ul className="flex space-x-6">
        <li className="text-white cursor-pointer hover:text-gray-300">Home</li>
        <li className="text-white cursor-pointer hover:text-gray-300">Search</li>
        <li className="text-white cursor-pointer hover:text-gray-300">Your Library</li>
      </ul>
      <div className="flex items-center">
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          className="rounded-full"
        />
      </div>
    </nav>
  );
};

export default Navbar;