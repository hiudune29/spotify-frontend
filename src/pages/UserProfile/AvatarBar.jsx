import React from 'react';
import { Avatar } from 'antd';
import { useState } from 'react';



const mockData = [
  {
    avatar: "https://i.pravatar.cc/150?img=1",
    displayname: "Nguyễn Văn A"
  },
  {
    avatar: "https://i.pravatar.cc/150?img=2",
    displayname: "Trần Thị B"
  },
  {
    avatar: "https://i.pravatar.cc/150?img=3",
    displayname: "Lê Văn C"
  },
  {
    avatar: "https://i.pravatar.cc/150?img=4",
    displayname: "Phạm Thị D"
  },
  {
    avatar: "https://i.pravatar.cc/150?img=5",
    displayname: "Hoàng Văn E"
  },
  {
    avatar: "https://i.pravatar.cc/150?img=6",
    displayname: "Đặng Thị F"
  },

];




function AvatarBar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  return (
    <div className='p-6 bg-zinc-950'>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold text-white">Avatar</h1>
        <span className="text-lg text-gray-400 cursor-pointer hover:text-white">Xem tất cả</span>
      </div>
      <div className='flex flex-row flex-nowrap overflow-hidden gap-4 place-content-around'>
        {
          mockData.map( (item,index) => (
            <div className='flex flex-col hover:bg-gray-700 p-4 rounded-lg relative' onMouseLeave={() => setHoveredIndex(null)} onMouseEnter={() => setHoveredIndex(index)}>
              <Avatar src={item.avatar} size={180} />
              <p className='text-start text-xl font-medium mt-3'>{item.displayname}</p>
              <p className="self-start text-xl font-medium mt-2 text-gray-400">Artist</p>
              <svg
                width="70"
                height="70"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`absolute bottom-10 right-0 transition-opacity duration-200 ${hoveredIndex === index ? "opacity-100" : "opacity-0"
                  }`}
              >
                <circle cx="30" cy="30" r="30" fill="#1ED760" />
                <polygon points="23,18 45,30 23,42" fill="black" />
              </svg>

            </div>
          ))
        }
      </div>


    </div>
  )
}

export default AvatarBar;