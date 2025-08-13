import React from 'react';

interface Member {
  id: string;
  name: string;
  phone: string;
  status: 'active' | 'inactive';
}

interface MemberGridProps {
  members: Member[];
  onMemberClick?: (id: string) => void;
}

export default function MemberGrid({ members, onMemberClick }: MemberGridProps) {
  return (
    <div className="rounded-lg overflow-hidden space-y-2">
      <div className="grid grid-cols-12 bg-[#000000] text-[#FFFFFF] font-semibold text-center">
        <div className="col-span-4 py-3">TÊN HỘI VIÊN</div>
        <div className="col-span-4 py-3">SỐ ĐIỆN THOẠI</div>
        <div className="col-span-4 py-3">TRẠNG THÁI</div>
      </div>

      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="grid grid-cols-12 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
            onClick={() => onMemberClick && onMemberClick(member.id)}
          >
            <div className="col-span-4 py-4 font-semibold text-[#000000] text-lg">{member.name}</div>
            <div className="col-span-4 py-4 text-gray-700 text-base">{member.phone}</div>
            <div className="col-span-4 py-4 flex justify-center items-center gap-2">
              <span className={`w-34 px-2 py-2 rounded-full text-white font-semibold text-sm min-w-[120px] flex items-center justify-center text-center
                ${member.status === 'active' ? 'bg-green-500'
                  : 'bg-red-500'}`}
              >
                {member.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
