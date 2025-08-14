import React from "react";

interface TableStatusBadgeProps {
  status: "available" | "using";
}

export default function TableStatusBadge({ status }: TableStatusBadgeProps) {
  if (status === "available") {
    return (
      <span className="inline-block px-6 py-2 rounded-xl bg-[#3D96FF] text-[#FFFFFF] font-semibold text-base shadow">
        Bàn trống
      </span>
    );
  }
  return (
    <span className="inline-block px-6 py-2 rounded-xl bg-[#8ADB10] text-[#FFFFFF] font-semibold text-base shadow">
      Đang sử dụng
    </span>
  );
} 