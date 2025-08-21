import React from 'react';

interface Camera {
  id: string;
  table: string;
  ip: string;
  username: string;
  password: string;
  status: 'active' | 'inactive';
}

interface CameraGridProps {
  cameras: Camera[];
  onCameraClick?: (id: string) => void;
  onViewCamera?: (id: string) => void;
}

export default function CameraGrid({ cameras, onCameraClick, onViewCamera }: CameraGridProps) {
  return (
    <div className="rounded-lg overflow-hidden space-y-2">

      <div className="grid grid-cols-12 bg-[#000000] text-[#FFFFFF] font-semibold text-center rounded-t-lg">
        <div className="col-span-2 py-3">BÀN</div>
        <div className="col-span-2 py-3">IP</div>
        <div className="col-span-2 py-3">USERNAME</div>
        <div className="col-span-2 py-3">MẬT KHẨU</div>
        <div className="col-span-2 py-3">TRẠNG THÁI</div>
        <div className="col-span-2 py-3">HÀNH ĐỘNG</div>
      </div>

      {cameras.map((camera) => (
        <div
          key={camera.id}
          className="grid grid-cols-12 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
          onClick={() => onCameraClick && onCameraClick(camera.id)}
        >
          <div className="col-span-2 py-4 font-semibold text-[#000000] text-lg">{camera.table}</div>
          <div className="col-span-2 py-4 text-gray-700 text-base">{camera.ip}</div>
          <div className="col-span-2 py-4 text-gray-700 text-base">{camera.username}</div>
          <div className="col-span-2 py-4 text-gray-700 text-base">{'•'.repeat(8)}</div>
          <div className="col-span-2 py-4 flex justify-center items-center gap-2">
            <span className={`w-30 px-4 py-2 rounded-full text-white font-semibold text-sm min-w-[120px] text-center
              ${camera.status === 'active' ? 'bg-green-500'
                : 'bg-red-500'}`}
            >
              {camera.status === 'active' ? 'Đã kết nối' : 'Chưa kết nối'}
            </span>
          </div>
          <div className="col-span-2 py-4 flex justify-center items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewCamera && onViewCamera(camera.id);
              }}
              disabled={camera.status !== 'active'}
              className={`w-30 px-4 py-2 rounded-full text-white font-semibold text-sm min-w-[120px] text-center ${
                camera.status === 'active'
                  ? 'bg-blue-600 hover:bg-blue-700 text-[#FFFFFF] cursor-pointer'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              Xem Camera
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
