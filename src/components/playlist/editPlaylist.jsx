import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { HiOutlinePencil } from "react-icons/hi";
import { X } from "lucide-react";
import { updatePlaylist } from "../../redux/slice/playlistSlice";

const PlaylistEditModal = ({
  isOpen,
  onClose,
  name,
  description,
  cover,
  playlistId,
}) => {
  const dispatch = useDispatch();
  const [playlistName, setPlaylistName] = useState(name || "");
  const [newDescription, setNewDescription] = useState(description || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    if (isOpen) {
      setPlaylistName(name || "");
      setNewDescription(description || "");
      setAvatarFile(null);
    }
  }, [isOpen, name, description]);

  const handleSave = async () => {
    await dispatch(
      updatePlaylist({
        id: playlistId,
        playlistData: {
          name: playlistName, // Changed from title to name
          description: newDescription,
        },
        avatarFile,
      })
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg w-[550px] text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sửa thông tin chi tiết</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="relative group w-40 h-40">
            <img
              src={
                avatarFile
                  ? URL.createObjectURL(avatarFile)
                  : cover || "https://via.placeholder.com/150"
              }
              alt="Playlist Cover"
              className="w-40 h-40 object-cover rounded-sm transition-opacity group-hover:opacity-70"
            />
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              ref={fileInputRef}
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="hidden"
            />
            <div
              className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-sm cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <HiOutlinePencil className="text-4xl text-white" />
              <span className="text-sm text-white mt-1">Chọn ảnh</span>
            </div>
          </div>
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

        <div className="flex justify-end">
          <button
            className="bg-white text-black font-semibold py-2 px-6 rounded-full hover:bg-gray-200 transition"
            onClick={handleSave}
          >
            Lưu
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Bằng cách tiếp tục, bạn đồng ý cho phép hệ thống truy cập vào hình ảnh
          bạn đã chọn để tải lên.
        </p>
      </div>
    </div>
  );
};

export default PlaylistEditModal;
