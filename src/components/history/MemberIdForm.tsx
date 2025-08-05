interface MemberIdFormProps {
    memberId: string;
    setMemberId: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function MemberIdForm({ memberId, setMemberId, onSubmit }: MemberIdFormProps) {
    return (
        <>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 text-black text-center">
                TRA CỨU LỊCH SỬ ĐẤU
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 text-center shadow-lg">
                    <div className="text-3xl font-bold mb-2">1,250</div>
                    <div className="text-sm opacity-90">Tổng số hội viên</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 text-center shadow-lg">
                    <div className="text-3xl font-bold mb-2">3,847</div>
                    <div className="text-sm opacity-90">Tổng số trận đấu</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 text-center shadow-lg">
                    <div className="text-3xl font-bold mb-2">156</div>
                    <div className="text-sm opacity-90">Trận đấu hôm nay</div>
                </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-8 shadow-lg">
                <form onSubmit={onSubmit} className="w-full space-y-4">
                    <div>
                        <label htmlFor="memberId" className="block text-left text-sm font-medium text-black mb-2">
                            Mã Hội Viên
                        </label>
                        <input
                            id="memberId"
                            type="text"
                            value={memberId}
                            onChange={e => setMemberId(e.target.value)}
                            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                            placeholder="Nhập mã hội viên của bạn"
                        />
                    </div>
                    <p className="text-left text-xs text-red-600">
                        * Nếu chưa có mã Hội viên, hãy liên hệ với nhân viên để đăng ký!
                    </p>
                    <div className="pt-4 flex justify-center">
                        <button
                            type="submit"
                            className="w-full sm:w-1/2 bg-lime-400 hover:bg-lime-500 text-white font-semibold py-3 rounded-xl text-sm sm:text-base transition"
                        >
                            Xem lịch sử đấu
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
} 