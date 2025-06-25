import { ScoreLensLogo } from '@/components/icons/LogoWhite';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#18191A] text-white flex flex-col py-8 px-4 min-h-screen">
      <div className="flex flex-col items-center mb-10">
        <ScoreLensLogo />
      </div>
      <nav className="flex-1 space-y-2">
        <Link href="#" className="block px-4 py-2 rounded-lg bg-lime-400 text-black font-semibold">Chi nhánh</Link>
        <Link href="#" className="block px-4 py-2 rounded-lg hover:bg-lime-100 hover:text-black transition">Quản lý</Link>
        <Link href="#" className="block px-4 py-2 rounded-lg hover:bg-lime-100 hover:text-black transition">Thông tin cá nhân</Link>
        <Link href="#" className="block px-4 py-2 rounded-lg hover:bg-lime-100 hover:text-black transition">Đăng xuất</Link>
      </nav>
    </aside>
  );
} 