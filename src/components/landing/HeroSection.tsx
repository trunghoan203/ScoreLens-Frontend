import React from 'react';

export const HeroSection = () => {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center flex items-center"
      style={{ backgroundImage: "url('/images/bannerHome.png')" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-3xl text-left">
          <h1 className="text-5xl text-white font-bold tracking-tighter">
            EVERY SHOT - EVERY RULE
          </h1>
          <p className="mt-8 text-xl text-white max-w-2xl">
            Tham gia cộng đồng bi-da sôi động - nơi tổ chức những giải đấu chuyên nghiệp, nâng tầm kỹ năng và chinh phục đỉnh cao vinh quang!
          </p>
        </div>
      </div>
    </section>
  );
}; 