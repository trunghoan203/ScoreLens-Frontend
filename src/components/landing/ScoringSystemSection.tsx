import React from 'react';
import Image from 'next/image';

export const ScoringSystemSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white text-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <div className="rounded-lg overflow-hidden order-2 lg:order-1">
          <Image 
  src="/images/bida.jpg"
  alt="People playing billiards" 
  width={600} 
  height={400} 
  className="w-full h-auto object-cover filter brightness-75 transition duration-300"
/>
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Hệ thống tính điểm Bida là gì?</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Hệ thống tính điểm Bida tự động giúp đơn giản hóa theo dõi điểm số, chính xác và minh bạch trong từng trận đấu. Phù hợp cho các giải đấu chuyên nghiệp hiện đại, hệ thống này hỗ trợ:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700 mb-6 sm:mb-8">
            <li>Cập nhật điểm số theo thời gian thực</li>
            <li>Lưu trữ lịch sử trận đấu</li>
            <li>Tổng hợp kết quả nhanh chóng</li>
            <li>Hạn chế sai sót khi tính điểm thủ công</li>
          </ul>
        </div>
      </div>
    </section>
  );
}; 