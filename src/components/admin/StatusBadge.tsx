import { useI18n } from '@/lib/i18n/provider';

export default function StatusBadge({ status }: { status: 'open' | 'closed' | 'maintenance' }) {
  const { t } = useI18n();
  return (
    <span
      className={
        "w-28 min-w-[100px] text-center px-4 py-1 rounded-full text-white font-semibold text-base flex items-center justify-center " +
        (status === "open" ? "bg-green-500" : status === "closed" ? "bg-red-500" : "bg-yellow-500")
      }
    >
      {status === "open" ? t('branches.status.open') : status === "closed" ? t('branches.status.closed') : t('branches.status.maintenance')}
    </span>
  );
} 