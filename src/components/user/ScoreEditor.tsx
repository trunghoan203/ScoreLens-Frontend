'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  onClose: () => void;
  onSave: (scoreA: number, scoreB: number, note: string) => void;
  initialScoreA?: number;
  initialScoreB?: number;
}

export default function ScoreEditor({ onClose, onSave }: Props) {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleScoreChange = (team: 'A' | 'B', delta: number) => {
    if (team === 'A') setScoreA((prev) => Math.max(0, prev + delta));
    else setScoreB((prev) => Math.max(0, prev + delta));
  };

  const handleSave = async () => {
    onSave(scoreA, scoreB, note);
    onClose();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md sm:max-w-lg shadow-lg">
          <p className="text-center text-[#000000] text-sm">Đang tải điểm số...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md sm:max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-[#000000] mb-6">
          Sửa điểm trận đấu
        </h2>

        <div className="flex justify-between items-center mb-5">
          <div className="flex flex-col items-center">
            <p className="font-semibold text-sm text-[#000000] mb-1">Team A</p>
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-2" />
          </div>

          <div className="flex items-center gap-3 text-3xl font-bold text-[#000000]">
            <div className="border border-gray-400 px-4 py-2 rounded">{scoreA}</div>
            <span>:</span>
            <div className="border border-gray-400 px-4 py-2 rounded">{scoreB}</div>
          </div>

          <div className="flex flex-col items-center">
            <p className="font-semibold text-sm text-[#000000] mb-1">Team B</p>
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-2" />
          </div>
        </div>

        <div className="mb-5">
          <p className="text-sm font-semibold text-[#000000] mb-2">Thao tác nhanh</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => handleScoreChange('A', 1)} className="text-[#000000]">
              +1 Team A
            </Button>
            <Button variant="outline" onClick={() => handleScoreChange('B', 1)} className="text-[#000000]">
              +1 Team B
            </Button>
            <Button variant="outline" onClick={() => handleScoreChange('A', -1)} className="text-[#000000]">
              -1 Team A
            </Button>
            <Button variant="outline" onClick={() => handleScoreChange('B', -1)} className="text-[#000000]">
              -1 Team B
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-semibold text-[#000000] mb-1">Ghi chú</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Thêm ghi chú về trận đấu (tuỳ chọn)..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-[#000000] resize-none focus:outline-none focus:ring-2 focus:ring-[#8ADB10]"
            rows={3}
          />
        </div>

        <div className="flex gap-4">
          <Button
            onClick={onClose}
            className="w-full bg-[#FF0000] hover:bg-red-500 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            Huỷ
          </Button>
          <Button
            onClick={handleSave}
            className="w-full bg-[#8ADB10] hover:bg-lime-500 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            Lưu điểm
          </Button>
        </div>
      </div>
    </div>
  );
}
