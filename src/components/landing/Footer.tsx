import React from 'react';
import { ScoreLensLogo } from '@/components/icons/LogoWhite';

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-gray-400 hover:text-white transition-colors">{children}</a>
);

export const Footer = () => {
  return (
    <footer className="py-16 border-t border-gray-800 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center">
            <ScoreLensLogo />
          </div>
          <p className="text-gray-400 mt-4 text-lg">TÍNH ĐIỂM BIDA TỰ ĐỘNG - CHÍNH XÁC TRONG TỪNG LƯỢT CHƠI.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">CHỨC NĂNG</h4>
            <div className="space-y-3 flex flex-col">
              <FooterLink href="#">Theo dõi điểm tự động</FooterLink>
              <FooterLink href="#">Quản lý CLB</FooterLink>
              <FooterLink href="#">Hệ thống hội viên</FooterLink>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">HỖ TRỢ</h4>
            <div className="space-y-3 flex flex-col">
              <FooterLink href="#">Các câu hỏi phổ biến</FooterLink>
              <FooterLink href="#">Điều khoản dịch vụ</FooterLink>
              <FooterLink href="#">Hướng dẫn trực tuyến (FAQs)</FooterLink>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">LIÊN HỆ/MẠNG XÃ HỘI</h4>
            <div className="space-y-3">
              <p className="text-gray-400">Số điện thoại: 0912345678</p>
              <p className="text-gray-400">Email: scorelens@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 