'use client';

interface Props {
  onClose: () => void;
  onEditScore: () => void;
  onEditMembers: () => void;
}

export default function EditOption({ onClose, onEditScore, onEditMembers }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg text-center">
        <h2 className="text-xl font-bold text-[#000000] mb-6">
          Chọn loại chỉnh sửa
        </h2>

        <div className="space-y-4 mb-6">
          <div className="text-left">
            <p className="text-sm text-gray-600 mb-3">
              Bạn muốn chỉnh sửa gì trong trận đấu?
            </p>
            <div className="space-y-3">
              <button
                onClick={onEditScore}
                className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all hover:bg-blue-50"
              >
                <div className="text-center">
                  <div className="font-semibold text-[#000000]">Chỉnh sửa điểm</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Thay đổi tỉ số trận đấu
                  </div>
                </div>
              </button>

              <button
                onClick={onEditMembers}
                className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-green-300 transition-all hover:bg-green-50"
              >
                <div className="text-center">
                  <div className="font-semibold text-[#000000]">Chỉnh sửa thành viên</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Thêm/xóa người chơi trong đội
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="w-full bg-[#FF0000] hover:bg-red-500 text-[#FFFFFF] font-semibold py-3 rounded-xl text-sm sm:text-base"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
