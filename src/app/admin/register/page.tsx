'use client';

import React, { useState } from 'react';
import { RegisterSteps } from '@/components/auth/RegisterSteps';
import { RegisterForm } from '@/app/admin/register/RegisterForm';
import { VerificationForm } from '@/app/admin/register/VerificationForm';
import { BrandInfoForm } from '@/app/admin/register/BrandInfoForm';
import { BranchInfoForm } from '@/app/admin/register/BranchInfoForm';

interface BrandInfo {
  image: File | null;
  shopName: string;
  fullName: string;
  cccd: string;
  phone: string;
}

export default function AdminRegisterPage() {
  const [step, setStep] = useState(1); // 1: đăng ký + xác thực, 2: thông tin thương hiệu, 3: thông tin chi nhánh, 4: xác nhận
  const [showVerification, setShowVerification] = useState(false);
  const [email, setEmail] = useState('');
  const [brandInfo, setBrandInfo] = useState<BrandInfo | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <h1 className="text-3xl md:text-4xl font-bold text-center pt-12 pb-8 text-black">
        ĐĂNG KÝ TÀI KHOẢN ADMIN
      </h1>
      <RegisterSteps currentStep={step} />
      
      {/* Bước 1: Đăng ký và xác thực */}
      {step === 1 && !showVerification && (
        <RegisterForm
          onSuccess={(email) => {
            setEmail(email);
            setShowVerification(true);
          }}
        />
      )}
      {step === 1 && showVerification && (
        <VerificationForm
          email={email}
          onBack={() => setShowVerification(false)}
          onSuccess={() => {
            setStep(2);
            setShowVerification(false);
          }}
        />
      )}

      {/* Bước 2: Thông tin thương hiệu */}
      {step === 2 && (
        <BrandInfoForm
          onSuccess={(data) => {
            setBrandInfo(data);
            setStep(3);
          }}
        />
      )}

      {/* Bước 3: Thông tin chi nhánh */}
      {step === 3 && (
        <BranchInfoForm
          onSuccess={() => {
            setStep(4);
          }}
          brandInfo={brandInfo}
          onBack={() => setStep(2)}
        />
      )}

      {/* Bước 4: Thông báo thành công */}
      {step === 4 && (
        <div className="w-full max-w-lg mx-auto flex flex-col gap-6 items-center px-0 pb-8 animate-success-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-black mt-8 mb-2">BẠN ĐÃ ĐĂNG KÝ THÀNH CÔNG</h2>
          <p className="text-lg text-center text-gray-700 mb-2">Vui lòng chờ chúng tôi chấp nhận yêu cầu đăng ký của bạn!</p>
          <div className="flex justify-center my-6">
            <div className="animate-success-bounce">
              <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="55" cy="55" r="55" fill="#A3E635"/>
                <path d="M35 58L50 73L75 48" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-black text-center mb-2 animate-success-pop">Cảm ơn đã Đăng ký!</div>
        </div>
      )}
    </div>
  );
}
