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
import { useI18n } from "@/lib/i18n/provider";

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
  const { t } = useI18n();
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
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
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
      {loading && <ScoreLensLoading text={t('common.loading')} />}
      <div className="min-h-screen bg-white">
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center pt-8 sm:pt-12 pb-6 sm:pb-8 text-black">
            {t('confirm.title')}
          </h1>
          <RegisterSteps currentStep={step} />
        </div>

        {step === 1 && (
          <div className="px-4 sm:px-6 lg:px-8">
            <BrandInfoForm
              onSuccess={handleBrandInfoSuccess}
              initialData={brandInfo}
            />
          </div>
        )}

        {step === 2 && (
          <div className="px-4 sm:px-6 lg:px-8">
            <BranchInfoForm
              onSuccess={handleBranchInfoSuccess}
              onChange={handleBranchInfoChange}
              brandInfo={brandInfo}
              onBack={handleBackToStep1}
              initialBranches={branches}
            />
          </div>
        )}

        {step === 3 && (
          <div className="w-full max-w-md sm:max-w-lg mx-auto flex flex-col gap-4 sm:gap-6 items-center px-4 sm:px-6 lg:px-8 pb-8 animate-success-fade-in">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-black mt-6 sm:mt-8 mb-2">
              {t('confirm.registrationSuccess')}
            </h2>
            <p className="text-base sm:text-lg text-center text-gray-700 mb-2 px-4">
              {t('confirm.waitForApproval')}
            </p>
            <div className="flex justify-center my-4 sm:my-6">
              <div className="animate-success-bounce">
                <CheckCircle
                  size={80}
                  className="sm:w-[110px] sm:h-[110px] text-lime-400"
                  strokeWidth={2}
                  fill="none"
                />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-black text-center mb-2 animate-success-pop">
              {t('confirm.thankYou')}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 text-center px-4">
              {t('confirm.redirectMessage')}{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={countdown}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.4 }}
                  className="font-bold text-base sm:text-lg text-lime-500 inline-block"
                >
                  {countdown}
                </motion.span>
              </AnimatePresence>{" "}
              {t('confirm.seconds')}
            </p>
          </div>
        )}
      </div>
    </>
  );
} 