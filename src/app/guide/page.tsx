"use client";
import React from "react";
import { HeaderHome } from '@/components/shared/HeaderHome';
import { Footer } from '@/components/landing/Footer';

const guideSteps = [
  {
    title: 'Đăng nhập/Đăng ký',
    items: [
      'Chọn vai trò (Admin, Quản lý, Hội viên) để đăng nhập hoặc đăng ký tài khoản.',
      'Nhập thông tin theo yêu cầu để truy cập hệ thống.'
    ],
    backgroundImage: '/images/banner.png',
  },
  {
    title: 'Quản lý bàn bida',
    items: [
      'Xem danh sách các bàn, trạng thái (đang sử dụng, trống), chi tiết từng bàn.',
      'Thêm mới, chỉnh sửa hoặc xóa bàn khi cần thiết.'
    ],
    backgroundImage: '/images/ClubManagement.png',
  },
  {
    title: 'Quản lý hội viên',
    items: [
      'Xem danh sách hội viên, tìm kiếm, thêm mới hoặc chỉnh sửa thông tin hội viên.',
      'Theo dõi thời gian chơi, lịch sử trận đấu của từng hội viên.'
    ],
    backgroundImage: '/images/memberSystem.png',
  },
  {
    title: 'Quản lý camera',
    items: [
      'Gắn camera cho từng bàn để giám sát và hỗ trợ xác thực điểm số.',
      'Thêm, sửa, xóa thông tin camera.'
    ],
    backgroundImage: '/images/bannerHome.png',
  },
  {
    title: 'Quản lý trận đấu & tính điểm',
    items: [
      'Tạo trận đấu mới, nhập tên đội/đội viên.',
      'Hệ thống sẽ tự động cập nhật điểm số theo thời gian thực.',
      'Kết thúc trận đấu để lưu lại lịch sử và tổng hợp kết quả.'
    ],
    backgroundImage: '/images/bida.jpg',
  },
  {
    title: 'Phản hồi & hỗ trợ',
    items: [
      'Gửi phản hồi, góp ý hoặc báo lỗi qua mục "Phản hồi".',
      'Quản trị viên sẽ tiếp nhận và xử lý nhanh chóng.'
    ],
    backgroundImage: '/images/banner.png',
  },
];

const tips = [
  'Sử dụng thanh tìm kiếm để nhanh chóng lọc bàn, hội viên, quản lý... ',
  'Kiểm tra trạng thái bàn trước khi tạo trận đấu mới.',
  'Thường xuyên cập nhật thông tin hội viên để nhận ưu đãi.'
];

export default function GuidePage() {
  return (
    <>
      <HeaderHome />
      <div className="bg-black text-white min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[350px] md:min-h-[420px] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/images/bannerHome.png')" }}>
          <div className="absolute inset-0 bg-black/70 z-0"></div>
          <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-lime-400 drop-shadow-lg">Hướng dẫn sử dụng</h1>
            <p className="text-lg md:text-2xl text-gray-200 font-medium drop-shadow">Bắt đầu với ScoreLens – hệ thống quản lý & tính điểm bida hiện đại!</p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20 bg-white text-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-lime-600">Cách sử dụng ScoreLens</h2>
            <div className="grid md:grid-cols-2 gap-10">
              {guideSteps.map((step, idx) => (
                <div key={step.title} className="relative rounded-2xl overflow-hidden p-8 flex flex-col justify-end min-h-[340px] bg-cover bg-center shadow-lg" style={{ backgroundImage: `url('${step.backgroundImage}')` }}>
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-lime-300 mb-4 drop-shadow">{idx + 1}. {step.title}</h3>
                    <ul className="list-disc list-inside space-y-2 text-lg text-white">
                      {step.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-16 bg-gradient-to-r from-lime-400 via-lime-500 to-lime-600 text-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Mẹo sử dụng hiệu quả</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {tips.map((tip, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center">
                  <span className="text-5xl mb-4 text-lime-500">💡</span>
                  <p className="text-lg font-semibold text-gray-800">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
} 