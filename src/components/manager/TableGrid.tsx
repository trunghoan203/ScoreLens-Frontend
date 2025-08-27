import React from 'react';
import StatusBadge from './StatusBadge';
import { useI18n } from '@/lib/i18n/provider';

interface Table {
  id: string;
  name: string;
  type: string;
  status: 'empty' | 'inuse' | 'maintenance';
}

interface TableGridProps {
  tables: Table[];
  onTableClick?: (id: string) => void;
}

export default function TableGrid({ tables, onTableClick }: TableGridProps) {
  const { t } = useI18n();

  const formatCategory = (category: string) => {
    switch (category) {
      case 'pool-8':
        return 'Pool-8';
      case 'carom':
        return 'Carom';
      default:
        return category;
    }
  };

  return (
    <div className="w-full">
      <div className="hidden lg:block overflow-x-auto">
        <div className="space-y-2 rounded-lg min-w-[800px]">
          <div className="grid grid-cols-12 bg-black text-white font-semibold text-center">
            <div className="col-span-4 py-3 text-sm xl:text-base">{t('manager.tableGrid.table')}</div>
            <div className="col-span-4 py-3 text-sm xl:text-base">{t('manager.tableGrid.tableType')}</div>
            <div className="col-span-4 py-3 text-sm xl:text-base">{t('manager.tableGrid.status')}</div>
          </div>
          {tables.map((table) => (
            <div
              key={table.id}
              className="grid grid-cols-12 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
              onClick={() => onTableClick && onTableClick(table.id)}
            >
              <div className="col-span-4 py-4 font-semibold text-black text-sm xl:text-base px-2">{table.name}</div>
              <div className="col-span-4 py-4 uppercase text-gray-700 text-sm xl:text-base px-2">{formatCategory(table.type)}</div>
              <div className="col-span-4 py-4 flex justify-center px-2">
                <StatusBadge status={table.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="block lg:hidden space-y-3">
        {tables.map((table) => (
          <div
            key={table.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-shadow touch-manipulation"
            onClick={() => onTableClick && onTableClick(table.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-base mb-1">{table.name}</h3>
                <p className="text-gray-600 text-sm uppercase">{formatCategory(table.type)}</p>
              </div>
              <div className="ml-3 flex-shrink-0">
                <StatusBadge status={table.status} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-medium">{t('manager.tableGrid.tableTypeLabel')}</span>
                <span className="text-gray-800 text-xs font-medium uppercase">{formatCategory(table.type)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-medium">{t('manager.tableGrid.statusLabel')}</span>
                <span className={`text-xs font-medium ${table.status === 'empty' ? 'text-green-600' :
                  table.status === 'inuse' ? 'text-blue-600' : 'text-red-600'
                  }`}>
                  {table.status === 'empty' ? t('manager.tableGrid.empty') :
                    table.status === 'inuse' ? t('manager.tableGrid.inUse') : t('manager.tableGrid.maintenance')}
                </span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-end">
                <span className="text-lime-600 text-xs font-medium">{t('manager.tableGrid.clickToViewDetails')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
