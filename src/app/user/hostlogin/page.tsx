import { Suspense } from 'react';
import { HostLoginPageClient } from './HostLoginPageClient';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { BackButton } from '@/components/ui/BackButton';

export default function HostLoginPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Nút Back ở góc trên bên trái */}
      <div className="absolute top-4 left-4 z-20">
        <BackButton onClick={() => router.back()} />
      </div>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#8ADB10] rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#8ADB10] rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-[#8ADB10] rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-md mx-auto space-y-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="sm:w-28 sm:h-28">
                <ScoreLensLogo />
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center px-4 py-2 bg-[#8ADB10]/10 rounded-full border border-[#8ADB10]/20">
                <span className="text-[#8ADB10] text-sm font-medium">Bàn {tableNumber || '...'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Pool 8 Ball
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                Tạo đội chơi
              </p>
            </div>

            {/* Team cards */}
            <div className="space-y-4">
              {renderTeamCard('Đội A', 'A', teamAPlayers)}
              {renderTeamCard('Đội B', 'B', teamBPlayers)}
            </div>
          </div>
        </div>

        {/* Bottom button */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleNext}
            className="w-full bg-[#8ADB10] hover:bg-[#7ACB00] text-white font-semibold py-4 rounded-2xl text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            Tiếp tục
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
    <Suspense fallback={<ScoreLensLoading text="Đang tải trang..." />}>
      <HostLoginPageClient />
    </Suspense>
  );
}