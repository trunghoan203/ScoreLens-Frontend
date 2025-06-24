import React from 'react';

interface RegisterStepsProps {
  currentStep: number; // 1, 2, 3
}

const steps = [
  'Đăng ký tài khoản',
  'Thông tin chi tiết',
  'Xác nhận',
];

export function RegisterSteps({ currentStep }: RegisterStepsProps) {
  return (
    <div className="flex flex-row justify-center mb-10 w-full max-w-2xl mx-auto">
      {steps.map((label, idx) => {
        const isActive = currentStep === idx + 1;
        const isFirst = idx === 0;
        const isLast = idx === steps.length - 1;
        return (
          <button
            key={label}
            type="button"
            className={
              'flex-1 py-3 font-semibold text-lg ' +
              (isActive
                ? 'bg-lime-400 text-black shadow-md '
                : 'bg-black text-white ') +
              (isFirst ? 'rounded-tl-lg rounded-bl-lg ' : '') +
              (isLast ? 'rounded-tr-lg rounded-br-lg ' : '')
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