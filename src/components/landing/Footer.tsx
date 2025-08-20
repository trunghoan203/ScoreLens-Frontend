import React from 'react';
import { ScoreLensLogo } from '@/components/icons/LogoWhite';

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-gray-400 hover:text-white transition-colors">{children}</a>
);

export const Footer = () => {
  return (
    <footer className="py-8 sm:py-12 md:py-16 border-t border-gray-800 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center">
            <ScoreLensLogo />
          </div>
          <p className="text-gray-400 mt-4 text-sm sm:text-base md:text-lg">TÍNH ĐIỂM BIDA TỰ ĐỘNG - CHÍNH XÁC TRONG TỪNG LƯỢT CHƠI.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-center lg:text-left">
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-white">CHỨC NĂNG</h4>
            <div className="space-y-2 sm:space-y-3 flex flex-col">
              <FooterLink href="#">Theo dõi điểm tự động</FooterLink>
              <FooterLink href="#">Quản lý CLB</FooterLink>
              <FooterLink href="#">Hệ thống hội viên</FooterLink>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-white">HỖ TRỢ</h4>
            <div className="space-y-2 sm:space-y-3 flex flex-col">
              <FooterLink href="#">Các câu hỏi phổ biến</FooterLink>
              <FooterLink href="#">Điều khoản dịch vụ</FooterLink>
              <FooterLink href="#">Hướng dẫn trực tuyến (FAQs)</FooterLink>
            </div>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-white">LIÊN HỆ/MẠNG XÃ HỘI</h4>
            <div className="space-y-2 sm:space-y-3">
              <p className="text-gray-400 text-sm sm:text-base">Số điện thoại: 0912345678</p>
              <p className="text-gray-400 text-sm sm:text-base">Email: scorelensbillards@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 