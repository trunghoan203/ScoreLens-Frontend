import React, { useState, useEffect } from 'react';
import { LoadingSpinner, LoadingPage, LoadingSkeleton, TableSkeleton, CardSkeleton } from './loading';

// Ví dụ sử dụng LoadingSpinner
export const SpinnerExample = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">LoadingSpinner Examples:</h3>
      
      {/* Small spinner */}
      <div className="flex items-center space-x-4">
        <LoadingSpinner size="sm" />
        <span>Small spinner</span>
      </div>

      {/* Medium spinner with text */}
      <div className="flex items-center space-x-4">
        <LoadingSpinner size="md" text="Đang tải..." />
        <span>Medium spinner with text</span>
      </div>

      {/* Large spinner */}
      <div className="flex items-center space-x-4">
        <LoadingSpinner size="lg" color="lime" />
        <span>Large lime spinner</span>
      </div>

      {/* Full screen spinner */}
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-lime-500 text-white rounded-lg"
      >
        Show Full Screen Spinner
      </button>

      {isLoading && (
        <LoadingSpinner
          size="xl"
          text="Đang xử lý..."
          fullScreen={true}
        />
      )}
    </div>
  );
};

// Ví dụ sử dụng LoadingPage
export const PageExample = () => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    setShowLoading(true);
    const timer = setTimeout(() => setShowLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showLoading) {
    return (
      <LoadingPage
        title="Đang khởi tạo hệ thống"
        subtitle="Vui lòng chờ trong giây lát..."
        showLogo={true}
      />
    );
  }

  return <div>Page content loaded!</div>;
};

// Ví dụ sử dụng LoadingSkeleton
export const SkeletonExample = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">LoadingSkeleton Examples:</h3>
        
        {/* Text skeleton */}
        <div>
          <h4 className="font-medium mb-2">Text Skeleton:</h4>
          <LoadingSkeleton type="text" lines={3} />
        </div>

        {/* Card skeleton */}
        <div>
          <h4 className="font-medium mb-2">Card Skeleton:</h4>
          <LoadingSkeleton type="card" />
        </div>

        {/* Avatar skeleton */}
        <div>
          <h4 className="font-medium mb-2">Avatar Skeleton:</h4>
          <LoadingSkeleton type="avatar" />
        </div>

        {/* Button skeleton */}
        <div>
          <h4 className="font-medium mb-2">Button Skeleton:</h4>
          <LoadingSkeleton type="button" className="w-32" />
        </div>

        {/* Table skeleton */}
        <div>
          <h4 className="font-medium mb-2">Table Skeleton:</h4>
          <TableSkeleton rows={3} />
        </div>

        {/* Card grid skeleton */}
        <div>
          <h4 className="font-medium mb-2">Card Grid Skeleton:</h4>
          <CardSkeleton cards={2} />
        </div>
      </div>
    );
  }

  return <div>Content loaded!</div>;
};

// Hook để quản lý loading state
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const withLoading = async (asyncFunction: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await asyncFunction();
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, setIsLoading, withLoading };
}; 