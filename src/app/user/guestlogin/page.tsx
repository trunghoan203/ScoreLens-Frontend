'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import HeaderUser from '@/components/user/HeaderUser';
import FooterButton from '@/components/user/FooterButton';
import Image from 'next/image';
import { userMatchService } from '@/lib/userMatchService';
import toast from 'react-hot-toast';

function GuestLoginContent() {
  const [roomCode, setRoomCode] = useState<string[]>(['', '', '', '', '', '']);
  const [tableNumber, setTableNumber] = useState('');
  const [tableId, setTableId] = useState('');
  const [tableName, setTableName] = useState('');
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [matchId, setMatchId] = useState('');
  const [loading, setLoading] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
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
    const room = searchParams?.get('room');
    const table = searchParams?.get('table');
    const tId = searchParams?.get('tableId');
    const mId = searchParams?.get('matchId');
    
    if (room) setRoomCode(room.slice(0, 6).split(''));
    if (table) setTableNumber(table);
    if (tId) setTableId(tId);
    if (mId) setMatchId(mId);

    if (!table) setTableNumber('??');
    if (!tId) setTableId('TB-1754380493077');

    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    const autoVerifyTable = async () => {
      if (tableId) {
        try {
          const result = await userMatchService.verifyTable({ tableId });
          
          const resultData = result as Record<string, any>;
          const responseData = resultData?.data || resultData;
          setTableInfo(responseData);
          
          if (responseData?.tableName) {
            setTableName(responseData.tableName);
          } else if (responseData?.name) {
            setTableName(responseData.name);
          }
          
          toast.success('Chào mừng bạn đến với ScoreLens');
        } catch (error) {
          console.warn('Table verification failed:', error);
        }
      }
    };

    if (tableId) {
      autoVerifyTable();
    }
  }, [tableId]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '');
    if (digit === '0') return;

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

  const handleContinue = async () => {
    const code = roomCode.join('');
    if (code.length < 6) return;
    
    try {
      const matchData = await userMatchService.getMatchByCode(code);
      const responseData = (matchData as any)?.data || matchData;
      
      if (responseData && responseData.matchId) {
        const params = new URLSearchParams({ table: tableName || tableNumber || '??' });
        if (code) params.set('room', code);
        if (responseData.matchId) params.set('matchId', responseData.matchId);
        if (tableId) params.set('tableId', tableId);
        
        toast.success('Mã phòng hợp lệ!');
        router.push(`/user/guest?${params.toString()}`);
      } else {
        toast.error('Mã phòng không hợp lệ!');
      }
    } catch (error) {
      toast.error('Mã phòng không tồn tại hoặc đã bị hủy!');
    }
  };

  if (loading) return <ScoreLensLoading text="Đang tải..." />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 pt-20">
      <HeaderUser showBack={true} />

      <main className="flex-1 flex flex-col px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            {tableName ? `${tableName}` : `${tableNumber || '??'}`} - {tableInfo?.category ? tableInfo.category.toUpperCase() : (tableId ? 'Đang tải...' : 'Pool 8 Ball')}
          </h1>
          <p className="text-base sm:text-lg text-black font-medium">
            Hãy nhập mã phòng để tiếp tục
          </p>
        </div>

        <div className="flex-1 flex justify-center mt-25">
          <div className="w-full max-w-sm space-y-4">
            <div className="flex gap-2 justify-center">
              {roomCode.map((digit, index) => (
                <div
                  key={index}
                  className={`relative w-12 aspect-square flex items-center justify-center rounded-full border-2 transition-all duration-200 bg-white shadow-md cursor-pointer
                    ${focusedIndex === index
                      ? 'border-lime-500 shadow-lg'
                      : digit
                      ? 'border-lime-400'
                      : 'border-gray-300'}`}
                  onClick={() => inputRefs.current[index]?.focus()}
                >
                  <input
                    type="text"
                    maxLength={1}
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex((prev) => (prev === index ? null : prev))}
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
      </main>

      <FooterButton>
        <button
          onClick={handleContinue}
          disabled={roomCode.join('').length !== 6}
          className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold py-3 rounded-xl text-base sm:text-base transition"
        >
          Tiếp tục
        </button>
      </FooterButton>
    </div>
  );
}

export default function GuestLoginPage() {
  return (
    <Suspense fallback={<ScoreLensLoading text="Đang tải..." />}>
      <GuestLoginContent />
    </Suspense>
  );
}
