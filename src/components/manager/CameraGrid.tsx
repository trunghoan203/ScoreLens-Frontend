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
}

export default function CameraGrid({ cameras, onCameraClick }: CameraGridProps) {
  return (
    <div className="rounded-lg overflow-hidden space-y-2"> 
      
      <div className="grid grid-cols-12 bg-[#000000] text-[#FFFFFF] font-semibold text-center rounded-t-lg">
        <div className="col-span-2 py-3">BÀN</div>
        <div className="col-span-3 py-3">IP</div>
        <div className="col-span-2 py-3">USERNAME</div>
        <div className="col-span-3 py-3">MẬT KHẨU</div>
        <div className="col-span-2 py-3">TRẠNG THÁI</div>
      </div>

      {cameras.map((camera) => (
        <div
          key={camera.id}
          className="grid grid-cols-12 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
          onClick={() => onCameraClick && onCameraClick(camera.id)}
        >
          <div className="col-span-2 py-4 font-semibold text-[#000000] text-lg">{camera.table}</div>
          <div className="col-span-3 py-4 text-gray-700 text-base">{camera.ip}</div>
          <div className="col-span-2 py-4 text-gray-700 text-base">{camera.username}</div>
          <div className="col-span-3 py-4 text-gray-700 text-base">{'•'.repeat(8)}</div>
          <div className="col-span-2 py-4 flex justify-center">
            <span
              className={`w-4 h-4 rounded-full inline-block ${
                camera.status === 'active' ? 'bg-green-500' : 'bg-red-500'
              }`}
            ></span>
          </div>
        </div>
      ))}
    </div>
  );
}
