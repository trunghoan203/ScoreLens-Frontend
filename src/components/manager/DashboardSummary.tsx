import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/provider';

interface DashboardSummaryProps {
  totalTables: number;
  inUse: number;
  available: number;
  members: number;
}

const icons = [
  <Image key="group" src="/icon/group.svg" alt="Total Tables" width={32} height={32} className="mb-2" />,
  <Image key="empty" src="/icon/empty.svg" alt="Available" width={32} height={32} className="mb-2" />,
  <Image key="using" src="/icon/using.svg" alt="In Use" width={32} height={32} className="mb-2" />,
  <Image key="memberships" src="/icon/memberships.svg" alt="Members" width={32} height={32} className="mb-2" />,
];

export default function DashboardSummary({ totalTables, inUse, available, members }: DashboardSummaryProps) {
  const { t } = useI18n();

  const items = [
    { label: t('dashboard.totalTables'), value: totalTables, color: 'bg-green-300', dot: 'bg-green-400' },
    { label: t('dashboard.availableTables'), value: available, color: 'bg-white', dot: 'bg-red-500' },
    { label: t('dashboard.tablesInUse'), value: inUse, color: 'bg-lime-400', dot: 'bg-blue-500', active: true },
    { label: t('dashboard.totalMembers'), value: members, color: 'bg-white', dot: 'bg-purple-500' },
  ];
  return (
    <section>
      <div className="w-full rounded-xl bg-[#8ADB10] shadow-lg py-4 sm:py-6 flex items-center justify-center mb-6 sm:mb-8">
        <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#FFFFFF] tracking-widest flex items-center gap-2 sm:gap-3">{t('dashboard.dashboardTitle')}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item, idx) => (
          <div key={item.label} className={`rounded-xl sm:rounded-2xl shadow border-2 flex flex-col items-center py-4 sm:py-6 px-2 sm:px-3 bg-[#FFFFFF] border-[#8ADB10]`}>
            <div className="w-6 h-6 sm:w-8 sm:h-8 mb-2">
              {React.cloneElement(icons[idx], {
                width: 24,
                height: 24,
                className: "w-full h-full mb-0"
              })}
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-[#000000] mb-1">{item.value}</span>
            <span className="text-gray-700 text-xs sm:text-sm font-semibold uppercase tracking-wide text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
} 