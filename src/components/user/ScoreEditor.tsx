'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
  onSave: (scoreA: number, scoreB: number) => void;
  initialScoreA?: number;
  initialScoreB?: number;
}

export default function ScoreEditor({ onClose, onSave, initialScoreA = 0, initialScoreB = 0 }: Props) {
  const [scoreA, setScoreA] = useState(initialScoreA);
  const [scoreB, setScoreB] = useState(initialScoreB);

  const handleSave = async () => {
    onSave(scoreA, scoreB);
    toast.success('Đã cập nhật thành công!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md sm:max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-[#000000] mb-6">
          Sửa điểm trận đấu
        </h2>

        <div className="flex justify-between items-center mb-5">
          <div className="flex flex-col items-center">
            <p className="font-semibold text-sm text-[#000000] mb-1">Đội A</p>
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-2" />
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={scoreA}
                onChange={(e) => setScoreA(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-lg font-bold text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#8ADB10]"
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-3xl font-bold text-[#000000]">
            <span>{scoreA}</span>
            <span>:</span>
            <span>{scoreB}</span>
          </div>

          <div className="flex flex-col items-center">
            <p className="font-semibold text-sm text-[#000000] mb-1">Đội B</p>
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-2" />
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={scoreB}
                onChange={(e) => setScoreB(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-lg font-bold text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#8ADB10]"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="mb-5">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => setScoreA(0)} 
              className="text-[#000000] hover:bg-red-50"
            >
              Reset Team A
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setScoreB(0)} 
              className="text-[#000000] hover:bg-red-50"
            >
              Reset Team B
            </Button>
          </div>
        </div>



        <div className="flex gap-4">
          <Button
            onClick={onClose}
            style={{ backgroundColor: '#FF0000' }}
            className="w-full bg-[#FF0000] hover:bg-red-500 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            Huỷ
          </Button>
          <Button
            onClick={handleSave}
            style={{ backgroundColor: '#8ADB10' }}
            className="w-full bg-[#8ADB10] hover:bg-lime-500 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            Lưu điểm
          </Button>
        </div>
      </div>
    </div>
  );
}
