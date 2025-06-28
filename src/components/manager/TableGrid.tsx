import React from 'react';

interface Table {
  id: string;
  name: string;
  type: string;
  status: 'using' | 'available';
}

interface TableGridProps {
  tables: Table[];
  onTableClick?: (id: string) => void;
}

export default function TableGrid({ tables, onTableClick }: TableGridProps) {
  return (
    <div className="rounded-lg overflow-hidden">
      <div className="grid grid-cols-12 bg-black text-white font-semibold text-center">
        <div className="col-span-4 py-3">BÀN</div>
        <div className="col-span-4 py-3">LOẠI BÀN</div>
        <div className="col-span-4 py-3">TRẠNG THÁI</div>
      </div>
      {tables.map((table) => (
        <div
          key={table.id}
          className="grid grid-cols-12 items-center text-center bg-gray-200 mb-2 rounded-lg cursor-pointer hover:bg-lime-50 transition"
          onClick={() => onTableClick && onTableClick(table.id)}
        >
          <div className="col-span-4 py-4 font-semibold text-black text-lg">{table.name}</div>
          <div className="col-span-4 py-4 uppercase text-gray-700 text-base">{table.type}</div>
          <div className="col-span-4 py-4 flex justify-center">
            <span className={`w-4 h-4 rounded-full inline-block ${table.status === 'using' ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </div>
        </div>
      ))}
    </div>
  );
} 