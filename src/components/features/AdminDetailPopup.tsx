'use client';

import React from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminDetailPopupProps {
  open: boolean;
  onClose: () => void;
  admin: {
    id: string;
    name: string;
    email: string;
    location: string;
    status: string;
  } | null;
}

export const AdminDetailPopup: React.FC<AdminDetailPopupProps> = ({
  open,
  onClose,
  admin,
}) => {
  if (!admin) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <Dialog.Panel className="bg-white rounded-2xl w-full max-w-4xl p-8">
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 text-black">THÔNG TIN CHI TIẾT</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hình ảnh giải đấu */}
          <div className="flex justify-center">
            <div className="w-60 h-72 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">
              Hình ảnh giải đấu
            </div>
          </div>

          {/* Form thông tin */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black">Tên Quán</label>
              <Input value="Quán Cỏ 4 Cây Me" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Họ và Tên</label>
              <Input value={admin.name} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">CCCD</label>
              <Input value="025203000059" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Số Điện Thoại</label>
              <Input value="0398709870" disabled />
            </div>

            {/* Chi nhánh 1 */}
            <div>
              <label className="block text-sm font-medium text-black">Chi Nhánh 1</label>
              <Input value="Sài Gòn" disabled />
            </div>
            <div>
              <label className="block text-xs font-medium text-black">Địa Chỉ</label>
              <Input value="100 Trần Huy Liệu, Phú Nhuận, TP.HCM" disabled />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Số Bàn</label>
              <Input value="10" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Số Lượng Camera</label>
              <Input value="10" disabled />
            </div>

            {/* Chi nhánh 2 */}
            <div>
              <label className="block text-sm font-medium text-black">Chi Nhánh 2</label>
              <Input value="Quy Nhơn" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Địa Chỉ</label>
              <Input value="190 Nguyễn Huệ, TP Quy Nhơn" disabled />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Số Bàn</label>
              <Input value="10" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium ">Số Lượng Camera</label>
              <Input value="8" disabled />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button variant="destructive" className="px-8 py-3 text-base font-semibold" onClick={onClose}>
            TỪ CHỐI
          </Button>
          <Button variant="lime" className="px-8 py-3 text-base font-semibold" onClick={onClose}>
            DUYỆT
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};
