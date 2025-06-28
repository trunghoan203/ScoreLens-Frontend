import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import TableStatusBadge from './TableStatusBadge';
import toast from 'react-hot-toast';

interface TableAvailableViewProps {
  table: { id: string; name: string };
  onReady: (teamA: string[], teamB: string[]) => void;
}

export default function TableAvailableView({ table, onReady }: TableAvailableViewProps) {
  const [teamA, setTeamA] = useState(['']);
  const [teamB, setTeamB] = useState(['']);

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
    <div className="border border-lime-200 rounded-lg p-8 bg-white mx-auto text-black">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Quản lí bàn</h2>
        <TableStatusBadge status="available" />
      </div>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">{table.name}</h3>
      </div>
      <div className="flex justify-center gap-8 mb-6">
        {/* Team A */}
        <div>
          <div className="font-semibold mb-2">Team A</div>
          {teamA.map((player, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <Input
                value={player}
                onChange={e => handleChange('A', idx, e.target.value)}
                placeholder={`Người Chơi ${idx + 1}`}
              />
              {idx === 0 ? (
                <Button size="icon" variant="outline" onClick={() => handleAddPlayer('A')}>
                  <Plus size={16} />
                </Button>
              ) : (
                <Button size="icon" variant="outline" onClick={() => handleRemovePlayer('A', idx)}>
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center font-bold text-xl">VS</div>
        {/* Team B */}
        <div>
          <div className="font-semibold mb-2">Team B</div>
          {teamB.map((player, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <Input
                value={player}
                onChange={e => handleChange('B', idx, e.target.value)}
                placeholder={`Người Chơi ${idx + 1}`}
              />
              {idx === 0 ? (
                <Button size="icon" variant="outline" onClick={() => handleAddPlayer('B')}>
                  <Plus size={16} />
                </Button>
              ) : (
                <Button size="icon" variant="outline" onClick={() => handleRemovePlayer('B', idx)}>
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mb-6 text-lg font-mono">00:00:00</div>
      <div className="flex justify-center">
        <Button variant="lime" className="px-12 py-3 text-lg font-bold" onClick={handleReady}>Bắt đầu</Button>
      </div>
    </div>
  );
} 