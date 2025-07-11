"use client";

import React, { useState } from "react";
import { BrandInfoForm } from "../register/BrandInfoForm";
import { BranchInfoForm } from "../register/BranchInfoForm";
import { RegisterSteps } from "@/components/auth/RegisterSteps";
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';

interface BrandInfo {
  image: File | null;
  shopName: string;
  fullName: string;
  cccd: string;
  phone: string;
}

export default function CompleteProfilePage() {
  const [step, setStep] = useState(1); // 1: Thông tin thương hiệu, 2: Thông tin chi nhánh, 3: Xác nhận
  const [brandInfo, setBrandInfo] = useState<BrandInfo | null>(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <ScoreLensLoading text="Đang tải..." />}
      <div className="min-h-screen bg-white">
        <h1 className="text-3xl md:text-4xl font-bold text-center pt-12 pb-8 text-black">
          BỔ SUNG THÔNG TIN TÀI KHOẢN
        </h1>
        <RegisterSteps currentStep={step} />
        {/* Bước 1: Thông tin thương hiệu */}
        {step === 1 && (
          <BrandInfoForm
            onSuccess={(data) => {
              setBrandInfo(data);
              setStep(2);
            }}
          />
        )}
        {/* Bước 2: Thông tin chi nhánh */}
        {step === 2 && (
          <BranchInfoForm
            onSuccess={() => {
              setStep(3);
            }}
            brandInfo={brandInfo}
            onBack={() => setStep(1)}
          />
        )}
        {/* Bước 3: Thông báo thành công */}
        {step === 3 && (
          <div className="w-full max-w-lg mx-auto flex flex-col gap-6 items-center px-0 pb-8 animate-success-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-black mt-8 mb-2">BẠN ĐÃ BỔ SUNG THÔNG TIN THÀNH CÔNG</h2>
            <p className="text-lg text-center text-gray-700 mb-2">Cảm ơn bạn đã hoàn thiện hồ sơ. Bạn có thể sử dụng đầy đủ chức năng!</p>
            <div className="flex justify-center my-6">
              <div className="animate-success-bounce">
                <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="55" cy="55" r="55" fill="#A3E635"/>
                  <path d="M35 58L50 73L75 48" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-black text-center mb-2 animate-success-pop">Chúc bạn thành công!</div>
          </div>
        )}
      </div>
    </>
  );
} 