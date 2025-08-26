import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/provider';

interface AgreementCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export function AgreementCheckbox({ checked, onChange, required }: AgreementCheckboxProps) {
  const { t } = useI18n();

  return (
    <div className="w-full flex items-center gap-2">
      <input
        id="agree"
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-lime-500 border-gray-300 rounded focus:ring-lime-400"
        required={required}
      />
      <label htmlFor="agree" className="text-sm text-gray-700">
        {t('shared.agreementCheckbox.agreement')}{' '}
        <Link href="#" className="text-lime-600 underline">
          {t('shared.agreementCheckbox.termsAndPrivacy')}
        </Link>
      </label>
    </div>
  );
} 