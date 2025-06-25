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
}: AddFormLayoutProps) {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <form onSubmit={onSubmit} className="w-full max-w-xl border border-lime-400 rounded-xl p-10 bg-white flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-center mb-10 tracking-wider text-black">{title}</h2>
        {children}
        <div className="flex w-full justify-between gap-4 mt-2">
          {showBackButton && (
            <button
              type="button"
              className="w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 rounded-lg transition text-lg"
              onClick={onBack}
            >
              {backLabel}
            </button>
          )}
          {extraActions && (
            <div>{extraActions}</div>
          )}
          <button
            type="submit"
            className="w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 rounded-lg transition text-lg"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
} 