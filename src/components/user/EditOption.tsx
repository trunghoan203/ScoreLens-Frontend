'use client';

import { useI18n } from '@/lib/i18n/provider';

interface Props {
  onClose: () => void;
  onEditScore: () => void;
  onEditMembers: () => void;
}

export default function EditOption({ onClose, onEditScore, onEditMembers }: Props) {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg text-center">
        <h2 className="text-xl font-bold text-[#000000] mb-6">
          {t('shared.editOption.title')}
        </h2>

        <div className="space-y-4 mb-6">
          <div className="text-left">
            <p className="text-sm text-gray-600 mb-3">
              {t('shared.editOption.description')}
            </p>
            <div className="space-y-3">
              <button
                onClick={onEditScore}
                className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all hover:bg-blue-50"
              >
                <div className="text-center">
                  <div className="font-semibold text-[#000000]">{t('shared.editOption.editScore')}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {t('shared.editOption.editScoreDescription')}
                  </div>
                </div>
              </button>

              <button
                onClick={onEditMembers}
                className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-green-300 transition-all hover:bg-green-50"
              >
                <div className="text-center">
                  <div className="font-semibold text-[#000000]">{t('shared.editOption.editMembers')}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {t('shared.editOption.editMembersDescription')}
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
            {t('shared.editOption.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
