'use client';

import { Button } from '@/components/ui/button';

interface Props {
  onClose: () => void;
  onConfirm: () => void;
}

export default function PopupEndMatch({ onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg text-center">
        <h2 className="text-xl font-bold text-black mb-4">Bạn có muốn kết thúc trận đấu không?</h2>
        <p className="text-sm text-red-600 font-medium mb-6">Vui lòng nhấn xác nhận để thanh toán</p>

        <div className="flex gap-4">
          <Button
            onClick={onClose}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold"
          >
            Trở về
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-lime-500 hover:bg-lime-600 text-white font-semibold"
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
}
