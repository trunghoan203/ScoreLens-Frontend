'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HeaderAdmin } from '@/components/shared/HeaderAdmin';
import { Hourglass } from 'lucide-react'; // ✅ Lucide icon

export default function AdminPendingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#f0ffe5] overflow-hidden">
      {/* Header full width */}
      <HeaderAdmin />

      {/* Animated blob background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-slow" style={{ backgroundColor: '#8ADB10' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-slow animation-delay-3000" style={{ backgroundColor: '#8ADB10' }} />
        <div className="absolute top-48 left-48 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-slow animation-delay-6000" style={{ backgroundColor: '#8ADB10' }} />
      </div>

      {/* Main content */}
      <div className="flex justify-center pt-16 px-4">
        <div
          className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl ring-2 ring-black transition-all p-10 max-w-md w-full text-center animate-fade-in-up"
        >
          <div className="mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-inner"
              style={{ backgroundColor: 'rgba(138, 219, 16, 0.15)' }}
            >
              <div className="animate-hourglass">
                <Hourglass size={40} strokeWidth={2.5} className="text-[#8ADB10]" />
              </div>
            </div>
          </div>

          <h1
            className="text-3xl font-extrabold mb-4 bg-gradient-to-r bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(to right, #8ADB10, #8ADB10)' }}
          >
            Tài khoản đang chờ duyệt
          </h1>

          <p className="text-gray-700 mb-8 leading-relaxed text-[16px]">
            Tài khoản của bạn đã được gửi lên hệ thống và đang chờ quản trị viên xác nhận.
            <br /><br />
            Vui lòng kiểm tra lại sau hoặc liên hệ với quản trị viên để được hỗ trợ nhanh hơn.
          </p>

          <button
            className="w-full py-4 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            style={{
              backgroundImage: 'linear-gradient(to right, #8ADB10, #8ADB10)',
            }}
            onClick={() => router.push('/admin/login')}
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes blob-slow {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(40px, -60px) scale(1.1);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.95);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob-slow {
          animation: blob-slow 10s infinite ease-in-out;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-6000 {
          animation-delay: 6s;
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }

        @keyframes hourglass-flip {
          0% {
            transform: rotate(0deg);
          }
          40% {
            transform: rotate(180deg);
          }
          60% {
            transform: rotate(180deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        .animate-hourglass {
          display: inline-block;
          animation: hourglass-flip 2.2s cubic-bezier(0.4,0,0.2,1) infinite;
        }
      `}</style>
    </div>
  );
}
