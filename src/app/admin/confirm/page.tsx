"use client";

import React, { useState } from "react";
import { BrandInfoForm } from "../register/BrandInfoForm";
import { BranchInfoForm } from "../register/BranchInfoForm";
import { RegisterSteps } from "@/components/auth/RegisterSteps";
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { CheckCircle } from 'lucide-react';

interface BrandInfo {
  brandId: string;
  brandName: string;
  phoneNumber: string;
  website?: string;
  logo_url?: string;
  citizenCode: string;
}

interface Branch {
  name: string;
  address: string;
  deviceCount: string;
  phone: string;
}

export default function CompleteProfilePage() {
  const [step, setStep] = useState(1); // 1: Thông tin thương hiệu, 2: Thông tin chi nhánh, 3: Xác nhận
  const [brandInfo, setBrandInfo] = useState<BrandInfo | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleBrandInfoSuccess = (data: BrandInfo) => {
    setBrandInfo(data);
    setStep(2);
  };

  const handleBranchInfoSuccess = (data: Branch[]) => {
    setBranches(data);
    setStep(3);
  };

  const handleBranchInfoChange = (data: Branch[]) => {
    setBranches(data);
  };

  const handleBackToStep1 = () => {
    setStep(1);
  };

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
            onSuccess={handleBrandInfoSuccess}
            initialData={brandInfo}
          />
        )}
        {/* Bước 2: Thông tin chi nhánh */}
        {step === 2 && (
          <BranchInfoForm
            onSuccess={handleBranchInfoSuccess}
            onChange={handleBranchInfoChange}
            brandInfo={brandInfo}
            onBack={handleBackToStep1}
            initialBranches={branches}
          />
        )}
        {/* Bước 3: Thông báo thành công */}
        {step === 3 && (
          <div className="w-full max-w-lg mx-auto flex flex-col gap-6 items-center px-0 pb-8 animate-success-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-black mt-8 mb-2">BẠN ĐÃ ĐĂNG KÝ THÀNH CÔNG</h2>
            <p className="text-lg text-center text-gray-700 mb-2">Vui lòng chờ chúng tôi chấp nhận yêu cầu đăng ký của bạn!</p>
            <div className="flex justify-center my-6">
              <div className="animate-success-bounce">
                <CheckCircle size={110} strokeWidth={2} className="text-lime-400" fill="none"/>
              </div>
            </div>
            <div className="text-2xl font-bold text-black text-center mb-2 animate-success-pop">Cảm ơn bạn đã đăng ký!</div>
          </div>
        )}
      </div>
    </>
  );
} 