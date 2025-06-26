"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import HeaderAdminPage from "@/components/admin/HeaderAdminPage";
import AddFormLayout from "@/components/shared/AddFormLayout";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function AddManagerPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    dob: "",
    email: "",
    cccd: "",
    address: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý thêm quản lý ở đây
    alert("Đã thêm quản lý thành công!");
    router.push("/admin/managers");
  };

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <Sidebar />
      <main className="flex-1 bg-white p-10 min-h-screen">
        <HeaderAdminPage />
        <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
          <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
            QUẢN LÝ
          </span>
        </div>
        <AddFormLayout
          title="THÊM QUẢN LÝ"
          onSubmit={handleSubmit}
          onBack={() => router.push('/admin/managers')}
        >
          <div className="w-full space-y-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tên Quản Lý <span className="text-red-500">*</span></label>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="Nhập Tên..." required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Số Điện Thoại <span className="text-red-500">*</span></label>
              <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Nhập Số Điện Thoại..." required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày Sinh <span className="text-red-500">*</span></label>
              <Input name="dob" value={form.dob} onChange={handleChange} placeholder="Nhập Ngày-Tháng-Năm" type="date" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
              <Input name="email" value={form.email} onChange={handleChange} placeholder="Nhập Email..." required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CCCD <span className="text-red-500">*</span></label>
              <Input name="cccd" value={form.cccd} onChange={handleChange} placeholder="Nhập Số CCCD..." required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Địa Chỉ <span className="text-red-500">*</span></label>
              <Input name="address" value={form.address} onChange={handleChange} placeholder="Nhập Địa Chỉ..." required />
            </div>
          </div>
        </AddFormLayout>
      </main>
    </div>
  );
} 