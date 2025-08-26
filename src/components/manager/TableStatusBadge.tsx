import React from "react";
import { useI18n } from '@/lib/i18n/provider';

interface TableStatusBadgeProps {
  status: "available" | "using";
  isAiAssisted?: boolean;
}

export default function TableStatusBadge({ status, isAiAssisted = false }: TableStatusBadgeProps) {
  const { t } = useI18n();

  if (status === "available") {
    return (
      <span className="inline-block px-6 py-2 rounded-xl bg-[#3D96FF] text-[#FFFFFF] font-semibold text-base shadow">
        {t('manager.tableStatusBadge.available')}
      </span>
    );
  }
  return (
    <span className="inline-block px-6 py-2 rounded-xl bg-[#8ADB10] text-[#FFFFFF] font-semibold text-base shadow whitespace-nowrap">
      {isAiAssisted ? t('manager.tableStatusBadge.inUseWithAi') : t('manager.tableStatusBadge.inUse')}
    </span>
  );
} 