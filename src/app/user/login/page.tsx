'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';
import MemberIdForm from '@/components/auth/MemberIdForm';

export default function StartSessionPage() {
  const [memberId, setMemberId] = useState('');
  const router = useRouter();
  const tableNumber = '06';

  const handleCreateMatch = () => {
    console.log('Creating match with Member ID:', memberId);
    router.push('/user/creatematch');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl flex flex-col items-center text-center space-y-6 py-10">
        {/* Logo */}
        <div className="sm:w-28 sm:h-28">
          <ScoreLensLogo />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          Chào mừng bạn đến với ScoreLens
        </h1>
        <p className="text-lg sm:text-xl text-gray-600">Bàn {tableNumber}</p>

        {/* Form */}
        <div className="w-full px-2 sm:px-0">
          <MemberIdForm
            memberId={memberId}
            onMemberIdChange={setMemberId}
            onSubmit={handleCreateMatch}
          />
        </div>
      </div>
    </div>
  );
}
