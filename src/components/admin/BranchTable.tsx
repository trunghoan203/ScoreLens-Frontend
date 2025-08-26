import StatusBadge from './StatusBadge';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/provider';

interface Branch {
  _id?: string;
  clubId?: string;
  name: string;
  address: string;
  actualTableCount?: number;
  status: 'open' | 'closed';
}

export default function BranchTable({ branches }: { branches: Branch[] }) {
  const router = useRouter();
  const { t } = useI18n();
  return (
    <div className="w-full">
      <div className="hidden lg:block overflow-x-auto">
        <div className="space-y-2 rounded-lg min-w-[800px]">
          <div className="grid grid-cols-12 bg-black text-white font-semibold text-center">
            <div className="col-span-3 py-3 text-sm xl:text-base">{t('branches.table.branchName')}</div>
            <div className="col-span-4 py-3 text-sm xl:text-base">{t('branches.table.address')}</div>
            <div className="col-span-2 py-3 text-sm xl:text-base">{t('branches.table.tableCount')}</div>
            <div className="col-span-3 py-3 text-sm xl:text-base">{t('branches.table.status')}</div>
          </div>
          {branches.map((b, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 items-center text-center bg-gray-200 rounded-lg cursor-pointer hover:bg-lime-50 transition"
              onClick={() => router.push(`/admin/branches/${b.clubId || b._id || idx}`)}
            >
              <div className="col-span-3 py-4 font-semibold text-black text-sm xl:text-base px-2">{b.name}</div>
              <div className="col-span-4 py-4 text-gray-700 text-sm xl:text-base px-2 truncate">{b.address}</div>
              <div className="col-span-2 py-4 text-gray-700 text-sm xl:text-base">{b.actualTableCount || 0}</div>
              <div className="col-span-3 py-4 flex justify-center px-2">
                <StatusBadge status={b.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        {branches.map((b, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-shadow touch-manipulation"
            onClick={() => router.push(`/admin/branches/${b.clubId || b._id || idx}`)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-base mb-1">{b.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{b.address}</p>
              </div>
              <div className="ml-3 flex-shrink-0">
                <StatusBadge status={b.status} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-medium">{t('branches.table.tableCount')}:</span>
                <span className="text-gray-800 text-sm font-medium">{b.actualTableCount || 0}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-end">
                <span className="text-lime-600 text-xs font-medium">{t('branches.table.clickToViewDetails')} →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
