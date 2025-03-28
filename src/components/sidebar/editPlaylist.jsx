import React, { useState } from "react";
import { HiOutlinePencil } from "react-icons/hi";

const PlaylistEditModal = () => {
  const [playlistName, setPlaylistName] = useState("Danh sách phát của tôi #3");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    console.log("Saved: ", { playlistName, description });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-[#282828] p-6 rounded-lg shadow-lg w-[550px] text-white">
        <h2 className="text-xl font-bold mb-4">Sửa thông tin chi tiết</h2>

        <div className="flex gap-6 mb-4">
          <div className="w-45 h-45 bg-[#454444] flex items-center justify-center rounded-md relative cursor-pointer hover:bg-gray-600">
            <HiOutlinePencil className="text-7xl" />
            <span className="absolute bottom-2 text-sm">Chọn ảnh</span>
          </div>
          <div className="flex-1">
            <input
              type="text"
              className="w-full p-2 mb-2 bg-[#3e3e3e] rounded text-white placeholder-gray-500"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            <textarea
              className="h-33 w-full p-2 bg-[#3e3e3e] rounded text-white placeholder-gray-500"
              placeholder="Thêm phần mô tả không bắt buộc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-white text-black font-semibold py-2 px-6 text-lg rounded-full hover:scale-105 transition-transform duration-200"
            onClick={handleSave}
          >
            Lưu
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Bằng cách tiếp tục, bạn đồng ý cho phép Spotify truy cập vào hình ảnh bạn đã chọn để tải lên. Vui lòng đảm bảo bạn có quyền tải lên hình ảnh.
        </p>
      </div>
    </div>
  );
};

export default PlaylistEditModal;
