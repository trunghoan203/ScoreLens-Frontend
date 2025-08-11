import React from 'react';

interface FeatureCardProps {
  title: string;
  items: string[];
  backgroundImage: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, items, backgroundImage }) => (
  <div 
    className="relative rounded-2xl overflow-hidden p-10 flex flex-col justify-end min-h-[600px] bg-cover bg-center"
    style={{ backgroundImage: `url('${backgroundImage}')` }}
  >
    <div className="absolute inset-0 bg-black/2"></div>
    <div className="relative z-10">
      <h3 className="text-4xl font-bold">{title}</h3>
      <ul className="list-disc list-inside mt-4 space-y-2">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  </div>
);

const features: FeatureCardProps[] = [
  {
    title: "HỆ THỐNG QUẢN LÝ CLB BIDA",
    items: [
      "Giúp ban tổ chức và vận hành CLB bida hiệu quả hơn",
      "Quản lý lịch thi đấu, điểm số và lịch sử trận đấu",
      "Hỗ trợ theo dõi hoạt động của từng bàn theo thời gian thực",
      "Dễ sử dụng, phù hợp với mọi mô hình quản lý CLB",
    ],
    backgroundImage: "/images/clubManagement.jpg", // Placeholder
  },
  {
    title: "HỆ THỐNG HỘI VIÊN",
    items: [
      "Tạo cộng đồng người chơi trung thành ngay tại quán của bạn",
      "Quản lý và lưu trữ thông tin hội viên",
      "Tạo điều kiện tổ chức các sự kiện, xếp hạng hội viên",
      "Chăm sóc khách hàng thông qua các ưu đãi",
    ],
    backgroundImage: "/images/memberSystem.png", // Placeholder
  },
];

export const FeatureCardsSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}; 