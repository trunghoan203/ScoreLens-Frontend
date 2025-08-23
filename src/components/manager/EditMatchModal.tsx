import React from 'react';

interface EditMatchModalProps {
  open: boolean;
  onEditMembers: () => void;
  onEditScores: () => void;
  onCancel: () => void;
}

export const EditMatchModal: React.FC<EditMatchModalProps> = ({
  open,
  onEditMembers,
  onEditScores,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md mx-4 transform animate-scale-in">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#000000] mb-2">Chỉnh sửa trận đấu</h2>
          <p className="text-[#000000]">Chọn loại chỉnh sửa bạn muốn thực hiện</p>
        </div>

        <div className="space-y-4 mb-8">
          <button
            type="button"
            className="w-full bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg"
            onClick={onEditMembers}
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span>Chỉnh sửa thành viên</span>
            </div>
          </button>

          <button
            type="button"
            className="w-full bg-lime-400 hover:bg-lime-500 text-white font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg"
            onClick={onEditScores}
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Chỉnh sửa điểm số</span>
            </div>
          </button>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            className="w-full sm:w-32 lg:w-40 border border-lime-400 text-lime-500 bg-white hover:bg-lime-50 font-bold py-2 sm:py-2.5 rounded-lg transition text-sm sm:text-base lg:text-lg"
            onClick={onCancel}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};
