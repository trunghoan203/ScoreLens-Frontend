"use client";
import React, { useState, useEffect } from "react";
import { HeaderHome } from '@/components/shared/HeaderHome';
import { Footer } from '@/components/landing/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';

const TERMS_SECTIONS = [
    { key: 'general', label: 'ĐIỀU KHOẢN CHUNG' },
    { key: 'account', label: 'TÀI KHOẢN & BẢO MẬT' },
    { key: 'usage', label: 'SỬ DỤNG DỊCH VỤ' },
    { key: 'privacy', label: 'BẢO MẬT & RIÊNG TƯ' },
    { key: 'liability', label: 'TRÁCH NHIỆM & GIỚI HẠN' },
    { key: 'termination', label: 'CHẤM DỨT & THAY ĐỔI' },
];

const TERMS_CONTENT: Record<string, React.ReactNode> = {
    general: (
        <div className="space-y-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-lime-600 mb-2">
                Điều Khoản Sử Dụng - Điều Khoản Chung
            </h1>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">1. Chấp Nhận Điều Khoản</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Bằng việc truy cập và sử dụng hệ thống ScoreLens, bạn đồng ý tuân thủ và bị ràng buộc bởi những điều khoản và điều kiện này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
                </p>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">2. Mô Tả Dịch Vụ</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    ScoreLens là một hệ thống quản lý điểm số tự động cho các trò chơi thể thao, đặc biệt là bida. Hệ thống sử dụng công nghệ AI và camera để theo dõi và ghi điểm tự động, cung cấp trải nghiệm chơi game chính xác và tiện lợi.
                </p>
                <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                    <li>Ghi điểm tự động thông qua camera AI</li>
                    <li>Quản lý trận đấu và thành viên</li>
                    <li>Theo dõi lịch sử và thống kê trận đấu</li>
                    <li>Hệ thống thông báo và hỗ trợ</li>
                </ul>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">3. Độ Tuổi và Năng Lực</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Bạn phải đủ 18 tuổi hoặc có sự đồng ý của cha mẹ/người giám hộ hợp pháp để sử dụng dịch vụ. Bạn cũng phải có đủ năng lực pháp lý để tham gia vào các thỏa thuận này.
                </p>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">4. Thay Đổi Điều Khoản</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Chúng tôi có quyền thay đổi các điều khoản này vào bất kỳ lúc nào. Những thay đổi sẽ có hiệu lực ngay khi được đăng tải. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi được coi là chấp nhận các điều khoản mới.
                </p>
            </section>
        </div>
    ),

    account: (
        <div className="space-y-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-lime-600 mb-2">
                Điều Khoản Sử Dụng - Tài Khoản & Bảo Mật
            </h1>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">1. Đăng Ký Tài Khoản</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Để sử dụng đầy đủ các tính năng của hệ thống, bạn cần tạo tài khoản với thông tin chính xác và cập nhật. Bạn chịu trách nhiệm duy trì tính bảo mật của thông tin đăng nhập.
                </p>
                <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                    <li>Cung cấp thông tin chính xác và đầy đủ</li>
                    <li>Bảo vệ mật khẩu và thông tin đăng nhập</li>
                    <li>Không chia sẻ tài khoản với người khác</li>
                    <li>Thông báo ngay khi phát hiện vi phạm bảo mật</li>
                </ul>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">2. Xác Thực và Bảo Mật</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Hệ thống có thể yêu cầu xác thực qua email hoặc số điện thoại. Bạn đồng ý nhận các thông báo xác thực và bảo mật qua các kênh này.
                </p>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">3. Quyền Sở Hữu Tài Khoản</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Tài khoản được tạo ra là tài sản cá nhân của bạn. Tuy nhiên, chúng tôi có quyền đình chỉ hoặc chấm dứt tài khoản nếu vi phạm điều khoản sử dụng.
                </p>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">4. Bảo Mật Thông Tin</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo các tiêu chuẩn bảo mật cao nhất. Tuy nhiên, không có hệ thống nào là hoàn toàn an toàn, và bạn cũng cần thực hiện các biện pháp bảo mật cơ bản.
                </p>
            </section>
        </div>
    ),

    usage: (
        <div className="space-y-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-lime-600 mb-2">
                Điều Khoản Sử Dụng - Sử Dụng Dịch Vụ
            </h1>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">1. Sử Dụng Hợp Pháp</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Bạn chỉ được sử dụng dịch vụ cho các mục đích hợp pháp và phù hợp với các điều khoản này. Việc sử dụng dịch vụ để thực hiện các hoạt động bất hợp pháp hoặc có hại là nghiêm cấm.
                </p>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">2. Hành Vi Bị Cấm</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Các hành vi sau đây bị nghiêm cấm khi sử dụng dịch vụ:
                </p>
                <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                    <li>Gian lận hoặc cố ý làm sai lệch kết quả trận đấu</li>
                    <li>Quấy rối hoặc đe dọa người chơi khác</li>
                    <li>Sử dụng phần mềm hoặc công cụ bên ngoài để can thiệp vào hệ thống</li>
                    <li>Phát tán nội dung không phù hợp hoặc có hại</li>
                    <li>Vi phạm quyền sở hữu trí tuệ</li>
                </ul>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">3. Sử Dụng Hệ Thống Camera</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Hệ thống sử dụng camera AI để ghi điểm tự động. Bạn đồng ý:
                </p>
                <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                    <li>Cho phép camera ghi hình trong khu vực chơi game</li>
                    <li>Không cố ý che khuất hoặc làm nhiễu camera</li>
                    <li>Chấp nhận rằng việc ghi điểm có thể có sai số nhỏ</li>
                    <li>Báo cáo sự cố nếu phát hiện lỗi nghiêm trọng</li>
                </ul>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">4. Nội Dung Người Dùng</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Bạn chịu trách nhiệm về tất cả nội dung mà bạn tạo ra, đăng tải hoặc chia sẻ thông qua dịch vụ. Chúng tôi có quyền xóa bỏ nội dung vi phạm mà không cần thông báo trước.
                </p>
            </section>
        </div>
    ),

    privacy: (
        <div className="space-y-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-lime-600 mb-2">
                Điều Khoản Sử Dụng - Bảo Mật & Riêng Tư
            </h1>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">1. Thu Thập Thông Tin</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Chúng tôi thu thập các loại thông tin sau để cung cấp và cải thiện dịch vụ:
                </p>
                <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                    <li>Thông tin cá nhân: tên, email, số điện thoại</li>
                    <li>Thông tin tài khoản: tên đăng nhập, mật khẩu</li>
                    <li>Dữ liệu sử dụng: lịch sử trận đấu, thống kê</li>
                    <li>Dữ liệu kỹ thuật: địa chỉ IP, thiết bị, trình duyệt</li>
                </ul>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">2. Sử Dụng Thông Tin</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Thông tin thu thập được sử dụng để:
                </p>
                <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                    <li>Cung cấp và duy trì dịch vụ</li>
                    <li>Cải thiện trải nghiệm người dùng</li>
                    <li>Gửi thông báo và cập nhật</li>
                    <li>Xử lý yêu cầu hỗ trợ</li>
                    <li>Phân tích và nghiên cứu</li>
                </ul>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">3. Chia Sẻ Thông Tin</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba, trừ khi:
                </p>
                <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                    <li>Có sự đồng ý rõ ràng của bạn</li>
                    <li>Để tuân thủ yêu cầu pháp lý</li>
                    <li>Bảo vệ quyền và tài sản của chúng tôi</li>
                    <li>Với các đối tác tin cậy để cung cấp dịch vụ</li>
                </ul>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">4. Bảo Vệ Thông Tin</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Chúng tôi thực hiện các biện pháp bảo mật phù hợp để bảo vệ thông tin cá nhân của bạn khỏi truy cập trái phép, thay đổi, tiết lộ hoặc phá hủy.
                </p>
            </section>
        </div>
    ),

    liability: (
        <div className="space-y-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-lime-600 mb-2">
                Điều Khoản Sử Dụng - Trách Nhiệm & Giới Hạn
            </h1>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">1. Giới Hạn Trách Nhiệm</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Trong phạm vi tối đa được phép theo luật pháp, ScoreLens và các đối tác của chúng tôi sẽ không chịu trách nhiệm về:
                </p>
                <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                    <li>Thiệt hại gián tiếp, ngẫu nhiên hoặc hậu quả</li>
                    <li>Mất mát dữ liệu hoặc thông tin</li>
                    <li>Gián đoạn dịch vụ không mong muốn</li>
                    <li>Thiệt hại do sử dụng sai mục đích</li>
                </ul>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">2. Độ Chính Xác của Dịch Vụ</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Mặc dù chúng tôi nỗ lực cung cấp dịch vụ chính xác và đáng tin cậy, nhưng không thể đảm bảo rằng dịch vụ sẽ hoàn toàn không có lỗi hoặc gián đoạn. Bạn chấp nhận rủi ro khi sử dụng dịch vụ.
                </p>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">3. Trách Nhiệm của Người Dùng</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Bạn chịu trách nhiệm:
                </p>
                <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                    <li>Sử dụng dịch vụ một cách an toàn và hợp pháp</li>
                    <li>Bảo vệ thông tin tài khoản của mình</li>
                    <li>Không sử dụng dịch vụ để gây hại cho người khác</li>
                    <li>Tuân thủ tất cả các quy định và luật pháp hiện hành</li>
                </ul>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">4. Bồi Thường</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Bạn đồng ý bồi thường và giữ cho ScoreLens không bị thiệt hại từ bất kỳ khiếu nại, thiệt hại hoặc chi phí nào phát sinh từ việc vi phạm các điều khoản này.
                </p>
            </section>
        </div>
    ),

    termination: (
        <div className="space-y-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-lime-600 mb-2">
                Điều Khoản Sử Dụng - Chấm Dứt & Thay Đổi
            </h1>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">1. Chấm Dứt Dịch Vụ</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Chúng tôi có quyền chấm dứt hoặc đình chỉ quyền truy cập vào dịch vụ của bạn vào bất kỳ lúc nào, vì bất kỳ lý do gì, bao gồm nhưng không giới hạn ở việc vi phạm các điều khoản này.
                </p>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">2. Hậu Quả của Việc Chấm Dứt</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Khi dịch vụ bị chấm dứt:
                </p>
                <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                    <li>Quyền truy cập vào tài khoản sẽ bị thu hồi ngay lập tức</li>
                    <li>Tất cả dữ liệu và nội dung có thể bị xóa vĩnh viễn</li>
                    <li>Không có khoản hoàn tiền nào được cung cấp</li>
                    <li>Các điều khoản này vẫn có hiệu lực sau khi chấm dứt</li>
                </ul>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">3. Thay Đổi Dịch Vụ</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Chúng tôi có quyền thay đổi, đình chỉ hoặc chấm dứt dịch vụ vào bất kỳ lúc nào. Chúng tôi sẽ thông báo trước về những thay đổi quan trọng khi có thể.
                </p>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">4. Luật Áp Dụng</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Các điều khoản này được điều chỉnh và giải thích theo luật pháp Việt Nam. Bất kỳ tranh chấp nào phát sinh từ việc sử dụng dịch vụ sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.
                </p>
            </section>

            <section>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">5. Liên Hệ</h2>
                <p className="text-base md:text-lg text-gray-800 mb-2">
                    Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua:
                </p>
                <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
                    <li>Email: support@scorelens.com</li>
                    <li>Điện thoại: +84 xxx xxx xxx</li>
                    <li>Địa chỉ: [Địa chỉ công ty]</li>
                </ul>
            </section>
        </div>
    ),
};

