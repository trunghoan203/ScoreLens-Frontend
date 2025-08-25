'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderAdmin } from '@/components/shared/HeaderAdmin';
import { CircleAlert } from 'lucide-react';
import adminService from '@/lib/adminService';
import { useI18n } from '@/lib/i18n/provider';

export default function AdminRejectedPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [adminId, setAdminId] = useState<string | null>(null);

  useEffect(() => {
    adminService.getProfile().then(res => {
      setAdminId(res.adminId || null);
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#fff0f0] overflow-hidden">
      <HeaderAdmin />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-slow" style={{ backgroundColor: '#EF4444' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-slow animation-delay-3000" style={{ backgroundColor: '#EF4444' }} />
        <div className="absolute top-48 left-48 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-slow animation-delay-6000" style={{ backgroundColor: '#EF4444' }} />
      </div>

      <div className="flex justify-center pt-24 sm:pt-28 px-4">
        <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl ring-2 ring-red-400 transition-all p-10 max-w-md w-full text-center animate-fade-in-up">
          <div className="mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-inner"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
            >
              <CircleAlert className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <h1
            className="text-3xl font-extrabold mb-4 bg-gradient-to-r bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(to right, #EF4444, #EF4444)' }}
          >
            {t('auth.accountRejected.title')}
          </h1>

          <p className="text-gray-700 mb-8 leading-relaxed text-[16px]">
            {t('auth.accountRejected.description')}{' '}
            <a href={`/admin/reform?${adminId}`} rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {t('auth.accountRejected.here')}
            </a>
            {' '}{t('auth.accountRejected.forMoreDetails')}
          </p>

          <button
            className="w-full py-4 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            style={{
              backgroundImage: 'linear-gradient(to right, #EF4444, #DC2626)',
            }}
            onClick={() => router.push('/admin/login')}
          >
            {t('auth.accountRejected.backToLogin')}
          </button>
        </div>
      </div>

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
      `}</style>
    </div>
  );
}
