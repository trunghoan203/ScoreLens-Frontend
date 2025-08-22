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
      <div className="w-full border border-lime-400 rounded-xl p-4 sm:p-6 lg:p-10 bg-white shadow-lg">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-center mb-6 sm:mb-8 lg:mb-10 tracking-wider text-black">{title}</h2>
        {children}
      </div>
    </div>
  );
} 