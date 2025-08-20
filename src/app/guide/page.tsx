"use client";
import React, { useState, useEffect } from "react";
import { HeaderHome } from '@/components/shared/HeaderHome';
import { Footer } from '@/components/landing/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';

const ROLES = [
  { key: 'business', label: 'CHỦ DOANH NGHIỆP' },
  { key: 'manager', label: 'QUẢN LÝ' },
  { key: 'member', label: 'HỘI VIÊN' },
  { key: 'user', label: 'NGƯỜI DÙNG' },
];

const GUIDE_CONTENT: Record<string, React.ReactNode> = {
  business: (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#8ADB10] mb-2">
        Hướng Dẫn Sử Dụng Hệ Thống Scorelens - Vai Trò CHỦ DOANH NGHIỆP
      </h1>
      <section>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">Phần 1: Đăng Ký và Kích Hoạt Tài Khoản</h2>
        <p className="text-sm sm:text-base md:text-lg text-[#000000] mb-2">
          Là một Chủ Doanh Nghiệp, bạn sẽ trải qua quy trình đăng ký và xác thực để có thể quản lý hệ thống ScoreLens cho thương hiệu của mình.
        </p>
        <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base md:text-lg text-[#000000]">
          <li>
            <span className="font-semibold text-[#8ADB10]">Bước 1: Đăng Ký Tài Khoản</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Truy cập trang đăng ký dành cho Chủ Doanh Nghiệp</li>
              <li>Nhập email và tạo mật khẩu mạnh cho tài khoản</li>
              <li>Xác thực email bằng mã OTP được gửi đến hộp thư</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Bước 2: Bổ Sung Thông Tin Doanh Nghiệp</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Nhập thông tin thương hiệu: tên thương hiệu, website, CCCD, số điện thoại</li>
              <li>Thêm thông tin chi nhánh: tên chi nhánh, địa chỉ, số điện thoại</li>
              <li>Khai báo số lượng bàn chơi tại mỗi chi nhánh</li>
              <li>Upload logo thương hiệu (tùy chọn)</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Bước 3: Chờ Duyệt Từ Quản Trị Viên</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Sau khi hoàn tất, tài khoản sẽ ở trạng thái <span className="text-[#FF0000] font-semibold">"Chờ duyệt"</span></li>
              <li>Quản trị viên sẽ xem xét thông tin và phê duyệt tài khoản</li>
              <li>Bạn sẽ nhận được email thông báo khi tài khoản được duyệt</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Bước 4: Truy Cập Hệ Thống</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Sau khi được duyệt, đăng nhập bằng email và mật khẩu đã đăng ký</li>
              <li>Hệ thống sẽ yêu cầu đổi mật khẩu lần đầu để đảm bảo an toàn</li>
              <li>Bắt đầu quản lý hệ thống ScoreLens cho thương hiệu của bạn</li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">Phần 2: Bảng Điều Khiển và Quản Lý Tổng Quan</h2>
        <p className="text-sm sm:text-base md:text-lg text-[#000000] mb-2">
          Sau khi đăng nhập thành công, bạn sẽ được đưa đến <span className="text-[#8ADB10] font-semibold">Bảng điều khiển (Admin Dashboard)</span> - trung tâm điều hành của bạn.
        </p>
        <div className="bg-lime-50 border-l-4 border-lime-400 p-3 sm:p-4 rounded text-lime-800 text-sm sm:text-base md:text-lg mb-4">
          <span className="font-semibold">Thống Kê Nhanh:</span>
          <ul className="list-disc ml-4 sm:ml-6 mt-2">
            <li>Tổng số chi nhánh đang hoạt động</li>
            <li>Số lượng quản lý đang làm việc</li>
            <li>Trận đấu đang diễn ra tại các chi nhánh</li>
            <li>Phản hồi mới cần xử lý</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">Phần 3: Các Chức Năng Quản Lý Chính</h2>
        <ol className="list-decimal ml-4 sm:ml-6 space-y-4 text-sm sm:text-base md:text-lg text-[#000000]">
          <li>
            <span className="font-semibold text-[#8ADB10]">Quản Lý Thông Tin Thương Hiệu</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Xem và chỉnh sửa thông tin thương hiệu: tên, website, CCCD, số điện thoại</li>
              <li>Quản lý logo thương hiệu</li>
              <li>Xem danh sách tất cả chi nhánh thuộc thương hiệu</li>
              <li>Thêm chi nhánh mới khi cần mở rộng</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Quản Lý Tài Khoản Quản Lý (Manager)</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Xem danh sách tất cả quản lý đang làm việc</li>
              <li>Thêm quản lý mới: Nhập thông tin cá nhân, email, số điện thoại</li>
              <li>Gán quản lý cho chi nhánh cụ thể</li>
              <li>Kích hoạt/vô hiệu hóa tài khoản quản lý</li>
              <li>Tìm kiếm và lọc quản lý theo chi nhánh, trạng thái</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Quản Lý Phản Hồi và Hỗ Trợ</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Xem tất cả phản hồi từ người dùng và quản lý</li>
              <li>Lọc phản hồi theo trạng thái: Chờ xử lý, đang xử lý, đã hoàn thành</li>
              <li>Lọc theo chi nhánh và khoảng thời gian</li>
              <li>Tìm kiếm phản hồi theo từ khóa</li>
              <li>Cập nhật trạng thái và phản hồi cho người gửi</li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">Phần 4: Các Chức Năng Bổ Sung</h2>
        <ul className="list-disc ml-4 sm:ml-6 text-sm sm:text-base md:text-lg text-[#000000]">
          <li><span className="font-semibold">Quản lý hồ sơ cá nhân:</span> Thay đổi thông tin cá nhân và mật khẩu</li>
          <li><span className="font-semibold">Xem báo cáo tổng quan:</span> Thống kê hoạt động của tất cả chi nhánh</li>
          <li><span className="font-semibold">Theo dõi hiệu suất:</span> Đánh giá hiệu quả hoạt động của các quản lý</li>
          <li><span className="font-semibold">Gửi thông báo:</span> Gửi thông báo quan trọng đến tất cả quản lý</li>
        </ul>
      </section>
    </div>
  ),
  manager: (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#8ADB10] mb-2">
        Hướng Dẫn Sử Dụng Hệ Thống ScoreLens - Vai Trò QUẢN LÝ
      </h1>

              <section>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">Phần 1: Kích Hoạt Tài Khoản Quản Lý</h2>
          <p className="text-sm sm:text-base md:text-lg text-[#000000] mb-2">
            Tài khoản của bạn được tạo và cấp quyền bởi <span className="text-[#8ADB10] font-semibold">Chủ Doanh Nghiệp</span>. Bạn sẽ nhận được thông tin đăng nhập qua email.
          </p>
          <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base md:text-lg text-[#000000]">
            <li>
              <span className="font-semibold text-[#8ADB10]">Nhận Thông Tin Tài Khoản</span>
              <ul className="list-disc ml-4 sm:ml-6">
                <li>Kiểm tra email để nhận thông tin đăng nhập từ Chủ Doanh Nghiệp</li>
                <li>Email sẽ chứa đường link đăng nhập và hướng dẫn chi tiết</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-[#8ADB10]">Đăng Nhập Bằng Email</span>
              <ul className="list-disc ml-4 sm:ml-6">
                <li>Truy cập đường link đăng nhập được cung cấp</li>
                <li>Nhập email đã được Chủ Doanh Nghiệp đăng ký</li>
                <li>Hệ thống sẽ gửi mã xác thực đến email của bạn</li>
                <li>Nhập mã xác thực để hoàn tất đăng nhập</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-[#8ADB10]">Đăng Nhập Lần Sau</span>
              <ul className="list-disc ml-4 sm:ml-6">
                <li>Chỉ cần nhập email đã đăng ký</li>
                <li>Hệ thống tự động gửi mã xác thực mới</li>
                <li>Nhập mã xác thực để truy cập hệ thống</li>
              </ul>
            </li>
          </ol>
        </section>

      <section>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">Phần 2: Bảng Điều Khiển Quản Lý</h2>
        <p className="text-sm sm:text-base md:text-lg text-[#000000] mb-2">
          Sau khi đăng nhập, bạn sẽ thấy <span className="text-[#8ADB10] font-semibold">Bảng điều khiển</span> - trung tâm điều hành của bạn tại câu lạc bộ.
        </p>
        <div className="bg-lime-50 border-l-4 border-lime-400 p-3 sm:p-4 rounded text-lime-800 text-sm sm:text-base md:text-lg mb-4">
          <span className="font-semibold">📊 Thống Kê Tổng Quan:</span>
          <ul className="list-disc ml-4 sm:ml-6 mt-2">
            <li><span className="font-semibold">Tổng số bàn:</span> Số lượng bàn chơi trong câu lạc bộ</li>
            <li><span className="font-semibold">Bàn đang sử dụng:</span> Số bàn hiện tại đang có trận đấu</li>
            <li><span className="font-semibold">Bàn trống:</span> Số bàn có thể sử dụng ngay</li>
            <li><span className="font-semibold">Tổng thành viên:</span> Số lượng hội viên đã đăng ký</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">Phần 3: Quản Lý Vận Hành Hàng Ngày</h2>
        <ol className="list-decimal ml-4 sm:ml-6 space-y-4 text-sm sm:text-base md:text-lg text-[#000000]">
          <li>
            <span className="font-semibold text-[#8ADB10]">Quản Lý Thiết Bị (Bàn chơi & Camera)</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Xem danh sách tất cả bàn chơi trong câu lạc bộ</li>
              <li>Thêm bàn mới: Nhập tên bàn, loại bàn (Pool 8, Pool 9, Snooker...)</li>
              <li>Quản lý camera: Gán camera cho từng bàn để theo dõi trận đấu</li>
              <li>Chỉnh sửa thông tin bàn: Cập nhật tên, loại, trạng thái bàn</li>
              <li>Lọc và tìm kiếm bàn: Theo loại, trạng thái, tên bàn</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Quản Lý Trận Đấu</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Theo dõi các trận đấu đang diễn ra trong thời gian thực</li>
              <li>Xem danh sách trận đấu theo bàn, thời gian, trạng thái</li>
              <li>Chỉnh sửa thông tin trận đấu khi cần thiết:
                <ul className="list-disc ml-4 sm:ml-6">
                  <li>Sửa lại điểm số bị Camera AI nhận diện sai</li>
                  <li>Cập nhật thông tin người chơi nếu bị nhầm lẫn</li>
                  <li>Kết thúc trận đấu thủ công nếu cần thiết</li>
                </ul>
              </li>
              <li>Xem lịch sử trận đấu đã kết thúc</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Quản Lý Hội Viên</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Xem danh sách tất cả hội viên đã đăng ký</li>
              <li>Thêm hội viên mới: Nhập thông tin cá nhân, số điện thoại, email</li>
              <li>Chỉnh sửa thông tin hội viên khi cần thiết</li>
              <li>Kích hoạt/vô hiệu hóa tài khoản hội viên</li>
              <li>Tìm kiếm hội viên theo tên, số điện thoại</li>
              <li>Xem lịch sử trận đấu của từng hội viên</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Quản Lý Phản Hồi</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Xem tất cả phản hồi từ người dùng trong câu lạc bộ</li>
              <li>Phản hồi và giải quyết các vấn đề được báo cáo</li>
              <li>Cập nhật trạng thái phản hồi để người gửi biết tiến trình</li>
              <li>Lọc phản hồi theo mức độ ưu tiên và trạng thái</li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">Phần 4: Các Chức Năng Bổ Sung</h2>
        <ul className="list-disc ml-4 sm:ml-6 text-sm sm:text-base md:text-lg text-[#000000]">
          <li><span className="font-semibold">Quản lý hồ sơ cá nhân:</span> Thay đổi thông tin cá nhân và mật khẩu</li>
          <li><span className="font-semibold">Xem báo cáo hoạt động:</span> Thống kê về trận đấu, hội viên, doanh thu</li>
          <li><span className="font-semibold">Gửi thông báo:</span> Gửi thông báo quan trọng đến hội viên</li>
          <li><span className="font-semibold">Gửi phản hồi:</span> Gửi phản hồi về hệ thống cho Chủ Doanh Nghiệp</li>
        </ul>
      </section>
    </div>
  ),
  member: (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#8ADB10] mb-2">
        Hướng Dẫn Sử Dụng Hệ Thống ScoreLens - Dành Cho HỘI VIÊN
      </h1>

      <section>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">Phần 1: Bắt Đầu Trận Đấu - Quét Mã QR</h2>
        <p className="text-sm sm:text-base md:text-lg text-[#000000] mb-2">
          Là hội viên, bạn có thể tạo và tham gia trận đấu một cách dễ dàng chỉ với vài thao tác đơn giản.
        </p>
        <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base md:text-lg text-[#000000]">
          <li>
            <span className="font-semibold text-[#8ADB10]">Bước 1: Đến Bàn Chơi</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Chọn bàn chơi bạn muốn sử dụng</li>
              <li>Đảm bảo bàn đang trống và sẵn sàng cho trận đấu</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Bước 2: Quét Mã QR</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Mở ứng dụng <span className="font-semibold">Camera</span> trên điện thoại</li>
              <li>Quét mã QR được đặt trên bàn chơi</li>
              <li>Trình duyệt sẽ tự động mở trang web ScoreLens</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Bước 3: Tạo Trận Đấu</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Nhập tên cho đội A và đội B</li>
              <li>Chọn loại bàn (Pool 8, Pool 9, Snooker...)</li>
              <li>Nhấn "Tạo trận đấu" để bắt đầu</li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">Phần 2: Quản Lý Trận Đấu - Quyền Chủ Phòng</h2>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded text-blue-800 text-sm sm:text-base md:text-lg mb-4">
          <span className="font-semibold">🎯 Lưu Ý Quan Trọng:</span> Chỉ <span className="font-semibold">Chủ phòng</span> (người tạo trận đấu) mới có quyền thực hiện các thao tác quản lý.
        </div>
        <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base md:text-lg text-[#000000]">
          <li>
            <span className="font-semibold text-[#8ADB10]">Theo Dõi Điểm Số Trực Tiếp</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Điểm số được cập nhật <span className="font-semibold">tự động</span> thông qua AI Camera</li>
              <li>Xem tỷ số thời gian thực trên màn hình</li>
              <li>Không cần nhập điểm thủ công</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Chỉnh Sửa Điểm Số (Chủ phòng)</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Nếu AI nhận diện sai, chủ phòng có thể chỉnh sửa điểm</li>
              <li>Nhấn nút "Chỉnh sửa" để điều chỉnh điểm cho từng đội</li>
              <li>Lưu lại để cập nhật tỷ số chính xác</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Quản Lý Thành Viên (Chủ phòng)</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Thêm thành viên mới vào đội</li>
              <li>Xóa thành viên khỏi đội nếu cần</li>
              <li>Chỉnh sửa tên thành viên</li>
              <li>Phân chia thành viên giữa đội A và đội B</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Tham Gia Trận Đấu (Thành viên khác)</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Quét mã QR trên bàn để tham gia trận đấu đang diễn ra</li>
              <li>Nhập mã phòng được chủ phòng cung cấp</li>
              <li>Xem điểm số trực tiếp nhưng không thể chỉnh sửa</li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">Phần 3: Kết Thúc và Đánh Giá</h2>
        <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base md:text-lg text-[#000000]">
          <li>
            <span className="font-semibold text-[#8ADB10]">Kết Thúc Trận Đấu (Chủ phòng)</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Nhấn nút "Kết thúc" khi trận đấu hoàn thành</li>
              <li>Xem kết quả cuối cùng và người chiến thắng</li>
              <li>Trận đấu sẽ được lưu vào lịch sử</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Đánh Giá Trận Đấu</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Tất cả người chơi có thể đánh giá trận đấu</li>
              <li>Viết nhận xét về trải nghiệm chơi</li>
              <li>Gửi phản hồi để cải thiện dịch vụ</li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">Phần 4: Lợi Ích Dành Cho Hội Viên</h2>
        <div className="bg-green-50 border-l-4 border-green-400 p-3 sm:p-4 rounded text-green-800 text-sm sm:text-base md:text-lg">
          <span className="font-semibold">✨ Đặc Quyền Hội Viên:</span>
          <ul className="list-disc ml-4 sm:ml-6 mt-2">
            <li>Lưu trữ vĩnh viễn tất cả trận đấu đã tham gia</li>
            <li>Xem lịch sử trận đấu chi tiết</li>
            <li>Theo dõi thống kê cá nhân và tiến độ</li>
            <li>Tạo trận đấu riêng mà không cần hỗ trợ</li>
            <li>Nhận thông báo về các sự kiện đặc biệt</li>
          </ul>
        </div>
      </section>
    </div>
  ),
  user: (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#8ADB10] mb-2">
        Hướng Dẫn Sử Dụng Hệ Thống ScoreLens - Dành Cho NGƯỜI DÙNG
      </h1>

      <section>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">Phần 1: Bắt Đầu Nhanh Chóng - Chỉ 3 Bước</h2>
        <p className="text-sm sm:text-base md:text-lg text-[#000000] mb-2">
          Bạn có thể sử dụng hệ thống ScoreLens ngay lập tức mà không cần đăng ký tài khoản. Chỉ cần làm theo 3 bước đơn giản sau:
        </p>
        <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base md:text-lg text-[#000000]">
          <li>
            <span className="font-semibold text-[#8ADB10]">Bước 1: Mở Camera Điện Thoại</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Sử dụng ứng dụng <span className="font-semibold">Camera gốc</span> trên điện thoại</li>
              <li>Hoạt động trên cả iPhone và Android</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Bước 2: Quét Mã QR</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Đưa camera về phía <span className="font-semibold">mã QR</span> trên bàn chơi</li>
              <li>Mã QR được đặt ngay trên bàn để dễ dàng quét</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Bước 3: Tự Động Mở Trang Web</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Trình duyệt sẽ tự động mở trang web ScoreLens</li>
              <li>Hiển thị thông tin bàn chơi và sẵn sàng sử dụng</li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">Phần 2: Sử Dụng Trang Web Trong Trận Đấu</h2>
        <ol className="list-decimal ml-4 sm:ml-6 space-y-2 text-sm sm:text-base md:text-lg text-[#000000]">
          <li>
            <span className="font-semibold text-[#8ADB10]">Nhập Thông Tin Ban Đầu</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Nhập tên hoặc biệt danh cho đội A và đội B</li>
              <li>Chọn loại bàn chơi (Pool 8, Pool 9, Snooker...)</li>
              <li>Nhấn "Bắt đầu" để khởi tạo trận đấu</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Theo Dõi Điểm Số Trực Tiếp</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Điểm số được cập nhật <span className="font-semibold">tự động</span> trong thời gian thực</li>
              <li>Không cần nhập điểm thủ công</li>
              <li>Có thể liếc nhìn điện thoại bất cứ lúc nào để xem tỷ số</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Chỉnh Sửa Điểm (Nếu Cần)</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Nếu AI nhận diện sai điểm, có thể chỉnh sửa</li>
              <li>Nhấn nút "Chỉnh sửa" để điều chỉnh điểm số</li>
              <li>Lưu lại để cập nhật tỷ số chính xác</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-[#8ADB10]">Kết Thúc Trận Đấu</span>
            <ul className="list-disc ml-4 sm:ml-6">
              <li>Nhấn nút "Kết thúc" khi trận đấu hoàn thành</li>
              <li>Xem kết quả cuối cùng và người chiến thắng</li>
              <li>Đánh giá trận đấu (tùy chọn)</li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">Phần 3: Lưu Ý Quan Trọng</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded text-yellow-800 text-sm sm:text-base md:text-lg">
          <span className="font-semibold">⚠️ Lưu Ý Cực Kỳ Quan Trọng:</span><br />
          Vì bạn đang sử dụng web app với tư cách khách, dữ liệu trận đấu này chỉ là <span className="font-semibold">tạm thời</span>.<br />
          Nếu bạn <span className="underline">đóng tab trình duyệt hoặc thoát ra</span>, thông tin về trận đấu này sẽ <span className="text-[#FF0000] font-bold">mất vĩnh viễn</span> và bạn sẽ không thể xem lại được.
        </div>
      </section>

      <section>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#000000] mb-2">Phần 4: Nâng Cấp Lên Hội Viên</h2>
        <p className="text-sm sm:text-base md:text-lg text-[#000000] mb-2">
          Bạn có muốn lưu lại mọi trận đấu để xem lại thành tích và sự tiến bộ của mình không? Hãy đăng ký làm <span className="text-[#8ADB10] font-semibold">Hội viên</span> của câu lạc bộ!
        </p>
        <div className="bg-lime-50 border-l-4 border-lime-400 p-3 sm:p-4 rounded text-lime-800 text-sm sm:text-base md:text-lg">
          <span className="font-semibold">🎁 Lợi Ích Khi Trở Thành Hội Viên:</span>
          <ul className="list-disc ml-4 sm:ml-6 mt-2">
            <li>Lưu trữ vĩnh viễn tất cả trận đấu đã tham gia</li>
            <li>Xem lịch sử trận đấu chi tiết</li>
            <li>Theo dõi thống kê cá nhân và tiến độ</li>
            <li>Tạo trận đấu riêng mà không cần hỗ trợ</li>
            <li>Nhận thông báo về các sự kiện đặc biệt</li>
            <li>Liên hệ Quản lý câu lạc bộ để đăng ký làm hội viên</li>
          </ul>
        </div>
      </section>
    </div>
  ),
};

export default function GuidePage() {
  const [role, setRole] = useState<'business' | 'manager' | 'member' | 'user'>('business');
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
      <div id="main-content" className="bg-white text-[#000000] min-h-screen pt-16 sm:pt-24">
        <div className="container mx-auto flex flex-col lg:flex-row gap-4 sm:gap-8 px-4 pb-16">
          <aside className="w-full lg:w-64 flex-shrink-0 mb-6 lg:mb-0 z-10">
            <nav className="bg-[#000000] rounded-xl shadow p-3 sm:p-4 text-[#FFFFFF] sticky top-20 sm:top-28 z-10">
              <ul className="space-y-2">
                {ROLES.map(r => (
                  <li key={r.key}>
                    <button
                      className={`w-full text-left px-3 sm:px-4 py-2 rounded-lg font-bold transition-colors text-sm sm:text-base ${role === r.key ? 'bg-[#8ADB10] text-[#FFFFFF]' : 'text-[#FFFFFF] hover:bg-lime-100 hover:text-[#000000]'}`}
                      onClick={() => setRole(r.key as 'business' | 'manager' | 'member' | 'user')}
                    >
                      {r.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <main className="flex-1 bg-white rounded-xl shadow p-4 sm:p-6 lg:p-8 text-[#000000] min-h-[600px] z-10">
            {GUIDE_CONTENT[role]}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
} 