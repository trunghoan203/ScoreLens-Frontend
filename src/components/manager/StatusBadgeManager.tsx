import { useI18n } from '@/lib/i18n/provider';

export default function StatusBadge({ status }: { status: 'empty' | 'inuse' | 'maintenance' }) {
  const { t } = useI18n();

  return (
    <span
      className={
        "w-32 min-w-[100px] text-center px-2 py-2 rounded-full text-white font-semibold text-sm flex items-center justify-center " +
        (status === "empty" ? "bg-green-500" : status === "inuse" ? "bg-red-500" : "bg-yellow-500")
      }
    >
      {status === "empty" ? t('tables.status.empty') : status === "inuse" ? t('tables.status.inuse') : t('tables.status.maintenance')}
    </span>
  );
} 