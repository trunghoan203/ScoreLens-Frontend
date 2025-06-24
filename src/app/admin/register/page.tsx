'use client';

import React, { useState } from 'react';
import { RegisterSteps } from '@/components/auth/RegisterSteps';
import { RegisterForm } from '@/app/admin/register/RegisterForm';
import { VerificationForm } from '@/app/admin/register/VerificationForm';
import { RegisterDetailForm } from '@/app/admin/register/RegisterDetailForm';

export default function AdminRegisterPage() {
  const [step, setStep] = useState(1); // 1: đăng ký + xác thực, 2: thông tin chi tiết, 3: xác nhận
  const [showVerification, setShowVerification] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-white">
      <h1 className="text-3xl md:text-4xl font-bold text-center pt-12 pb-8 text-black">
        ĐĂNG KÝ TÀI KHOẢN ADMIN
      </h1>
      <RegisterSteps currentStep={step} />
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
      {step === 2 && (
        <RegisterDetailForm
          onSuccess={() => {
            setStep(3);
          }}
        />
      )}
      {step === 3 && (
        <div className="w-full max-w-md mx-auto flex flex-col gap-6 items-center px-0 pb-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Xác nhận</h2>
          <p className="text-gray-500 text-center">Đăng ký thành công! (Bổ sung UI xác nhận tại đây)</p>
        </div>
      )}
    </div>
  );
}
