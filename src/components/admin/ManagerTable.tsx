import React from 'react';
import { useRouter } from 'next/navigation';

interface Manager {
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  managerId?: string;
}

export default function ManagerTable({ managers }: { managers: Manager[] }) {
  const router = useRouter();
  return (
    <div className="space-y-2 rounded-lg overflow-hidden">
      <div className="grid grid-cols-12 bg-black text-white font-semibold text-center">
        <div className="col-span-3 py-3">TÊN QUẢN LÝ</div>
        <div className="col-span-3 py-3">SỐ ĐIỆN THOẠI</div>
        <div className="col-span-4 py-3">EMAIL</div>
        <div className="col-span-2 py-3">TRẠNG THÁI</div>
      </div>
      {managers.map((m, idx) => (
        <div
          key={m.managerId || idx}
          className="grid grid-cols-12 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
          onClick={() => router.push(`/admin/managers/${m.managerId}`)}
        >
          <div className="col-span-3 py-4 font-semibold text-black">{m.name}</div>
          <div className="col-span-3 py-4 text-gray-700">{m.phone}</div>
          <div className="col-span-4 py-4 text-gray-700">{m.email}</div>
          <div className="col-span-2 py-4 flex justify-center">
            <span
              className={`w-4 h-4 rounded-full inline-block ${
                m.status === 'active' ? 'bg-green-500' : 'bg-red-500'
              }`}
            ></span>
          </div>
        </div>
      ))}
    </div>
  );
}
