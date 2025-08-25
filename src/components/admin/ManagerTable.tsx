import React from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/provider';

interface Manager {
  name: string;
  clubName?: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  managerId?: string;
}

export default function ManagerTable({ managers }: { managers: Manager[] }) {
  const router = useRouter();
  const { t } = useI18n();
  return (
    <div className="w-full">
      <div className="hidden lg:block overflow-x-auto">
        <div className="space-y-2 rounded-lg min-w-[800px]">
          <div className="grid grid-cols-12 bg-black text-white font-semibold text-center">
            <div className="col-span-3 py-3 text-sm xl:text-base">{t('managers.table.managerName')}</div>
            <div className="col-span-3 py-3 text-sm xl:text-base">{t('managers.table.branch')}</div>
            <div className="col-span-3 py-3 text-sm xl:text-base">{t('managers.table.phone')}</div>
            <div className="col-span-3 py-3 text-sm xl:text-base">{t('managers.table.status')}</div>
          </div>
          {managers.map((m, idx) => (
            <div
              key={m.managerId || idx}
              className="grid grid-cols-12 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
              onClick={() => router.push(`/admin/managers/${m.managerId}`)}
            >
              <div className="col-span-3 py-4 font-semibold text-black text-sm xl:text-base px-2">{m.name}</div>
              <div className="col-span-3 py-4 text-gray-700 text-sm xl:text-base px-2">{m.clubName || t('common.notAvailable')}</div>
              <div className="col-span-3 py-4 text-gray-700 text-sm xl:text-base px-2">{m.phone}</div>
              <div className="col-span-3 py-4 flex justify-center px-2">
                <span
                  className={`w-24 xl:w-32 text-center px-2 py-2 rounded-full text-white font-semibold text-xs xl:text-sm flex items-center justify-center ${m.status === 'active'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                    }`}
                >
                  {m.status === 'active' ? t('managers.status.active') : t('managers.status.inactive')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="block lg:hidden space-y-3">
        {managers.map((m, idx) => (
          <div
            key={m.managerId || idx}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-shadow touch-manipulation"
            onClick={() => router.push(`/admin/managers/${m.managerId}`)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-base mb-1">{m.name}</h3>
                <p className="text-gray-600 text-sm">{m.clubName || t('managers.noBranch')}</p>
              </div>
              <span
                className={`ml-3 px-3 py-1 rounded-full text-white font-medium text-xs flex-shrink-0 ${m.status === 'active'
                  ? 'bg-green-500'
                  : 'bg-red-500'
                  }`}
              >
                {m.status === 'active' ? t('managers.status.active') : t('managers.status.inactive')}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-gray-500 text-xs font-medium w-8">{t('common.phone')}:</span>
                <span className="text-gray-800 text-sm font-medium">{m.phone}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-end">
                <span className="text-lime-600 text-xs font-medium">{t('common.clickToViewDetails')} →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
