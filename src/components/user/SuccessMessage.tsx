'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/provider';

interface SuccessMessageProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function SuccessMessage({ onClose, onConfirm }: SuccessMessageProps) {
  const router = useRouter();
  const { t } = useI18n();

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
          {t('shared.successMessage.title')}
        </h2>
        <Button
          onClick={handleConfirm}
          style={{ backgroundColor: '#8ADB10' }}
          className="hover:bg-lime-500 text-[#FFFFFF] font-semibold py-2 px-4 rounded-lg text-sm sm:text-base"
        >
          {t('shared.successMessage.confirm')}
        </Button>
      </div>
    </div>
  );
}