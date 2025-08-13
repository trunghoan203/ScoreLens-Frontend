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
        <h2 className="text-xl font-bold text-[#000000] mb-4">Bạn có muốn kết thúc trận đấu không?</h2>
        <p className="text-sm text-[#FF0000] font-medium mb-6">Vui lòng nhấn xác nhận để thanh toán</p>

        <div className="flex gap-4">
          <Button
            onClick={onClose}
            style={{ backgroundColor: '#FF0000' }}
            className="w-full hover:bg-red-500 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            Trở về
          </Button>
          <Button
            onClick={onConfirm}
            style={{ backgroundColor: '#8ADB10' }}
            className="w-full hover:bg-lime-500 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
}
