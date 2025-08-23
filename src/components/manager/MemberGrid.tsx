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
    <div className="w-full">
      <div className="hidden lg:block overflow-x-auto">
        <div className="space-y-2 rounded-lg min-w-[800px]">
          <div className="grid grid-cols-12 bg-black text-white font-semibold text-center">
            <div className="col-span-4 py-3 text-sm xl:text-base">TÊN HỘI VIÊN</div>
            <div className="col-span-4 py-3 text-sm xl:text-base">SỐ ĐIỆN THOẠI</div>
            <div className="col-span-4 py-3 text-sm xl:text-base">TRẠNG THÁI</div>
          </div>
          {members.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-12 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
              onClick={() => onMemberClick && onMemberClick(member.id)}
            >
              <div className="col-span-4 py-4 font-semibold text-black text-sm xl:text-base px-2">{member.name}</div>
              <div className="col-span-4 py-4 text-gray-700 text-sm xl:text-base px-2">{member.phone}</div>
              <div className="col-span-4 py-4 flex justify-center px-2">
                <span className={`px-3 py-1 rounded-full text-white font-semibold text-xs xl:text-sm
                  ${member.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  {member.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="block lg:hidden space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-shadow touch-manipulation"
            onClick={() => onMemberClick && onMemberClick(member.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-base mb-1">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.phone}</p>
              </div>
              <div className="ml-3 flex-shrink-0">
                <span className={`px-2 py-1 rounded-full text-white font-semibold text-xs
                  ${member.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  {member.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-medium">Trạng thái:</span>
                <span className={`text-xs font-medium ${member.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  {member.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-end">
                <span className="text-lime-600 text-xs font-medium">Nhấn để xem chi tiết →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
