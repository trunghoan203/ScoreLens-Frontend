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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg mx-4 flex flex-col items-center transform animate-scale-in">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">{title}</h2>
        <div className="mb-8 w-full max-h-[60vh] overflow-y-auto px-2 custom-scrollbar">{children}</div>
        <div className="flex gap-4 w-full justify-center">
          <Button
            onClick={onCancel}
            variant="destructive"
            className="px-8 py-3 text-base font-semibold text-black"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            variant="lime"
            className="px-8 py-3 text-base"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}; 