"use client";
import React, { useState, useEffect } from "react";
import SidebarManager from "@/components/manager/SidebarManager";
import HeaderManager from "@/components/manager/HeaderManager";
import FeedbackSearchBar from "@/components/manager/FeedbackSearchBar";
import FeedbackGrid from "@/components/manager/FeedbackGrid";
import FeedbackPageBanner from "@/components/manager/FeedbackPageBanner";
import { useRouter } from "next/navigation";
import { useManagerAuthGuard } from '@/lib/hooks/useManagerAuthGuard';

export default function FeedbacksPage() {
  const { isChecking } = useManagerAuthGuard();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("managerP");
  const [dateFilter, setDateFilter] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFeedbackClick = (feedbackId: string) => {
    router.push(`/manager/feedbacks/${feedbackId}`);
  };

  if (isChecking) return null;

  return (
    <>
      <div className="min-h-screen flex bg-[#18191A]">
        <SidebarManager />
        <main className="flex-1 bg-white min-h-screen">
          <div className={`sticky top-0 z-10 bg-[#FFFFFF] px-8 py-8 transition-all duration-300 ${isScrolled ? 'border-b border-gray-200 shadow-sm' : ''
            }`}>
            <HeaderManager />
          </div>
          <div className="p-10">
            <FeedbackPageBanner />
            <FeedbackSearchBar
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
            />
            <FeedbackGrid
              search={search}
              statusFilter={statusFilter}
              dateFilter={dateFilter}
              onFeedbackClick={handleFeedbackClick}
            />
          </div>
        </main>
      </div>
    </>
  );
} 