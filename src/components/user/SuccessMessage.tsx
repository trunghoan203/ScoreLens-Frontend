'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface SuccessMessageProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function SuccessMessage({ onClose, onConfirm }: SuccessMessageProps) {
  const router = useRouter();

  const handleConfirm = () => {
    onConfirm();
    router.push('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div
        className="relative bg-white rounded-xl shadow-lg p-6 w-11/12 max-w-sm text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg sm:text-xl font-bold text-[#000000]">
          Cảm ơn quý khách đã sử dụng dịch vụ ScoreLens!
        </h2>
        <Button
          onClick={handleConfirm}
          style={{ backgroundColor: '#8ADB10' }}
          className="hover:bg-lime-500 text-[#FFFFFF] font-semibold py-2 px-4 rounded-lg text-sm sm:text-base"
        >
          Xác nhận
        </Button>
      </div>
    </div>
  );
}