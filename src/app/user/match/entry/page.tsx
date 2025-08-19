'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import HeaderUser from '@/components/user/HeaderUser';
import FooterButton from '@/components/user/FooterButton';
import Image from 'next/image';
import { userMatchService } from '@/lib/userMatchService';
import toast from 'react-hot-toast';
import RoleBadge from '@/components/ui/RoleBadge';
import { setIdentity, setSession } from '@/lib/session';

function GuestLoginContent() {
  const [roomCode, setRoomCode] = useState<string[]>(['', '', '', '', '', '']);
  const [tableNumber, setTableNumber] = useState('');
  const [tableId, setTableId] = useState('');
  const [tableName, setTableName] = useState('');
  const [tableInfo, setTableInfo] = useState<{
    tableName?: string;
    name?: string;
    category?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
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
    const sessionToken = searchParams?.get('sessionToken');

    if (room) setRoomCode(room.slice(0, 6).split(''));
    if (table) setTableNumber(table);
    if (tId) setTableId(tId);
    if (sessionToken) setSessionToken(sessionToken);

    if (!table) setTableNumber('??');
    if (!tId) setTableId('TB-1755160186911');

    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    const autoVerifyTable = async () => {
      if (tableId) {
        try {
          const result = await userMatchService.verifyTable({ tableId });

          const resultData = result as { data?: { tableName?: string; name?: string; category?: string } };
          const responseData = resultData?.data || resultData;
          const tableData = responseData as { tableName?: string; name?: string; category?: string };
          setTableInfo(tableData);

          if (tableData?.tableName) {
            setTableName(tableData.tableName);
          } else if (tableData?.name) {
            setTableName(tableData.name);
          }

          toast.success('Chào mừng bạn đến với ScoreLens');
        } catch {
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
        const newCode = [...roomCode];
        newCode[index - 1] = '';
        setRoomCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleContinue = async () => {
    const code = roomCode.join('');
    if (code.length !== 6) {
      toast.error('Vui lòng nhập đủ 6 chữ số!');
      return;
    }

    try {
      const matchInfo = await userMatchService.getMatchByCode(code);
      const responseData = matchInfo as { data?: { matchId?: string; id?: string } };
      const matchData = responseData?.data || matchInfo;
      const codeMatchId = matchData as { matchId?: string; id?: string };

      if (matchInfo && codeMatchId.matchId) {
        const params = new URLSearchParams({ table: tableName || tableNumber || '??' });
        if (code) params.set('room', code);
        if (codeMatchId.matchId) params.set('matchId', codeMatchId.matchId);
        if (tableId) params.set('tableId', tableId);
        
        if (sessionToken) {
          params.set('sessionToken', sessionToken);
        }

        toast.success('Mã phòng hợp lệ!');
        router.push(`/user/match/join?${params.toString()}`);
      } else {
        toast.error('Mã phòng không hợp lệ!');
      }
    } catch {
      toast.error('Mã phòng không tồn tại hoặc đã bị hủy!');
    }
  };

  if (loading) return <ScoreLensLoading text="Đang tải..." />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 pt-20">
      <HeaderUser showBack={true} />

      <main className="flex-1 flex flex-col px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#000000]">
            {(tableInfo?.name || tableName || 'BÀN').toUpperCase()} - {tableInfo?.category ? (tableInfo.category === 'pool-8' ? 'POOL 8' : ` ${tableInfo.category.toUpperCase()}`) : (tableId ? 'Đang tải...' : 'Pool 8 Ball')}
          </h1>
          <p className="text-base sm:text-lg text-[#000000] font-medium">
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
                      ? 'border-[#8ADB10] shadow-lg'
                      : digit
                        ? 'border-[#8ADB10]'
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
          style={{ backgroundColor: '#8ADB10' }}
          className="w-full hover:bg-lime-600 text-[#FFFFFF] font-semibold py-3 rounded-xl text-base sm:text-base transition"
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
