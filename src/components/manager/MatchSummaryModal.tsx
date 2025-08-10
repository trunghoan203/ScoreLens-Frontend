import React from 'react';

interface MatchSummaryModalProps {
  open: boolean;
  matchData: {
    matchId: string;
    tableName: string;
    gameType: string;
    startTime?: Date;
    endTime?: Date;
    teams: Array<{
      teamName: string;
      score: number;
      isWinner: boolean;
      members: Array<{
        guestName?: string;
        membershipName?: string;
      }>;
    }>;
  } | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const MatchSummaryModal: React.FC<MatchSummaryModalProps> = ({
  open,
  matchData,
  onConfirm,
  onCancel,
}) => {
  if (!open || !matchData) return null;

  const formatDuration = (startTime?: Date, endTime?: Date) => {
    if (!startTime || !endTime) return '00:00:00';
    
    const diff = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (date?: Date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const winningTeam = matchData.teams.find(team => team.isWinner);
  const duration = formatDuration(matchData.startTime, matchData.endTime);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-2xl mx-4 transform animate-scale-in">
                 <div className="text-center mb-6">
           <h2 className="text-3xl font-bold text-[#000000] mb-2">Tổng kết trận đấu</h2>
           <p className="text-[#000000]">{matchData.tableName}</p>
         </div>

                 <div className="bg-gray-50 rounded-lg p-4 mb-6">
           <h3 className="font-semibold text-lg mb-3 text-[#000000]">Thông tin trận đấu</h3>
           <div className="space-y-2 text-sm">
             <div className="flex justify-between">
               <span className="text-[#000000]">Mã trận:</span>
               <span className="font-medium text-[#000000]">{matchData.matchId}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-[#000000]">Loại game:</span>
               <span className="font-medium capitalize text-[#000000]">{matchData.gameType}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-[#000000]">Bắt đầu:</span>
               <span className="font-medium text-[#000000]">{formatDateTime(matchData.startTime)}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-[#000000]">Kết thúc:</span>
               <span className="font-medium text-[#000000]">{formatDateTime(matchData.endTime)}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-[#000000]">Thời gian chơi:</span>
               <span className="font-medium font-mono text-lg text-[#000000]">{duration}</span>
             </div>
           </div>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                     {matchData.teams.map((team, index) => (
             <div key={index} className="bg-gray-50 rounded-lg p-4">
               <h3 className="font-semibold text-lg mb-3 text-[#000000]">
                 {team.teamName}
                 {team.isWinner && <span className="ml-2 text-lime-600">🏆</span>}
               </h3>
               <div className={`p-3 rounded-lg ${team.isWinner ? 'bg-lime-100 border-lime-300' : 'bg-gray-100'}`}>
                 <div className="text-center mb-3">
                   <span className={`text-4xl font-bold ${team.isWinner ? 'text-lime-600' : 'text-[#000000]'}`}>
                     {team.score}
                   </span>
                 </div>
                 <div className="text-sm text-[#000000]">
                   <div className="font-medium mb-2">Thành viên:</div>
                   {team.members.map((member, memberIndex) => (
                     <div key={memberIndex} className="truncate mb-1">
                       {member.guestName || member.membershipName || 'Unknown'}
                     </div>
                   ))}
                 </div>
               </div>
             </div>
           ))}
        </div>

         {winningTeam && (
           <div className="text-center mb-6 p-4 bg-lime-50 rounded-lg border border-lime-200">
             <div className="text-2xl mb-2">🎉</div>
             <div className="text-xl font-bold text-[#000000] mb-1">
               {winningTeam.teamName} chiến thắng!
             </div>
             <div className="text-[#000000]">
               Điểm số: {winningTeam.score} - {matchData.teams.find(t => !t.isWinner)?.score || 0}
             </div>
           </div>
         )}

        <div className="flex gap-4 justify-center">
          <button
            type="button"
            className="w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 rounded-lg transition text-lg"
            onClick={onCancel}
          >
            Quay lại
          </button>
          <button
            type="button"
            className="w-40 bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 rounded-lg transition text-lg"
            onClick={onConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};
