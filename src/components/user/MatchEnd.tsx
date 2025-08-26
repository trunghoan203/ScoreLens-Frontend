'use client';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n/provider';

interface Props {
  onClose: () => void;
  onConfirm: () => void;
}

export default function MatchEnd({ onClose, onConfirm }: Props) {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg text-center">
        <h2 className="text-xl font-bold text-[#000000] mb-4">{t('shared.matchEnd.title')}</h2>
        <div className="flex gap-4">
          <Button
            onClick={onClose}
            style={{ backgroundColor: '#FF0000' }}
            className="w-full hover:bg-red-500 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            {t('shared.matchEnd.back')}
          </Button>
          <Button
            onClick={onConfirm}
            style={{ backgroundColor: '#8ADB10' }}
            className="w-full hover:bg-lime-500 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            {t('shared.matchEnd.confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
}
