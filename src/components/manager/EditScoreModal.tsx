import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

interface EditScoreModalProps {
  open: boolean;
  teamAScore: number;
  teamBScore: number;
  onSave: (teamAScore: number, teamBScore: number) => void;
  onCancel: () => void;
}

export const EditScoreModal: React.FC<EditScoreModalProps> = ({
  open,
  teamAScore,
  teamBScore,
  onSave,
  onCancel,
}) => {
  const [newTeamAScore, setNewTeamAScore] = useState<number>(teamAScore);
  const [newTeamBScore, setNewTeamBScore] = useState<number>(teamBScore);

  const handleSave = () => {
    onSave(newTeamAScore, newTeamBScore);
  };

  const handleCancel = () => {
    setNewTeamAScore(teamAScore);
    setNewTeamBScore(teamBScore);
    onCancel();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md mx-4 transform animate-scale-in">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#000000] mb-2">Chỉnh sửa điểm số</h2>
          <p className="text-[#000000]">Cập nhật điểm số cho từng đội</p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 text-[#000000]">Đội A</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#000000]">Điểm hiện tại:</span>
              <span className="text-2xl font-bold text-[#000000]">{teamAScore}</span>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-[#000000] mb-2">
                Điểm mới:
              </label>
              <Input
                type="number"
                min="0"
                value={newTeamAScore}
                onChange={(e) => setNewTeamAScore(parseInt(e.target.value) || 0)}
                className="text-center text-lg font-bold"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 text-[#000000]">Đội B</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#000000]">Điểm hiện tại:</span>
              <span className="text-2xl font-bold text-[#000000]">{teamBScore}</span>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-[#000000] mb-2">
                Điểm mới:
              </label>
              <Input
                type="number"
                min="0"
                value={newTeamBScore}
                onChange={(e) => setNewTeamBScore(parseInt(e.target.value) || 0)}
                className="text-center text-lg font-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            type="button"
            className="w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 rounded-lg transition text-lg"
            onClick={handleCancel}
          >
            Hủy
          </button>
          <button
            type="button"
            className="w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 rounded-lg transition text-lg"
            onClick={handleSave}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};
