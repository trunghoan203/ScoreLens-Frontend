import React from 'react';

interface RegisterStepsProps {
  currentStep: number;
  steps?: string[];
}

const defaultSteps = [
  'Thông tin thương hiệu',
  'Thông tin chi nhánh',
  'Xác nhận',
];

export function RegisterSteps({ currentStep, steps = defaultSteps }: RegisterStepsProps) {
  return (
    <div className="flex flex-row justify-center mb-10 w-full max-w-5xl mx-auto">
      {steps.map((label, idx) => {
        const isActive = currentStep === idx + 1;
        const isFirst = idx === 0;
        const isLast = idx === steps.length - 1;
        return (
          <button
            key={label}
            type="button"
            className={
              'flex-1 flex justify-center items-center py-3 font-semibold text-lg whitespace-nowrap w-[220px] transition-colors duration-300 ' +
              (isActive
                ? 'bg-lime-400 text-black shadow-md'
                : 'bg-black text-white') +
              (isFirst ? ' rounded-tl-lg rounded-bl-lg' : '') +
              (isLast ? ' rounded-tr-lg rounded-br-lg' : '')
            }
            disabled
          >
            {label}
          </button>
        );
      })}
    </div>
  );
} 