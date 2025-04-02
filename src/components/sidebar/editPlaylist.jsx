import React, { useState } from "react";
import { HiOutlinePencil } from "react-icons/hi";
import { X } from "lucide-react";

const PlaylistEditModal = ({ isOpen, onClose, title, description, cover }) => {
  const [playlistName, setPlaylistName] = useState(title || "Rap On Trap");
  const [newDescription, setNewDescription] = useState(description || "");

  if (!isOpen) return null;

  const handleSave = () => {
    console.log("Saved: ", { playlistName, description: newDescription });
    onClose(); // Đóng modal sau khi lưu
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg w-[550px] text-white">
        {/* Tiêu đề và nút đóng */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sửa thông tin chi tiết</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Nội dung modal */}
        <div className="flex gap-4 mb-4">
          {/* Ảnh bìa */}
          <div className="relative group w-40 h-40">
            <img
              src={cover || "https://via.placeholder.com/150"}
              alt="Playlist Cover"
              className="w-40 h-40 object-cover rounded-sm transition-opacity group-hover:opacity-70"
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-sm">
              <HiOutlinePencil className="text-4xl text-white" />
              <span className="text-sm text-white mt-1">Chọn ảnh</span>
            </div>
          </div>
          {/* Form chỉnh sửa */}
          <div className="flex-1">
            <input
              type="text"
              className="w-full p-3 bg-[#3e3e3e] rounded text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            <textarea
              className="w-full p-3 mt-2 bg-[#3e3e3e] rounded text-white text-sm placeholder-gray-600 h-27 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Thêm phần mô tả không bắt buộc"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Nút Lưu */}
        <div className="flex justify-end">
          <button
            className="bg-white text-black font-semibold py-2 px-6 rounded-full hover:bg-gray-200 transition"
            onClick={handleSave}
          >
            Lưu
          </button>
        </div>

        {/* Thông báo */}
        <p className="text-xs text-gray-400 mt-4">
          Bằng cách tiếp tục, bạn đồng ý cho phép Spotify truy cập vào hình ảnh
          bạn đã chọn để tải lên. Vui lòng đảm bảo bạn có quyền tải lên hình
          ảnh.
        </p>
      </div>
    </div>
  );
};

export default PlaylistEditModal;
