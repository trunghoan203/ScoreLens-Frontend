import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TableStatusBadge from './TableStatusBadge';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface TableAvailableViewProps {
  table: { id: string; name: string };
  onReady: (teamA: string[], teamB: string[]) => void;
  loading?: boolean;
}

export default function TableAvailableView({ table, onReady, loading = false }: TableAvailableViewProps) {
  const [teamA, setTeamA] = useState(['']);
  const [teamB, setTeamB] = useState(['']);
  const router = useRouter();

  const handleChange = (team: 'A' | 'B', index: number, value: string) => {
    const setter = team === 'A' ? setTeamA : setTeamB;
    const current = team === 'A' ? teamA : teamB;
    const updated = [...current];
    updated[index] = value;
    setter(updated);
  };

  const handleAddPlayer = (team: 'A' | 'B') => {
    const setter = team === 'A' ? setTeamA : setTeamB;
    const current = team === 'A' ? teamA : teamB;
    if (current.length >= 4) {
      toast.error('Không thể thêm quá 4 người chơi!', {
        style: {
          background: '#ef4444', // đỏ tươi
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1rem',
          borderRadius: '0.75rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#ef4444'
        }
      });
      return;
    }
    setter([...current, '']);
  };

  const handleRemovePlayer = (team: 'A' | 'B', index: number) => {
    if (index === 0) return;
    const setter = team === 'A' ? setTeamA : setTeamB;
    const current = team === 'A' ? teamA : teamB;
    const updated = [...current];
    updated.splice(index, 1);
    setter(updated);
  };

  const handleReady = () => {
    onReady(teamA, teamB);
  };

  return (
    <div className="border border-lime-200 rounded-lg p-8 bg-[#FFFFFF] mx-auto text-[#000000]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Quản lí bàn</h2>
        <TableStatusBadge status="available" />
      </div>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">{table.name}</h3>
      </div>
      <div className="flex justify-center gap-8 mb-6">
        <div>
          <div className="font-semibold mb-2">Team A</div>
          {teamA.map((player, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <Input
                value={player}
                onChange={e => handleChange('A', idx, e.target.value)}
                placeholder={`Người Chơi ${idx + 1}`}
                disabled={loading}
              />
              {idx === 0 ? (
                <Button size="icon" variant="ghost" onClick={() => handleAddPlayer('A')} disabled={loading} className="hover:bg-transparent">
                  <Image src="/icon/plus-circle.svg" width={25} height={25} alt="Thêm người chơi" />
                </Button>
              ) : (
                <Button size="icon" variant="ghost" onClick={() => handleRemovePlayer('A', idx)} disabled={loading} className="hover:bg-transparent">
                  <Image src="/icon/trash-2.svg" width={25} height={25} alt="Xóa người chơi" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center font-bold text-xl">VS</div>
        <div>
          <div className="font-semibold mb-2">Team B</div>
          {teamB.map((player, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <Input
                value={player}
                onChange={e => handleChange('B', idx, e.target.value)}
                placeholder={`Người Chơi ${idx + 1}`}
                disabled={loading}
              />
              {idx === 0 ? (
                <Button size="icon" variant="ghost" onClick={() => handleAddPlayer('B')} disabled={loading} className="hover:bg-transparent">
                  <Image src="/icon/plus-circle.svg" width={25} height={25} alt="Thêm người chơi" />
                </Button>
              ) : (
                <Button size="icon" variant="ghost" onClick={() => handleRemovePlayer('B', idx)} disabled={loading} className="hover:bg-transparent">
                  <Image src="/icon/trash-2.svg" width={25} height={25} alt="Xóa người chơi" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mb-6 text-lg font-mono">00:00:00</div>
      <div className="flex justify-center gap-4">
        <button
          type="button"
          className="w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 rounded-lg transition text-lg"
          onClick={() => router.back()}
        >
          Quay lại
        </button>
        <button
          type="button"
          onClick={handleReady}
          disabled={loading}
          className="w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 rounded-lg transition text-lg"
        >
          {loading ? 'Đang tạo trận đấu...' : 'Sẵn sàng'}
        </button>
      </div>
    </div>
  );
} 