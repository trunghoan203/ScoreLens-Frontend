import React from 'react';
import TableCard from './TableCard';

interface Table {
  id: string;
  name: string;
  type: string;
  status: 'inuse' | 'empty' | 'maintenance' | 'using' | 'available';
  teamA?: string;
  teamB?: string;
  time?: string;
}

interface TableCardListProps {
  tables: Table[];
  onDetail?: (id: string) => void;
}

export default function TableCardList({ tables, onDetail }: TableCardListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {tables.map(table => (
        <TableCard
          key={table.id}
          name={table.name}
          type={table.type}
          status={table.status}
          teamA={table.teamA}
          teamB={table.teamB}
          time={table.time}
          onDetail={onDetail ? () => onDetail(table.id) : () => {}}
        />
      ))}
    </div>
  );
} 