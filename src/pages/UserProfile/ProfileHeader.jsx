import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GoPencil } from "react-icons/go";
import { Modal, Input, message } from "antd";
import axios from "axios";
import { fetchUserInfo } from "../../redux/slice/userSlice";

function ProfileHeader() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const [isHoveredOuter, setIsHoveredOuter] = useState(false);
  const [isHoveredInner, setIsHoveredInner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(userInfo?.userName || "");
  const [newAvatar, setNewAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(
    userInfo?.avatar || "https://i.pravatar.cc/300"
  );

  const showModal = () => {
    setNewUsername(userInfo?.userName || "");
    setPreviewAvatar(userInfo?.avatar || "https://i.pravatar.cc/300");
    setIsModalOpen(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleOk = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Không tìm thấy token. Vui lòng đăng nhập lại.");
        return;
      }

      const formData = new FormData();
      if (newAvatar) {
        formData.append("avatar", newAvatar);
      }
      formData.append("userName", newUsername);

      console.log("Sending update request with username:", newUsername);
      if (newAvatar) {
        console.log("Avatar file:", newAvatar.name);
      }

      const response = await axios.put(
        "http://localhost:8082/api/user/me",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Update response:", response.data);

      if (response.status === 200) {
        message.success("Cập nhật hồ sơ thành công!");
        dispatch(fetchUserInfo());
        setIsModalOpen(false);
        setNewAvatar(null);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      message.error(
        err.response?.data?.message ||
          "Cập nhật hồ sơ thất bại. Vui lòng thử lại."
      );
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setNewAvatar(null);
    setPreviewAvatar(userInfo?.avatar || "https://i.pravatar.cc/300");
  };

  return (
    <div className="!w-full !max-w-none !p-0">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 flex items-center space-x-6 min-h-[250px]">
        <div
          className="relative w-[150px] h-[150px] rounded-full overflow-hidden cursor-pointer group"
          onMouseEnter={() => setIsHoveredOuter(true)}
          onMouseLeave={() => setIsHoveredOuter(false)}
          onClick={() => document.getElementById("avatarInput").click()}
        >
          <img
            src={userInfo?.avatar || "https://i.pravatar.cc/300"}
            alt="Avatar"
            className={`w-full h-full object-cover transition-all duration-300 ${
              isHoveredOuter ? "blur-xs brightness-75" : ""
            }`}
          />
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center bg-opacity-50 transition-opacity duration-300 ${
              isHoveredOuter ? "opacity-100" : "opacity-0"
            }`}
          >
            <GoPencil className="w-10 h-10 text-white mb-1" />
            <p className="text-white text-sm font-medium">Chọn ảnh</p>
          </div>
        </div>

        <div className="text-white">
          <p className="text-lg text-gray-300">Hồ sơ</p>
          <h1 className="text-6xl font-bold" onClick={showModal}>
            {userInfo?.userName || "User 01"}
          </h1>
          <p className="text-gray-400 text-lg mt-2">
            12 danh sách phát công khai{" "}
            <span className="text-white font-semibold">
              • 2 người theo dõi • 70 đang theo dõi
            </span>
          </p>
        </div>
        <input
          type="file"
          id="avatarInput"
          className="hidden"
          accept="image/*"
          onChange={handleAvatarChange}
        />
      </div>

      <Modal
        title="Chi tiết hồ sơ"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <div className="flex items-center gap-5">
          <div
            className="relative w-[120px] h-[120px] rounded-full overflow-hidden cursor-pointer group"
            onMouseEnter={() => setIsHoveredInner(true)}
            onMouseLeave={() => setIsHoveredInner(false)}
            onClick={() => document.getElementById("avatarInput").click()}
          >
            <img
              src={previewAvatar}
              alt="Avatar"
              className={`w-full h-full object-cover transition-all duration-300 ${
                isHoveredInner ? "blur-xs brightness-75" : ""
              }`}
            />
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center bg-opacity-50 transition-opacity duration-300 ${
                isHoveredInner ? "opacity-100" : "opacity-0"
              }`}
            >
              <GoPencil className="w-10 h-10 text-white mb-1" />
              <p className="text-white text-sm font-medium">Chọn ảnh</p>
            </div>
          </div>

          <div>
            <Input
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full !bg-zinc-700 !text-white"
              placeholder="Nhập tên người dùng mới"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProfileHeader;
