'use client';

import { useI18n } from '@/lib/i18n/provider';

interface AiSelectionProps {
  onClose: () => void;
  onConfirm: (isAiAssisted: boolean) => void;
  isAiAssisted: boolean;
  setIsAiAssisted: (value: boolean) => void;
  isCreating: boolean;
}

export default function AiSelection({
  onClose,
  onConfirm,
  isAiAssisted,
  setIsAiAssisted,
  isCreating
}: AiSelectionProps) {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg text-center">
        <h2 className="text-xl font-bold text-[#000000] mb-6">
          {t('aiSelection.title')}
        </h2>

        <div className="space-y-4 mb-6">
          <div className="text-left">
            <p className="text-sm text-gray-600 mb-3">
              {t('aiSelection.description')}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setIsAiAssisted(true)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${isAiAssisted
                  ? 'border-lime-500 bg-lime-50 text-lime-700'
                  : 'border-gray-200 hover:border-lime-300'
                  }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-[#000000]">{t('aiSelection.withAi.title')}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {t('aiSelection.withAi.description')}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setIsAiAssisted(false)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${!isAiAssisted
                  ? 'border-lime-500 bg-lime-50 text-lime-700'
                  : 'border-gray-200 hover:border-lime-300'
                  }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-[#000000]">{t('aiSelection.withoutAi.title')}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {t('aiSelection.withoutAi.description')}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="w-full bg-[#FF0000] hover:bg-red-500 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            {t('aiSelection.cancel')}
          </button>
          <button
            onClick={() => onConfirm(isAiAssisted)}
            disabled={isCreating}
            className="w-full bg-[#8ADB10] hover:bg-lime-600 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base disabled:bg-gray-300"
          >
            {isCreating ? t('aiSelection.creating') : t('aiSelection.createMatch')}
          </button>
        </div>
      </div>
    </div>
  );
}
