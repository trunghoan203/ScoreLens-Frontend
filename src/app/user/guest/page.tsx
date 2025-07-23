import { Suspense } from 'react';
import { GuestJoinPageClient } from './GuestJoinPageClient';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { BackButton } from '@/components/ui/BackButton';

export default function GuestPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100 px-4 relative">
      {/* Nút Back ở góc trên bên trái */}
      <div className="absolute top-4 left-4 z-20">
        <BackButton onClick={() => router.back()} />
      </div>
      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col items-center text-center space-y-8 py-10 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="sm:w-28 sm:h-28">
            <ScoreLensLogo />
          </div>
        </div>

        {/* Tiêu đề */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Bàn {tableNumber || '...'} - Pool 8 Ball
          </h1>
          <p className="text-sm sm:text-base text-black font-medium">
            Nhập tên để tham gia phòng {roomCode || '...'}
          </p>
        </div>

        {/* Input Họ và Tên */}
        <div className="w-full max-w-sm">
  <label className="block text-base sm:text-lg font-semibold text-black mb-2 text-center">
    Họ và Tên
  </label>
  <input
    type="text"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    placeholder="Nhập tên của bạn..."
    className="border border-black rounded-xl px-5 py-3 text-base w-full text-black placeholder-black/60 focus:outline-none focus:border-lime-500 hover:border-lime-400 transition-all duration-200 text-center"
  />
</div>
      </div>

      {/* Nút submit ở dưới cùng */}
      <div className="w-full p-4 bg-white shadow-inner">
        <button
          onClick={handleSubmit}
          className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold py-3 rounded-xl text-base sm:text-lg transition"
        >
          Tiếp tục
        </button>
      </div>
    </div>
    <Suspense fallback={<ScoreLensLoading text="Đang vào phòng..." />}>
      <GuestJoinPageClient />
    </Suspense>
  );
}