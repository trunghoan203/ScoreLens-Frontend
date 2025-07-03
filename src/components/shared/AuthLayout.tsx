import React, { ReactNode } from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: ReactNode;
  title?: React.ReactNode;
  description?: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-50">
      <div className="relative z-30 flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full mx-4">
        {/* FORM SECTION */}
        <div className="flex flex-col justify-center p-8 md:p-12 w-full md:w-[450px] min-h-[200px]">
          {/* Fixed Header - Logo and Title */}
          <div className="flex-shrink-0 w-full ">
            <div className="flex flex-col items-center text-center mb-8">
              <Image
                src="/images/logoScoreLensBlack.png"
                alt="ScoreLens Logo"
                width={200}
                height={50}
                priority
                className="mb-4"
              />
              {title && (
                <h1 className="text-2xl font-bold text-gray-900 ">{title}</h1>
              )}
              {description && (
                <p className="text-gray-600 text-center mt-2">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>

        {/* IMAGE SECTION */}
        <div className="hidden md:block w-[450px] h-[710px]">
          <Image
            src="/images/imgLogin.png"
            alt="Billiards table"
            width={450}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
} 