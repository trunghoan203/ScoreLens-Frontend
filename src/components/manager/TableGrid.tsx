import React from 'react';
import StatusBadge from './StatusBadge';

interface Table {
  id: string;
  name: string;
  type: string;
  status: 'empty' | 'inuse' | 'maintenance';
}

interface TableGridProps {
  tables: Table[];
  onTableClick?: (id: string) => void;
}

export default function TableGrid({ tables, onTableClick }: TableGridProps) {
  const formatCategory = (category: string) => {
    switch (category) {
      case 'pool-8':
        return 'Pool 8';
      case 'carom':
        return 'Carom';
      default:
        return category;
    }
  };

  return (
    <div className="rounded-lg overflow-hidden space-y-2">
      <div className="grid grid-cols-12 bg-[#000000] text-[#FFFFFF] font-semibold text-center">
        <div className="col-span-4 py-3">BÀN</div>
        <div className="col-span-4 py-3">LOẠI BÀN</div>
        <div className="col-span-4 py-3">TRẠNG THÁI</div>
      </div>

      <div className="space-y-2">
        {tables.map((table) => (
          <div
            key={table.id}
            className="grid grid-cols-12 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
            onClick={() => onTableClick && onTableClick(table.id)}
          >
            <div className="col-span-4 py-4 font-semibold text-[#000000] text-lg">{table.name}</div>
            <div className="col-span-4 py-4 uppercase text-gray-700 text-base">{formatCategory(table.type)}</div>
            <div className="col-span-4 py-4 flex justify-center items-center gap-2">
              <StatusBadge status={table.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
