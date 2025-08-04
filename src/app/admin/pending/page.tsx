"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function AdminPendingPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-lime-600 mb-4">Tài khoản đang chờ duyệt</h1>
        <p className="text-gray-700 mb-6">
          Tài khoản của bạn đã được gửi lên hệ thống và đang chờ quản trị viên xác nhận.<br />
          Vui lòng kiểm tra lại sau hoặc liên hệ với quản trị viên để được hỗ trợ nhanh hơn.
        </p>
        <button
          className="w-full py-3 bg-lime-500 text-white rounded-lg font-semibold hover:bg-lime-600 transition"
          onClick={() => router.push("/admin/login")}
        >
          Quay lại đăng nhập
        </button>
      </div>
    </div>
  );
}