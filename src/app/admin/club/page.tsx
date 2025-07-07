"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import HeaderAdminPage from '@/components/admin/HeaderAdminPage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import toast from 'react-hot-toast';

interface Branch {
  name: string;
  address: string;
  tableCount: string;
  cameraCount: string;
}

export default function ClubInfoPage() {
  const [image, setImage] = useState<File | null>(null);
  const [clubName, setClubName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [cccd, setCccd] = useState('');
  const [phone, setPhone] = useState('');
  const [branches, setBranches] = useState<Branch[]>([
    { name: '', address: '', tableCount: '', cameraCount: '' },
  ]);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleBranchChange = (idx: number, field: keyof Branch, value: string) => {
    setBranches(prev => prev.map((b, i) => i === idx ? { ...b, [field]: value } : b));
  };

  const handleAddBranch = () => {
    setBranches(prev => [...prev, { name: '', address: '', tableCount: '', cameraCount: '' }]);
  };

  const handleRemoveBranch = (idx: number) => {
    setBranches(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    toast.success('Đã lưu thông tin câu lạc bộ!');
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className="min-h-screen flex bg-[#18191A]">
      <Sidebar />
      <main className="flex-1 bg-white p-10 min-h-screen">
        <HeaderAdminPage />
        <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
          <span className="text-2xl font-extrabold text-white tracking-widest flex items-center gap-3">
            THÔNG TIN CÂU LẠC BỘ
          </span>
        </div>
        <form className="w-full max-w-4xl mx-auto flex flex-col gap-8 items-start px-0 pb-8" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8 items-start w-full">
            {/* Left: Image upload + requirements */}
            <div className="flex flex-col items-center w-full md:w-1/3">
              <label className="block text-lg font-semibold mb-2 w-full text-left">Hình ảnh</label>
              <div className="relative w-60 h-60 bg-gray-100 rounded-xl flex items-center justify-center mb-2 border border-gray-200 overflow-hidden">
                {image ? (
                  <Image src={URL.createObjectURL(image)} alt="Preview" fill className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-400">Chưa chọn hình</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow border border-gray-200">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" />
                  </svg>
                </div>
              </div>
              <div className="text-xs text-red-600 mt-2 w-full">
                <b>*YÊU CẦU:</b>
                <ul className="list-disc ml-4 mt-1">
                  <li>Camera độ phân giải full HD.</li>
                  <li>Tốc độ khung hình tối thiểu 60 fps.</li>
                  <li>Camera được đặt tại trung tâm mặt bàn hướng từ trên xuống.</li>
                </ul>
              </div>
            </div>
            {/* Right: Form fields + Branches Section */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Câu Lạc Bộ</label>
                <Input value={clubName} onChange={e => setClubName(e.target.value)} placeholder="Nhập tên câu lạc bộ..." required />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Chủ Câu Lạc Bộ</label>
                <Input value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Nhập tên chủ câu lạc bộ..." required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">CCCD <span className="text-red-500">*</span></label>
                <Input value={cccd} onChange={e => setCccd(e.target.value)} placeholder="Nhập CCCD ..." required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Số Điện Thoại</label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Nhập SĐT ..." />
              </div>
              {/* Branches Section nằm trong col-span-2, rộng ngang input lớn */}
              <div className="col-span-2">
                <div className="w-full mt-8 space-y-4">
                  {branches.map((branch, idx) => (
                    <div
                      key={idx}
                      className="relative p-6 border rounded-xl bg-white shadow-md mb-6 transition-shadow hover:shadow-lg"
                    >
                      {/* Nút thao tác */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        {branches.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveBranch(idx)}
                            className="p-1.5 rounded-full bg-red-50 hover:bg-red-200 text-red-500 border border-red-200 shadow-sm transition"
                            aria-label="Xóa chi nhánh"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                        {idx === branches.length - 1 && (
                          <button
                            type="button"
                            onClick={handleAddBranch}
                            className="p-1.5 rounded-full bg-lime-50 hover:bg-lime-200 text-lime-600 border border-lime-200 shadow-sm transition"
                            aria-label="Thêm chi nhánh"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="mb-4">
                        <span className="text-base font-semibold text-lime-600">Chi nhánh {idx + 1}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Tên chi nhánh <span className="text-red-500">*</span></label>
                          <Input value={branch.name} onChange={e => handleBranchChange(idx, 'name', e.target.value)} placeholder="Nhập tên chi nhánh..." required />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Địa chỉ <span className="text-red-500">*</span></label>
                          <Input value={branch.address} onChange={e => handleBranchChange(idx, 'address', e.target.value)} placeholder="Nhập địa chỉ..." required />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Số bàn <span className="text-red-500">*</span></label>
                          <Input value={branch.tableCount} onChange={e => handleBranchChange(idx, 'tableCount', e.target.value)} placeholder="Nhập số bàn..." required />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Số lượng camera <span className="text-red-500">*</span></label>
                          <Input value={branch.cameraCount} onChange={e => handleBranchChange(idx, 'cameraCount', e.target.value)} placeholder="Nhập số lượng camera..." required />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2 mt-4">
                <Button type="submit" variant="lime" fullWidth>Lưu thông tin</Button>
              </div>
            </div>
          </div>
        </form>
        <ConfirmPopup
          open={showConfirm}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          title="Xác nhận lưu thông tin"
          confirmText="Lưu"
          cancelText="Hủy"
        >
          <div className="text-center text-black">Bạn có chắc chắn muốn lưu thông tin câu lạc bộ không?</div>
        </ConfirmPopup>
      </main>
    </div>
  );
} 