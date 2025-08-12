'use client';

interface PopupAiSelectionProps {
  onClose: () => void;
  onConfirm: (isAiAssisted: boolean) => void;
  isAiAssisted: boolean;
  setIsAiAssisted: (value: boolean) => void;
  isCreating: boolean;
}

export default function PopupAiSelection({ 
  onClose, 
  onConfirm, 
  isAiAssisted, 
  setIsAiAssisted, 
  isCreating 
}: PopupAiSelectionProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg text-center">
        <h2 className="text-xl font-bold text-black mb-6">
          Chọn tính năng AI
        </h2>
        
        <div className="space-y-4 mb-6">
          <div className="text-left">
            <p className="text-sm text-gray-600 mb-3">
              Bạn có muốn sử dụng AI để bắt lỗi và phân tích trận đấu không?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setIsAiAssisted(true)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  isAiAssisted 
                    ? 'border-lime-500 bg-lime-50 text-lime-700' 
                    : 'border-gray-200 hover:border-lime-300'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-black">Có sử dụng AI</div>
                  <div className="text-sm text-gray-600 mt-1">
                    AI sẽ giúp bắt lỗi và phân tích trận đấu
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setIsAiAssisted(false)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  !isAiAssisted 
                    ? 'border-lime-500 bg-lime-50 text-lime-700' 
                    : 'border-gray-200 hover:border-lime-300'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-black">Không sử dụng AI</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Chỉ sử dụng tính năng cơ bản
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="w-full bg-[#FF0000] hover:bg-red-500 text-white font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm(isAiAssisted)}
            disabled={isCreating}
            className="w-full bg-[#8ADB10] hover:bg-lime-600 text-white font-semibold py-3 rounded-xl text-sm sm:text-base disabled:bg-gray-300"
          >
            {isCreating ? 'Đang tạo...' : 'Tạo trận đấu'}
          </button>
        </div>
      </div>
    </div>
  );
}
