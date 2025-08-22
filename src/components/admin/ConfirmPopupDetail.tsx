import React from 'react';
import { Button } from '../ui/button';

interface ConfirmPopupProps {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmPopupDetail: React.FC<ConfirmPopupProps> = ({
  open,
  title = 'Xác nhận thông tin',
  children,
  onConfirm,
  onCancel,
  confirmText = 'Xác nhận',
  cancelText = 'Quay lại',
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-lg mx-auto flex flex-col items-center transform animate-scale-in">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-gray-800 px-2">{title}</h2>
        <div className="mb-6 sm:mb-8 w-full max-h-[50vh] sm:max-h-[60vh] overflow-y-auto px-2 custom-scrollbar">{children}</div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center">
          <Button
            onClick={onConfirm}
            variant="lime"
            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base touch-manipulation order-1 sm:order-2"
          >
            {confirmText}
          </Button>
          <Button
            onClick={onCancel}
            variant="destructive"
            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-black touch-manipulation order-2 sm:order-1"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
}; 