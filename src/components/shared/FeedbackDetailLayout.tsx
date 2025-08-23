"use client";
import React from "react";

interface FeedbackDetailLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function FeedbackDetailLayout({
  title,
  children,
}: FeedbackDetailLayoutProps) {
  return (
    <div className="flex justify-center items-center min-h-[60vh] px-4 sm:px-6 lg:px-8">
      <div className="w-full border border-lime-400 rounded-xl p-4 sm:p-6 lg:p-8 xl:p-10 bg-white shadow-lg">
        <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-extrabold text-center mb-4 sm:mb-6 lg:mb-8 xl:mb-10 tracking-wider text-black">{title}</h2>
        {children}
      </div>
    </div>
  );
} 