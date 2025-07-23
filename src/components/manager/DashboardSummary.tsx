import React from 'react';

interface DashboardSummaryProps {
  totalTables: number;
  inUse: number;
  available: number;
  members: number;
}

const icons = [
  // Tổng số bàn - icon bàn bida
  <svg key="bida" className="w-8 h-8 mb-2 text-lime-500" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" />
    <circle cx="12" cy="12" r="4" fill="currentColor" className="text-lime-400" />
    <circle cx="8.5" cy="10" r="1.2" fill="#fff" />
    <circle cx="15.5" cy="14" r="1.2" fill="#fff" />
  </svg>,
  // Đang sử dụng - icon đồng hồ
  <svg key="clock" className="w-8 h-8 mb-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" strokeLinecap="round" />
  </svg>,
  // Bàn trống - icon check
  <svg key="check" className="w-8 h-8 mb-2 text-green-400" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Hội viên - icon user group
  <svg key="users" className="w-8 h-8 mb-2 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <circle cx="8" cy="10" r="3" />
    <circle cx="16" cy="10" r="3" />
    <path d="M2 20c0-2.5 3.5-4 6-4s6 1.5 6 4" />
    <path d="M14 20c0-1.5 2-2.5 4-2.5s4 1 4 2.5" />
  </svg>,
];

export default function DashboardSummary({ totalTables, inUse, available, members }: DashboardSummaryProps) {
  const items = [
    { label: 'Tổng số bàn', value: totalTables, color: 'bg-green-300', dot: 'bg-green-400' },
    { label: 'Đang sử dụng', value: inUse, color: 'bg-lime-400', dot: 'bg-blue-500', active: true },
    { label: 'Bàn trống', value: available, color: 'bg-white', dot: 'bg-red-500' },
    { label: 'Hội viên', value: members, color: 'bg-white', dot: 'bg-purple-500' },
  ];
  return (
    <section className="my-6">
      <div className="w-full rounded-xl bg-[#8ADB10] shadow-lg py-6 flex items-center justify-center mb-8">
        <span className="text-2xl font-extrabold text-[#FFFFFF] tracking-widest flex items-center gap-3">BẢNG ĐIỀU KHIỂN - TỔNG QUAN</span>
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