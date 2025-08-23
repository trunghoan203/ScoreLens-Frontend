'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import RoleBadge from '@/components/ui/RoleBadge';

interface Props {
  onClose: () => void;
  onSave: (scoreA: number, scoreB: number) => void;
  initialScoreA?: number;
  initialScoreB?: number;
  canEdit?: boolean;
  userRole?: 'host' | 'participant' | 'manager';
}

export default function ScoreEditor({
  onClose,
  onSave,
  initialScoreA = 0,
  initialScoreB = 0,
  canEdit = true,
  userRole = 'participant'
}: Props) {
  const [scoreA, setScoreA] = useState(initialScoreA);
  const [scoreB, setScoreB] = useState(initialScoreB);

  const handleSave = async () => {
    if (!canEdit) {
      toast.error('Bạn không có quyền chỉnh sửa điểm. Chỉ người tạo trận đấu mới có thể thực hiện.');
      return;
    }

    onSave(scoreA, scoreB);
    toast.success('Đã cập nhật thành công!');
    onClose();
  };

  if (!canEdit) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md sm:max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#000000] mb-2">
              CHỈNH SỬA ĐIỂM SỐ
            </h2>
            <RoleBadge role={userRole} size="sm" showIcon />
          </div>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-2">
              Bạn không có quyền chỉnh sửa điểm trận đấu
            </p>
            <p className="text-sm text-gray-500">
              Chỉ người tạo trận đấu (Host) mới có thể thực hiện thao tác này
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={onClose}
              style={{ backgroundColor: '#8ADB10' }}
              className="bg-[#8ADB10] hover:bg-lime-500 text-[#FFFFFF] font-semibold py-3 px-8 rounded-xl text-sm sm:text-base"
            >
              Đóng
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md sm:max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#000000] mb-2">
            CHỈNH SỬA ĐIỂM SỐ
          </h2>
          <RoleBadge role={userRole} size="sm" showIcon />
        </div>

        <div className="flex justify-between items-center mb-5">
          <div className="flex flex-col items-center">
            <p className="font-semibold text-xl text-[#000000] mb-4">Đội A</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={scoreA}
                onChange={(e) => setScoreA(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 text-center border border-gray-300 rounded px-2 py-3 text-lg font-bold text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#8ADB10]"
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-3xl font-bold text-[#000000]">
            <span className="text-4xl mr-4">{scoreA}</span>
            <span className="text-4xl">:</span>
            <span className="text-4xl ml-4">{scoreB}</span>
          </div>

          <div className="flex flex-col items-center">
            <p className="font-semibold text-xl text-[#000000] mb-4">Đội B</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={scoreB}
                onChange={(e) => setScoreB(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 text-center border border-gray-300 rounded px-2 py-3 text-lg font-bold text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#8ADB10]"
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
              Đặt lại điểm Đội A
            </Button>
            <Button
              variant="outline"
              onClick={() => setScoreB(0)}
              className="text-[#000000] hover:bg-red-50"
            >
              Đặt lại điểm Đội B
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
