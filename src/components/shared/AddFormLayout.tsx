"use client";
import React from "react";

interface AddFormLayoutProps {
  title: string;
  children: React.ReactNode;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  onBack?: () => void;
  backLabel?: string;
  showBackButton?: boolean;
  submitLabel?: string;
  extraActions?: React.ReactNode;
  submitButtonClassName?: string;
  submitButtonDisabled?: boolean;
}

export default function AddFormLayout({
  title,
  children,
  onSubmit,
  onBack,
  backLabel = "Quay lại",
  showBackButton = true,
  submitLabel = "Thêm",
  extraActions,
  submitButtonClassName,
  submitButtonDisabled = false,
}: AddFormLayoutProps) {
  return (
    <div className="flex justify-center items-center min-h-[60vh] px-4 sm:px-6 lg:px-8">
      <form onSubmit={onSubmit} className="w-full max-w-xl border border-lime-400 rounded-xl p-4 sm:p-6 lg:p-10 bg-white flex flex-col items-center" noValidate>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-center mb-6 sm:mb-8 lg:mb-10 tracking-wider text-black">{title}</h2>
        {children}
        <div className="flex flex-col sm:flex-row w-full justify-between gap-3 sm:gap-4 mt-2">
          <button
            type="submit"
            className={`${submitButtonClassName || "w-full sm:w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2.5 sm:py-2 rounded-lg transition text-base sm:text-lg touch-manipulation"} order-1 sm:order-2`}
            disabled={submitButtonDisabled}
          >
            {submitLabel}
          </button>
          {extraActions && (
            <div className="w-full sm:w-auto order-2 sm:order-3">{extraActions}</div>
          )}
          {showBackButton && (
            <button
              type="button"
              className="w-full sm:w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2.5 sm:py-2 rounded-lg transition text-base sm:text-lg touch-manipulation order-3 sm:order-1"
              onClick={onBack}
            >
              {backLabel}
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 