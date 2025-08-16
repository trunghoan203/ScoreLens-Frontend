"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BrandInfoForm } from "../register/BrandInfoForm";
import { BranchInfoForm } from "../register/BranchInfoForm";
import { RegisterSteps } from "@/components/auth/RegisterSteps";
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import { CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import axios from '@/lib/axios';

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
  const [step, setStep] = useState(1);
  const [brandInfo, setBrandInfo] = useState<BrandInfo | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    if (step === 3) {
      setCountdown(5);
   
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
   
      const timeout = setTimeout(() => {
        try {
          const token = localStorage.getItem('adminAccessToken');
          if (token) {
            axios.post(
              '/admin/sendmail',
              {},
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            ).catch((error) => {
              console.error('Error sending email:', error);
            });
          }
        } catch (error) {
          console.error('Error starting sendmail request:', error);
        }
      
        router.push("/admin/pending");
      }, 5000);
      
   
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [step, router]);
  
  

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
        {step === 1 && (
          <BrandInfoForm
            onSuccess={handleBrandInfoSuccess}
            initialData={brandInfo}
          />
        )}
        {step === 2 && (
          <BranchInfoForm
            onSuccess={handleBranchInfoSuccess}
            onChange={handleBranchInfoChange}
            brandInfo={brandInfo}
            onBack={handleBackToStep1}
            initialBranches={branches}
          />
        )}
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
            <p className="text-sm text-gray-500 text-center">
              Bạn sẽ được chuyển hướng tự động trong{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={countdown}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.4 }}
                  className="font-bold text-lg text-lime-500 inline-block"
                >
                  {countdown}
                </motion.span>
              </AnimatePresence>{" "}
              giây...
            </p>
          </div>
        )}
      </div>
    </>
  );
} 