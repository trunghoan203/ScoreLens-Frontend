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
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-full border border-lime-400 rounded-xl p-10 bg-white shadow-lg">
        <h2 className="text-3xl font-extrabold text-center mb-10 tracking-wider text-black">{title}</h2>
        {children}
      </div>
    </div>
  );
} 