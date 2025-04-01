import React, { useState } from "react";
import { Avatar } from "antd";

const mockData = [
  { avatar: "https://i.pravatar.cc/150?img=1", displayname: "Nguyễn Văn A" },
  { avatar: "https://i.pravatar.cc/150?img=2", displayname: "Trần Thị B" },
  { avatar: "https://i.pravatar.cc/150?img=3", displayname: "Lê Văn C" },
  { avatar: "https://i.pravatar.cc/150?img=4", displayname: "Phạm Thị D" },
  { avatar: "https://i.pravatar.cc/150?img=5", displayname: "Hoàng Văn E" },
  { avatar: "https://i.pravatar.cc/150?img=6", displayname: "Đặng Thị F" },
  { avatar: "https://i.pravatar.cc/150?img=2", displayname: "Trần Thị B" },
  { avatar: "https://i.pravatar.cc/150?img=3", displayname: "Lê Văn C" },
  { avatar: "https://i.pravatar.cc/150?img=4", displayname: "Phạm Thị D" },
  { avatar: "https://i.pravatar.cc/150?img=5", displayname: "Hoàng Văn E" },
  { avatar: "https://i.pravatar.cc/150?img=6", displayname: "Đặng Thị F" },
];

function AllAvatar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="bg-zinc-950 min-h-screen p-8 text-white">
      <h1 className="text-3xl font-bold mb-2">Nghệ sĩ hàng đầu tháng này</h1>
      <p className="text-gray-400 mb-6">Chỉ hiển thị với bạn</p>
      <div className="grid grid-cols-5 gap-6">
        {mockData.map((item, index) => (
          <div
            className="flex flex-col items-center hover:bg-gray-700 p-5 rounded-lg relative"
            onMouseLeave={() => setHoveredIndex(null)}
            onMouseEnter={() => setHoveredIndex(index)}
          >
            <Avatar src={item.avatar} size={220} />
            <p className="self-start text-xl font-medium mt-3">{item.displayname}</p>
            <p className="self-start text-xl font-medium mt-2 text-gray-400">Artist</p>

            {hoveredIndex === index && (
              <svg
                width="70"
                height="70"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute bottom-24 right-4 transition-transform duration-200 opacity-100 scale-105"
              >
                <circle cx="30" cy="30" r="30" fill="#1ED760" />
                <polygon points="23,18 45,30 23,42" fill="black" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllAvatar;
