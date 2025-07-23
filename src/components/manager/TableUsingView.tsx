import { Button } from '@/components/ui/button';
import TableStatusBadge from './TableStatusBadge';

interface TableUsingViewProps {
  table: {
    id: string;
    name: string;
    teamA: string[];
    teamB: string[];
    time?: string;
  };
  onBack: () => void;
  onEndMatch: () => void;
  onEdit?: () => void;
}

export default function TableUsingView({ table, onBack, onEndMatch, onEdit }: TableUsingViewProps) {
  return (
    <div className="border border-lime-200 rounded-lg p-8 bg-[#FFFFFF] mx-auto text-[#000000]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Quản lí bàn</h2>
        <TableStatusBadge status="using" />
      </div>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">{table.name}</h3>
      </div>
      <div className="flex justify-center gap-8 mb-6">
        {/* Team A */}
        <div className="flex flex-col items-center">
          <div className="font-semibold mb-2">Team A</div>
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-2" />
          <div className="text-center text-sm">
            {table.teamA.map((player, idx) => (
              <div key={idx}>{player}</div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center font-bold text-xl">VS</div>
        {/* Team B */}
        <div className="flex flex-col items-center">
          <div className="font-semibold mb-2">Team B</div>
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-2" />
          <div className="text-center text-sm">
            {table.teamB.map((player, idx) => (
              <div key={idx}>{player}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center mb-6 text-lg font-mono">{table.time || '01:23:45'}</div>
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          className="min-w-[120px] px-8 py-3 text-lg font-bold rounded-xl shadow transition"
          onClick={onBack}
        >
          Quay lại
        </Button>
        <Button
          variant="lime"
          className="min-w-[120px] px-8 py-3 text-lg font-bold rounded-xl shadow transition"
          onClick={onEdit}
        >
          Chỉnh sửa
        </Button>
        <Button
          variant="destructive"
          className="min-w-[120px] px-8 py-3 text-lg font-bold rounded-xl shadow transition"
          onClick={onEndMatch}
        >
          Kết thúc
        </Button>
      </div>
    </div>
  );
} 