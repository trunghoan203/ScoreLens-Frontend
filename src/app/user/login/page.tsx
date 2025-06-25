'use client'; // Cần 'use client' vì chúng ta sử dụng state và event handlers

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Dùng để chuyển trang
import { ScoreLensLogo } from '@/components/icons/LogoBlack';
import MemberIdForm from '@/components/auth/MemberIdForm'; // Component nhập mã hội viên

export default function StartSessionPage() {
  const [memberId, setMemberId] = useState(''); // State để lưu mã hội viên
  const router = useRouter();

  // Thông tin bàn chơi (có thể lấy từ URL params hoặc state)
  const tableNumber = '06';

  const handleCreateMatch = () => {
    // Logic xử lý khi nhấn nút "Tạo trận đấu"
    // 1. Kiểm tra mã hội viên (nếu cần)
    // 2. Chuyển đến trang thiết lập trận đấu
    console.log('Creating match with Member ID:', memberId);
    router.push('/user/creatematch'); // Chuyển đến trang tiếp theo
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-white px-4 pt-10">
      <div className="flex-grow flex flex-col items-center justify-center text-center w-full max-w-sm">
        {/* Phần Logo và lời chào */}
        <div className='h-12 w-auto'></div>
        <ScoreLensLogo />
        <h1 className="mt-6 text-3xl font-bold text-gray-800">
          Chào mừng bạn đến với ScoreLens
        </h1>
        <p className="mt-2 text-2xl text-gray-600">Bàn {tableNumber}</p>

        {/* Phần Form */}
        <div className="w-full mt-10">
          <MemberIdForm
            memberId={memberId}
            onMemberIdChange={setMemberId}
            onSubmit={handleCreateMatch}
          />
        </div>
      </div>
    </div>
  );
}