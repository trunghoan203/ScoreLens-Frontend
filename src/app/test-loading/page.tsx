'use client';

import React, { useState } from 'react';
import { LoadingSpinner, LoadingPage, LoadingSkeleton, TableSkeleton, CardSkeleton, ScoreLensLoading } from '@/components/ui/loading';

export default function TestLoadingPage() {
  const [showPageLoading, setShowPageLoading] = useState(false);
  const [showFullScreenSpinner, setShowFullScreenSpinner] = useState(false);
  const [showScoreLensLoading, setShowScoreLensLoading] = useState(false);

  const handleShowPageLoading = () => {
    setShowPageLoading(true);
    setTimeout(() => setShowPageLoading(false), 3000);
  };

  const handleShowFullScreenSpinner = () => {
    setShowFullScreenSpinner(true);
    setTimeout(() => setShowFullScreenSpinner(false), 3000);
  };

  const handleShowScoreLensLoading = () => {
    setShowScoreLensLoading(true);
    setTimeout(() => setShowScoreLensLoading(false), 3500);
  };

  if (showPageLoading) {
    return (
      <LoadingPage
        title="Đang tải trang test..."
        subtitle="Demo loading page component"
        showLogo={true}
      />
    );
  }

  if (showScoreLensLoading) {
    return <ScoreLensLoading text="Đang tải..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Test Loading Components</h1>

        {/* ScoreLensLoading Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">ScoreLens Logo Loading (Custom)</h2>
          <div className="bg-[#18191A] p-8 rounded-lg shadow flex flex-col items-center">
            <div className="mb-6">
              <ScoreLensLoading text="Đang tải..." />
            </div>
            <button
              onClick={handleShowScoreLensLoading}
              className="px-6 py-3 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition"
            >
              Show Full Screen ScoreLens Loading
            </button>
          </div>
        </section>

        {/* LoadingSpinner Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">LoadingSpinner Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-4">Small Spinner</h3>
              <LoadingSpinner size="sm" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-4">Medium Spinner</h3>
              <LoadingSpinner size="md" text="Loading..." />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-4">Large Spinner</h3>
              <LoadingSpinner size="lg" color="lime" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-4">XL Spinner</h3>
              <LoadingSpinner size="xl" text="Processing..." color="lime" />
            </div>
          </div>
          
          <div className="mt-6 space-x-4">
            <button
              onClick={handleShowPageLoading}
              className="px-6 py-3 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition"
            >
              Show Page Loading
            </button>
            <button
              onClick={handleShowFullScreenSpinner}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Show Full Screen Spinner
            </button>
          </div>
        </section>

        {/* LoadingSkeleton Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">LoadingSkeleton Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-4">Text Skeleton</h3>
              <LoadingSkeleton type="text" lines={3} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-4">Card Skeleton</h3>
              <LoadingSkeleton type="card" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-4">Avatar Skeleton</h3>
              <LoadingSkeleton type="avatar" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-4">Button Skeleton</h3>
              <LoadingSkeleton type="button" className="w-32" />
            </div>
          </div>
        </section>

        {/* Table and Card Skeletons */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Table & Card Grid Skeletons</h2>
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-4">Table Skeleton</h3>
              <TableSkeleton rows={4} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium mb-4">Card Grid Skeleton</h3>
              <CardSkeleton cards={3} />
            </div>
          </div>
        </section>

        {/* Real-world Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Real-world Example (Branches Page)</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="w-full rounded-xl bg-lime-400 shadow-lg py-6 flex items-center justify-center mb-8">
              <span className="text-2xl font-extrabold text-white tracking-widest">
                CHI NHÁNH
              </span>
            </div>
            
            {/* Search bar skeleton */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-96 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            
            {/* Table skeleton */}
            <TableSkeleton rows={5} />
          </div>
        </section>
      </div>

      {/* Full Screen Spinner */}
      {showFullScreenSpinner && (
        <LoadingSpinner
          size="xl"
          text="Đang xử lý..."
          fullScreen={true}
        />
      )}
    </div>
  );
} 