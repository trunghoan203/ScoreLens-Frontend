'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';
import HeaderUser from '@/components/user/HeaderUser';
import { Button } from '@/components/ui/button';
import { Clock, Users } from 'lucide-react';
import { userMatchService } from '@/lib/userMatchService';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import toast from 'react-hot-toast';


export default function EndMatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  const matchId = searchParams?.get('matchId') || '';
  const tableName = searchParams?.get('tableName') || 'Bàn';
  const matchCode = searchParams?.get('matchCode') || '';
  const scoreA = parseInt(searchParams?.get('scoreA') || '0');
  const scoreB = parseInt(searchParams?.get('scoreB') || '0');
  const teamA = searchParams?.get('teamA')?.split(',').filter(name => name.trim()) || [];
  const teamB = searchParams?.get('teamB')?.split(',').filter(name => name.trim()) || [];
  const tableId = searchParams?.get('tableId') || '';

  const [matchInfo, setMatchInfo] = useState<any>(null);
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  
  const [actualScoreA, setActualScoreA] = useState<number>(scoreA);
  const [actualScoreB, setActualScoreB] = useState<number>(scoreB);
  const [actualTeamA, setActualTeamA] = useState<string[]>(teamA);
  const [actualTeamB, setActualTeamB] = useState<string[]>(teamB);
  const [actualTableName, setActualTableName] = useState<string>(tableName);
  const [actualMatchCode, setActualMatchCode] = useState<string>(matchCode);

  const winner = actualScoreA > actualScoreB ? 'Team A' : actualScoreB > actualScoreA ? 'Team B' : 'Hoà';

  const { isConnected } = useWebSocket({
    matchId: matchId || null,
    matchStatus: 'completed',
    onTimeUpdate: (elapsedTime: string) => {
      setElapsedTime(elapsedTime);
    },
    onMatchUpdate: (updatedMatch: any) => {
      const matchData = updatedMatch as any;
      if (matchData?.matchId === matchId) {
        setMatchInfo((prev: any) => ({ ...prev, ...matchData }));
      }
    },
    onMatchEnded: (matchData: any) => {
      if (matchData && matchData.matchId === matchId) {
        toast.success('Trận đấu đã kết thúc!');
      }
    }
  });

  useEffect(() => {
    const loadMatchData = async () => {
      if (matchId) {
        try {
          const matchData = await userMatchService.getMatchById(matchId);
          const responseData = (matchData as any)?.data || matchData;
          
          setMatchInfo(responseData);
          
          if (responseData?.teams && Array.isArray(responseData.teams)) {
            const teamAScore = responseData.teams[0]?.score || 0;
            const teamBScore = responseData.teams[1]?.score || 0;
            setActualScoreA(teamAScore);
            setActualScoreB(teamBScore);
            
            const teamAMembers = responseData.teams[0]?.members?.map((member: any) => 
              member.membershipName || member.guestName || ''
            ).filter((name: string) => name.trim()) || [];
            const teamBMembers = responseData.teams[1]?.members?.map((member: any) => 
              member.membershipName || member.guestName || ''
            ).filter((name: string) => name.trim()) || [];
            
            setActualTeamA(teamAMembers);
            setActualTeamB(teamBMembers);
          }
          
          if (responseData?.matchCode) {
            setActualMatchCode(responseData.matchCode);
          }
          
          if (responseData?.startTime && responseData?.endTime) {
            const startTime = new Date(responseData.startTime);
            const endTime = new Date(responseData.endTime);
            const diffMs = endTime.getTime() - startTime.getTime();
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            setElapsedTime(timeString);
          }
          
          if (responseData?.tableId) {
            try {
              const tableData = await userMatchService.verifyTable({ tableId: responseData.tableId });
              const tableResponseData = (tableData as any)?.data || tableData;
              setTableInfo(tableResponseData);
              
              if (tableResponseData?.name) {
                setActualTableName(tableResponseData.name);
              }
            } catch (tableError) {
              console.error('Error loading table info:', tableError);
            }
          }
        } catch (error) {
          console.error('Error loading match data:', error);
        }
      }
      
      setTimeout(() => setLoading(false), 800);
    };
    
    loadMatchData();
  }, [matchId]);

  const handleRate = () => {
    const params = new URLSearchParams({
      matchId,
      tableName,
      matchCode,
      scoreA: scoreA.toString(),
      scoreB: scoreB.toString(),
      teamA: teamA.join(','),
      teamB: teamB.join(','),
      tableId
    });
    router.push(`/user/rate?${params.toString()}`);
  };
  
  const handlePayment = () => {
    const params = new URLSearchParams({
      matchId,
      tableName,
      matchCode,
      scoreA: scoreA.toString(),
      scoreB: scoreB.toString(),
      teamA: teamA.join(','),
      teamB: teamB.join(','),
      tableId
    });
    router.push(`/user/thanh-toan?${params.toString()}`);
  };

  if (loading) return <ScoreLensLoading text="Đang tải..." />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 pt-20">
      <HeaderUser />
            
      <main className="flex-1 flex flex-col px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#000000]">
            {actualTableName || tableInfo?.name || tableName} - {tableInfo?.category ? tableInfo.category.toUpperCase() : (matchInfo?.gameType === 'pool-8' ? 'Pool 8 Ball' : matchInfo?.gameType || 'Pool 8 Ball')}
          </h1>
          <p className="text-sm sm:text-base text-[#000000] font-medium">BẢNG ĐIỂM</p>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-4xl space-y-6">
            <div className="bg-[#8ADB10] text-[#FFFFFF] rounded-2xl px-8 py-8 space-y-2 shadow-md w-full">
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-[#FFFFFF] mb-2">Mã Tham Gia</p>
                <div className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 mx-auto inline-block">
                                  <div className="flex items-center justify-center gap-2 select-all">
                  {(actualMatchCode || '000000').split('').map((ch, idx) => (
                    <span
                      key={idx}
                      className="w-5 sm:w-6 text-center font-mono tabular-nums font-extrabold text-xl sm:text-2xl text-[#FFFFFF] leading-none"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="text-center flex flex-col items-center w-20">
                  <p className="text-sm font-semibold">Team A</p>
                  <div className="w-10 h-10 bg-white/20 rounded-full mt-1" />
                  {actualTeamA.length > 0 && (
                    <div className="text-xs mt-1 text-center space-y-1">
                      {actualTeamA.map((member, index) => (
                        <p key={index} className="text-xs text-[#FFFFFF]">{member || `Người Chơi ${index + 1}`}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-center flex flex-col items-center mt-10">
                  <div className="text-3xl font-bold text-[#FFFFFF]">{actualScoreA} : {actualScoreB}</div>
                  <div className="text-lg font-semibold mt-2">
                    <div className="text-base font-bold text-yellow-300">{elapsedTime}</div>
                  </div>
                </div>

                <div className="text-center flex flex-col items-center w-20">
                  <p className="text-sm font-semibold">Team B</p>
                  <div className="w-10 h-10 bg-white/20 rounded-full mt-1" />
                  {actualTeamB.length > 0 && (
                    <div className="text-xs mt-1 text-center space-y-1">
                      {actualTeamB.map((member, index) => (
                        <p key={index} className="text-xs text-[#FFFFFF]">{member || `Người Chơi ${index + 1}`}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#000000]">Thông tin trận đấu</h2>
                    <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                      <Users size={16} className="text-lime-600" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Thời gian chơi:</span>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-lime-600" />
                        <span className="text-sm font-medium text-[#000000]">{elapsedTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Số người chơi:</span>
                      <span className="text-sm font-medium text-[#000000]">
                        {actualTeamA.length + actualTeamB.length} người
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Loại game:</span>
                      <span className="text-sm font-medium text-[#000000]">
                        {tableInfo?.category ? tableInfo.category.toUpperCase() : (matchInfo?.gameType === 'pool-8' ? 'Pool 8 Ball' : matchInfo?.gameType || 'Pool 8 Ball')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Đội chiến thắng:</span>
                      <span className="text-sm font-medium text-[#8ADB10] font-bold">
                        {winner !== 'Hoà' ? winner : 'Hoà'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center py-6">
              <p className="text-[#000000] text-base sm:text-lg font-medium leading-relaxed">
                Cảm ơn bạn đã sử dụng <br />
                <span className="font-bold text-xl text-[#8ADB10]">ScoreLens!</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50">
        <div className="flex flex-row gap-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
          <Button
            onClick={handleRate}
            style={{ backgroundColor: '#FF0000' }}
            className="w-1/2 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center hover:opacity-90"
          >
            Đánh giá
          </Button>
          <Button
            onClick={handlePayment}
            style={{ backgroundColor: '#8ADB10' }}
            className="w-1/2 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base flex items-center justify-center hover:opacity-90"
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
}
