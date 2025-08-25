import React from 'react';
import { Button } from './button';

interface ConfirmPopupProps {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  open,
  title = 'Xác nhận thông tin',
  children,
  onConfirm,
  onCancel,
  confirmText = 'Xác nhận',
  cancelText = 'Quay lại',
}) => {
  if (!open) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-lg mx-auto flex flex-col items-center transform animate-scale-in">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-gray-800 px-2">
          {title}
        </h2>
        <div className="mb-4 sm:mb-6 w-full max-h-[60vh] overflow-y-auto px-2 custom-scrollbar mt-3 sm:mt-4">
          {children}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center">
          <Button
            onClick={onConfirm}
            variant="lime"
            className="px-6 sm:px-8 text-sm sm:text-base w-full sm:w-[140px] touch-manipulation order-1 sm:order-2"
          >
            {confirmText}
          </Button>
          <Button
            onClick={onCancel}
            variant="destructive"
            className="px-6 sm:px-8 text-sm sm:text-base font-semibold w-full sm:w-[140px] touch-manipulation order-2 sm:order-1"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
}; 