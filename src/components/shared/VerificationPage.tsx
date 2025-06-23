"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

interface VerificationPageProps {
  identifierLabel: string; // 'email' hoặc 'mã quản lý'
  identifierValue: string;
  onSuccess?: (code: string) => void;
  redirectTarget?: string; // route chuyển tiếp sau khi xác minh thành công
}

export function VerificationPage({
  identifierLabel,
  identifierValue,
  onSuccess,
  redirectTarget,
}: VerificationPageProps) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");
      // Move to next input
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pasteData.every((char) => /^[0-9]$/.test(char))) {
      const newOtp = [...otp];
      pasteData.forEach((char, index) => {
        if (index < 6) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const verificationCode = otp.join("");
    // Simulate API call
    setTimeout(() => {
      if (verificationCode === "123456") {
        if (onSuccess) onSuccess(verificationCode);
        else if (redirectTarget) window.location.href = redirectTarget;
      } else {
        setError("Mã xác minh không hợp lệ. Vui lòng thử lại.");
      }
      setIsLoading(false);
    }, 2000);
  };

  const handleResendCode = () => {
    if (resendCooldown === 0) {
      // Add logic to resend code via API
      setResendCooldown(30);
    }
  };

  return (
    <div className="flex flex-col justify-center p-8 md:p-12 w-[400px] h-[500px]">
      <div className="flex flex-col items-center">
        <Image
          src="/images/logoScoreLensBlack.png"
          alt="ScoreLens Logo"
          width={200}
          height={50}
          priority
        />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nhập mã xác minh</h2>
          <p className="text-gray-600">
            Chúng tôi đã gửi mã 6 số đến <br />
            <strong>{identifierValue}</strong>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-2xl font-bold text-gray-800 focus:text-lime-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-400"
                required
                disabled={isLoading}
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button
            type="submit"
            disabled={isLoading || otp.join("").length !== 6}
            className="w-full bg-lime-400 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-lime-500 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang xác minh..." : "Xác minh"}
          </Button>
          <div className="text-center text-sm">
            <p className="text-gray-600">
              Không nhận được mã?{' '}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendCooldown > 0}
                className="font-medium text-lime-500 hover:text-lime-600 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Gửi lại {resendCooldown > 0 ? `(${resendCooldown}s)` : ''}
              </button>
            </p>
          </div>
          <div className="text-center">
            <Link
              href={identifierLabel === 'email' ? "/admin/login" : "/manager/login"}
              className="text-sm font-medium text-gray-800 hover:text-lime-500 transition-colors"
            >
              ← Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 