export default function TermsPage() {
    const [section, setSection] = useState<'general' | 'account' | 'usage' | 'privacy' | 'liability' | 'termination'>('general');
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const el = document.getElementById('main-content');
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    return (
        <>
            {loading && <ScoreLensLoading text="Đang tải..." />}
            <HeaderHome />
            <HeroSection />
            <div id="main-content" className="bg-white text-black min-h-screen pt-24">
                <div className="container mx-auto flex flex-col md:flex-row gap-8 px-4 pb-16">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
                        <nav className="bg-white rounded-xl shadow p-4 text-black sticky top-28">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">ĐIỀU KHOẢN SỬ DỤNG</h3>
                            <ul className="space-y-2">
                                {TERMS_SECTIONS.map(s => (
                                    <li key={s.key}>
                                        <button
                                            className={`w-full text-left px-4 py-2 rounded-lg font-bold transition-colors text-sm ${section === s.key ? 'bg-lime-100 text-lime-600' : 'text-black hover:bg-gray-100'
                                                }`}
                                            onClick={() => setSection(s.key as 'general' | 'account' | 'usage' | 'privacy' | 'liability' | 'termination')}
                                        >
                                            {s.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 bg-white rounded-xl shadow p-8 text-black min-h-[600px]">
                        {TERMS_CONTENT[section]}
                    </main>
                </div>
            </div>
            <Footer />
        </>
    );
}
