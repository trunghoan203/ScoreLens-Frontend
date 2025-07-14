'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ScoreLensLogo } from '@/components/icons/LogoBlack';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import Image from 'next/image';

export default function GuestLoginPage() {
  const [roomCode, setRoomCode] = useState<string[]>(['', '', '', '', '', '']);
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const numberImages = [
    '/images/numberBalls/ball_0.png',
    '/images/numberBalls/ball_1.png',
    '/images/numberBalls/ball_2.png',
    '/images/numberBalls/ball_3.png',
    '/images/numberBalls/ball_4.png',
    '/images/numberBalls/ball_5.png',
    '/images/numberBalls/ball_6.png',
    '/images/numberBalls/ball_7.png',
    '/images/numberBalls/ball_8.png',
    '/images/numberBalls/ball_9.png',
  ];

  useEffect(() => {
    const room = searchParams.get('room');
    const table = searchParams.get('table');
    if (room) setRoomCode(room.slice(0, 6).split(''));
    if (table) setTableNumber(table);

    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '');
    const newCode = [...roomCode];
    newCode[index] = digit;
    setRoomCode(newCode);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (roomCode[index]) {
        const newCode = [...roomCode];
        newCode[index] = '';
        setRoomCode(newCode);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleContinue = () => {
    const code = roomCode.join('');
    if (code.length < 6) return;
    router.push(`/user/guest?table=${tableNumber}&room=${code}`);
  };

  return (
    <div className="relative h-screen flex flex-col bg-white px-4 sm:px-6 overflow-hidden">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-50">
          <ScoreLensLoading text="Đang tải..." />
        </div>
      )}

      {/* Nội dung chính */}
      <div
        className={`flex-1 flex flex-col items-center justify-center gap-6 w-full max-w-md mx-auto transition-opacity duration-300 ${
          loading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Logo */}
        <div className="flex justify-center">
          <div className="sm:w-28 sm:h-28">
            <ScoreLensLogo />
          </div>
        </div>

        {/* Tiêu đề và nhập mã */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-black text-center">
            Bàn {tableNumber || '...'} - Pool 8 Ball
          </h2>
          <p className="text-base sm:text-lg text-black font-medium text-center">
            Hãy nhập mã
          </p>
          <div className="flex gap-2 justify-center">
            {roomCode.map((digit, index) => (
              <div
                key={index}
                className={`relative w-12 aspect-square flex items-center justify-center rounded-full border-2 transition-all duration-200 bg-white shadow-md cursor-pointer
                  ${inputRefs.current[index] && document.activeElement === inputRefs.current[index]
                    ? 'border-lime-500 shadow-lg'
                    : digit
                    ? 'border-lime-400'
                    : 'border-gray-300'}
                `}
                onClick={() => inputRefs.current[index]?.focus()}
              >
                <input
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  className="absolute inset-0 opacity-0 z-10 text-center"
                />
                {digit ? (
                  <Image
                    src={numberImages[parseInt(digit)]}
                    alt={`Ball ${digit}`}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-gray-300 text-xl select-none">-</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nút tiếp tục */}
      <div
        className={`w-full max-w-xs mx-auto pb-6 transition-opacity duration-300 ${
          loading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <button
          onClick={handleContinue}
          disabled={roomCode.join('').length !== 6}
          className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold py-3 sm:py-4 rounded-xl text-base sm:text-lg transition"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
}
