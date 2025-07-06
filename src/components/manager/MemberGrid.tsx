import React from 'react';

interface Member {
  id: string;
  name: string;
  phone: string;
  playTime: string;
}

interface MemberGridProps {
  members: Member[];
  onMemberClick?: (id: string) => void;
}

export default function MemberGrid({ members, onMemberClick }: MemberGridProps) {
  return (
    <div className="rounded-lg overflow-hidden space-y-2"> {/* Thêm space-y-2 để cách đều */}
      <div className="grid grid-cols-12 bg-black text-white font-semibold text-center">
        <div className="col-span-4 py-3">TÊN HỘI VIÊN</div>
        <div className="col-span-4 py-3">SỐ ĐIỆN THOẠI</div>
        <div className="col-span-4 py-3">THỜI GIAN CHƠI</div>
      </div>

      <div className="space-y-2"> {/* Cách đều các hàng */}
        {members.map((member) => (
          <div
            key={member.id}
            className="grid grid-cols-12 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
            onClick={() => onMemberClick && onMemberClick(member.id)}
          >
            <div className="col-span-4 py-4 font-semibold text-black text-lg">{member.name}</div>
            <div className="col-span-4 py-4 text-gray-700 text-base">{member.phone}</div>
            <div className="col-span-4 py-4 text-gray-700 text-base">{member.playTime}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
