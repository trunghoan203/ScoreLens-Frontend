import React from 'react';
import Image from 'next/image';

interface DashboardSummaryProps {
  totalTables: number;
  inUse: number;
  available: number;
  members: number;
}

const icons = [
  <Image key="group" src="/icon/group.svg" alt="Total Tables" width={32} height={32} className="mb-2" />,
  <Image key="empty" src="/icon/empty.svg" alt="Available" width={32} height={32} className="mb-2" />,
  <Image key="using" src="/icon/using.svg" alt="In Use" width={32} height={32} className="mb-2" />,
  <Image key="memberships" src="/icon/memberships.svg" alt="Members" width={32} height={32} className="mb-2" />,
];

export default function DashboardSummary({ totalTables, inUse, available, members }: DashboardSummaryProps) {
  const items = [
    { label: 'Tổng số bàn', value: totalTables, color: 'bg-green-300', dot: 'bg-green-400' },
    { label: 'Bàn trống', value: available, color: 'bg-white', dot: 'bg-red-500' },
    { label: 'Đang sử dụng', value: inUse, color: 'bg-lime-400', dot: 'bg-blue-500', active: true },
    { label: 'Hội viên', value: members, color: 'bg-white', dot: 'bg-purple-500' },
  ];
  return (
    <section>
      <div className="w-full rounded-xl bg-[#8ADB10] shadow-lg py-6 flex items-center justify-center mb-8">
        <span className="text-2xl font-extrabold text-[#FFFFFF] tracking-widest flex items-center gap-3">BẢNG ĐIỀU KHIỂN</span>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <div key={item.label} className={`rounded-2xl shadow border-2 flex flex-col items-center py-6 px-2 bg-[#FFFFFF] border-[#8ADB10]`}>
            {icons[idx]}
            <span className="text-3xl font-bold text-[#000000] mb-1">{item.value}</span>
            <span className="text-gray-700 text-sm font-semibold uppercase tracking-wide">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
} 