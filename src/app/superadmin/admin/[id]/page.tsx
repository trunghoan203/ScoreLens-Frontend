'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HeaderAdmin } from '@/components/shared/HeaderAdmin';
import { PageBanner } from '@/components/shared/PageBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getAdminDetail, approveAdmin, rejectAdmin } from '@/lib/saAdminService';

interface Club {
  clubId: string;
  clubName: string;
  address: string;
  tableNumber: number;
  cameraNumber: number;
}

interface Brand {
  brandName: string;
  citizenCode: string;
  numberPhone: string;
}

interface Admin {
  id: string;
  fullName: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  brand?: Brand;
  clubs?: Club[];
  rejectedReason?: string;
}

export default function AdminDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      toast.error('ID không hợp lệ');
      return;
    }
    setLoading(true);
    getAdminDetail(id)
      .then((res) => {
        const data = res.data as { admin?: Admin };
        if (!data.admin) {
          toast.error('Không tìm thấy admin');
          setAdmin(null);
        } else {
          setAdmin(data.admin);
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error('Không tìm thấy admin');
        setLoading(false);
      });
  }, [id]);

  const handleApprove = async () => {
    try {
      await approveAdmin(id);
      toast.success('Admin đã được duyệt.');
      router.push('/superadmin/home?tab=approval');
    } catch {
      toast.error('Duyệt thất bại');
    }
  };

  const handleReject = async () => {
    setShowRejectReason(true);
  };
  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối!');
      return;
    }
    setRejecting(true);
    try {
      await rejectAdmin(id, rejectReason);
      toast.success('Admin đã bị từ chối.');
      router.push('/superadmin/home?tab=approval');
    } catch {
      toast.error('Từ chối thất bại');
    } finally {
      setRejecting(false);
      setShowRejectReason(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Đang tải...</div>;
  if (!admin) return <div className="p-4 text-center text-red-500">Không tìm thấy admin với ID: {id}</div>;

  return (
    <>
      <HeaderAdmin />
      <PageBanner title="ADMIN" />
      <div className="min-h-screen bg-gray-50 px-4 md:px-8 py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-black">
            THÔNG TIN CHI TIẾT
          </h2>

          <div className="flex flex-col items-center mb-4">
            <span className="text-base font-semibold">
              Trạng thái: {admin.status === 'pending' && (
                <span className="text-yellow-500">Chờ duyệt</span>
              )}
              {admin.status === 'approved' && (
                <span className="text-green-600">Đã duyệt</span>
              )}
              {admin.status === 'rejected' && (
                <span className="text-red-600">Bị từ chối</span>
              )}
            </span>
            {admin.status === 'rejected' && admin.rejectedReason && (
              <div className="mt-2 px-4 py-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm max-w-xl text-center">
                <b>Lý do bị từ chối:</b> {admin.rejectedReason}
              </div>
            )}
          </div>
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex justify-center">
              <div className="w-60 h-72 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">
                Hình ảnh giải đấu
              </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Tên Quán</label>
                <Input value={admin.brand?.brandName || ''} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Họ và Tên</label>
                <Input value={admin.fullName || ''} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">CCCD</label>
                <Input value={admin.brand?.citizenCode || ''} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Số Điện Thoại</label>
                <Input value={admin.brand?.numberPhone || ''} disabled />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-1">Email</label>
                <Input value={admin.email || ''} disabled />
              </div>
            </div>
          </div>
          {/* Danh sách chi nhánh */}
          {admin.clubs && admin.clubs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div />
              <div className="md:col-span-2 space-y-4">
                {admin.clubs.map((club: Club, idx: number) => (
                  <div
                    key={club.clubId}
                    className="relative p-6 border rounded-xl bg-white shadow-md mb-6 transition-shadow hover:shadow-lg"
                  >
                    <div className="mb-4">
                      <span className="text-base font-semibold text-lime-600">Chi nhánh {idx + 1}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tên chi nhánh</label>
                        <div className="font-medium text-gray-800">{club.clubName || ''}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Địa chỉ</label>
                        <div className="font-medium text-gray-800">{club.address || ''}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Số bàn</label>
                        <div className="font-medium text-gray-800">{club.tableNumber || ''}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Số lượng camera</label>
                        <div className="font-medium text-gray-800">{club.cameraNumber || ''}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Nút Hành Động */}
          {admin.status === 'pending' ? (
            <div className="flex flex-col items-center gap-6 pt-4">
              <div className="flex justify-center gap-8">
                <Button
                  className="w-44 h-12 text-base font-semibold rounded-xl"
                  onClick={handleReject}
                  variant="destructive"
                >
                  TỪ CHỐI
                </Button>
                <Button
                  className="w-44 h-12 text-base font-semibold rounded-xl bg-lime-500 hover:bg-lime-600 text-white"
                  onClick={handleApprove}
                >
                  DUYỆT
                </Button>
              </div>
              {showRejectReason && (
                <div className="w-full max-w-md bg-white border border-red-200 rounded-xl shadow-lg p-6 mt-4">
                  <label className="block text-sm font-medium text-red-700 mb-2">Lý do từ chối</label>
                  <textarea
                    className="w-full min-h-[80px] border border-red-300 rounded-lg p-2 mb-3 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                    disabled={rejecting}
                  />
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowRejectReason(false)}
                      disabled={rejecting}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleConfirmReject}
                      disabled={rejecting}
                    >
                      {rejecting ? 'Đang gửi...' : 'Xác nhận từ chối'}
                    </Button>
                  </div>
                </div>
              )}
              <Button
                className="w-44 h-12 text-base font-semibold rounded-xl"
                onClick={() => router.push('/superadmin/home')}
                variant="outline"
              >
                QUAY LẠI
              </Button>
            </div>
          ) : (
            <div className="flex justify-center pt-4">
              <Button
                className="w-44 h-12 text-base font-semibold rounded-xl"
                onClick={() => router.push('/superadmin/home')}
                variant="outline"
              >
                QUAY LẠI
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}