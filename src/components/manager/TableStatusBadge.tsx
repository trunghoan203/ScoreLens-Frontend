import React from "react";

interface TableStatusBadgeProps {
  status: "available" | "using";
}

export default function TableStatusBadge({ status }: TableStatusBadgeProps) {
  if (status === "available") {
    return (
      <span className="inline-block px-6 py-2 rounded-xl bg-[#42a5ff] text-white font-semibold text-base shadow">
        Bàn trống
      </span>
    );
  }
  return (
    <span className="inline-block px-6 py-2 rounded-xl bg-lime-400 text-black font-semibold text-base shadow">
      Đang sử dụng
    </span>
  );
} 