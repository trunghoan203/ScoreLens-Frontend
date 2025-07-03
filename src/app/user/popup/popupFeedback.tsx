'use client';

import { Button } from '@/components/ui/button';

interface PopupFeedbackProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function PopupFeedback({ onClose, onConfirm }: PopupFeedbackProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay mờ xám */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose} // <-- Dùng onClose tại đây
      ></div>

      {/* Popup nội dung */}
      <div
        className="relative bg-white rounded-xl shadow-lg p-6 w-11/12 max-w-sm text-center space-y-4"
        onClick={(e) => e.stopPropagation()} // Ngăn click overlay truyền vào popup
      >
        <h2 className="text-lg sm:text-xl font-bold text-black">
          Cảm ơn quý khách đã sử dụng dịch vụ ScoreLens!
        </h2>
        <p className="text-red-500 text-sm sm:text-base">
          Vui lòng thanh toán
        </p>
        <Button
          onClick={onConfirm}
          className="bg-lime-400 hover:bg-lime-500 text-white font-semibold py-2 px-4 rounded-lg text-sm sm:text-base"
        >
          Thanh toán
        </Button>
      </div>
    </div>
  );
}