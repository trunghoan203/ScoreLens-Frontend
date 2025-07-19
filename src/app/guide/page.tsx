"use client";
import React, { useState, useEffect } from "react";
import { HeaderHome } from '@/components/shared/HeaderHome';
import { Footer } from '@/components/landing/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { ScoreLensLoading } from '@/components/ui/ScoreLensLoading';

const ROLES = [
  { key: 'business', label: 'CHỦ DOANH NGHIỆP'},
  { key: 'manager', label: 'QUẢN LÝ' },
  { key: 'member', label: 'HỘI VIÊN' },
  { key: 'user', label: 'NGƯỜI DÙNG' },
];

const GUIDE_CONTENT: Record<string, React.ReactNode> = {
  business: (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-lime-600 mb-2">
        Hướng Dẫn Sử Dụng Hệ Thống Scorelens - Vai Trò CHỦ DOANH NGHIỆP
      </h1>
 
      {/* PHẦN 1 */}
      <section>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Phần 1: Đăng Ký và Truy Cập Hệ Thống</h2>
        <p className="text-base md:text-lg text-gray-800 mb-2">
          Là một Admin, bạn không tự đăng ký tài khoản. Tài khoản của bạn sẽ được tạo bởi <span className="text-lime-600 font-semibold">Super Admin</span>.
        </p>
        <ol className="list-decimal ml-6 space-y-2 text-base md:text-lg text-gray-800">
          <li>
            <span className="font-semibold text-lime-700">Nhận Thông Tin Tài Khoản:</span>
            <ul className="list-disc ml-6">
              <li>Tên đăng nhập (hoặc email)</li>
              <li>Mật khẩu tạm thời</li>
              <li>Đường link trang quản trị</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-lime-700">Đăng Nhập Lần Đầu:</span>
            <ul className="list-disc ml-6">
              <li>Truy cập vào đường link trang quản trị đã được cung cấp.</li>
              <li>Sử dụng tên đăng nhập và mật khẩu tạm thời để đăng nhập.</li>
              <li>Hệ thống sẽ yêu cầu bạn đổi mật khẩu ngay lập tức để đảm bảo an toàn. Hãy đặt một mật khẩu mới mạnh và chỉ riêng bạn biết.</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-lime-700">Quên Mật Khẩu:</span>
            <ul className="list-disc ml-6">
              <li>Vào trang đăng nhập và nhấn vào link &quot;Quên mật khẩu&quot; (Forgot Password).</li>
              <li>Nhập email, hệ thống sẽ gửi một đường link hoặc mã xác thực để đặt lại mật khẩu mới.</li>
            </ul>
          </li>
        </ol>
      </section>

      {/* PHẦN 2 */}
      <section>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Phần 2: Hướng Dẫn Sử Dụng Các Chức Năng Chính</h2>
        <p className="text-base md:text-lg text-gray-800 mb-2">
          Sau khi đăng nhập thành công, bạn sẽ được đưa đến <span className="text-lime-600 font-semibold">Bảng điều khiển (Admin Dashboard)</span>. Đây là trung tâm điều hành của bạn.
        </p>
        <ol className="list-decimal ml-6 space-y-4 text-base md:text-lg text-gray-800">
          <li>
            <span className="font-semibold text-lime-700">Bảng Điều Khiển (Admin Dashboard):</span>
            <ul className="list-disc ml-6">
              <li>Thống kê nhanh: Số lượng Câu lạc bộ (Clubs), số lượng Quản lý (Managers) bạn đang phụ trách.</li>
              <li>Trạng thái hoạt động: Số trận đấu đang diễn ra, các yêu cầu hỗ trợ mới.</li>
              <li>Lối tắt: Các nút truy cập nhanh đến các mục quản lý chính như &quot;Quản lý Câu lạc bộ&quot;, &quot;Quản lý Manager&quot;.</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-lime-700">Quản Lý Câu Lạc Bộ (Manage Clubs):</span>
            <ul className="list-disc ml-6">
              <li>Thêm mới, chỉnh sửa, giám sát các câu lạc bộ trong khu vực của bạn.</li>
              <li>Điền đầy đủ thông tin, chọn thương hiệu, tên, địa chỉ, liên hệ, nhấn &quot;Lưu&quot; để hoàn tất.</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-lime-700">Quản Lý Tài Khoản Manager (Manage Managers):</span>
            <ul className="list-disc ml-6">
              <li>Tạo, chỉnh sửa, vô hiệu hóa tài khoản Manager cho các câu lạc bộ bạn phụ trách.</li>
              <li>Gán Manager cho một hoặc nhiều Câu lạc bộ.</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-lime-700">Quản Lý Phản Hồi (Manage Feedback):</span>
            <ul className="list-disc ml-6">
              <li>Xem, xử lý các phản hồi từ người dùng hoặc Manager gửi lên.</li>
              <li>Cập nhật trạng thái phản hồi để người gửi biết tiến trình.</li>
            </ul>
          </li>
        </ol>
      </section>

      {/* PHẦN 3 */}
      <section>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Phần 3: Các Chức Năng Khác</h2>
        <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
          <li>Quản lý hồ sơ cá nhân (Profile): Thay đổi thông tin cá nhân và mật khẩu.</li>
          <li>Xem báo cáo: Truy cập các báo cáo về hoạt động của các câu lạc bộ trong khu vực.</li>
        </ul>
      </section>
    </div>
  ),
  manager: (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-lime-600 mb-2">
        Hướng Dẫn Sử Dụng Hệ Thống Scorelens - Vai Trò QUẢN LÝ
      </h1>

      {/* PHẦN 1 */}
      <section>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Phần 1: Truy Cập Hệ Thống</h2>
        <p className="text-base md:text-lg text-gray-800 mb-2">
          Tài khoản của bạn được tạo và cấp quyền bởi <span className="text-lime-600 font-semibold">Admin</span>. Bạn sẽ nhận được thông tin đăng nhập từ họ.
        </p>
        <ol className="list-decimal ml-6 space-y-2 text-base md:text-lg text-gray-800">
          <li>
            <span className="font-semibold text-lime-700">Đăng Nhập:</span>
            <ul className="list-disc ml-6">
              <li>Sử dụng <span className="font-semibold">email</span> và <span className="font-semibold">mật khẩu tạm thời</span> mà Admin đã cung cấp để đăng nhập vào hệ thống.</li>
              <li>Trong lần đăng nhập đầu tiên, hệ thống sẽ yêu cầu bạn đổi mật khẩu để đảm bảo bảo mật.</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-lime-700">Quên Mật Khẩu:</span>
            <ul className="list-disc ml-6">
              <li>Trên trang đăng nhập, sử dụng chức năng &quot;Quên mật khẩu&quot; (Forgot Password).</li>
              <li>Nhập email của bạn và làm theo hướng dẫn để đặt lại mật khẩu mới.</li>
            </ul>
          </li>
        </ol>
      </section>

      {/* PHẦN 2 */}
      <section>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Phần 2: Bảng Điều Khiển (Manager Dashboard)</h2>
        <p className="text-base md:text-lg text-gray-800 mb-2">
          Sau khi đăng nhập, bạn sẽ thấy <span className="text-lime-600 font-semibold">Bảng điều khiển</span>, đây là trung tâm điều hành của bạn tại câu lạc bộ. Nó cung cấp cái nhìn tổng quan về:
        </p>
        <ul className="list-disc ml-6 space-y-2 text-base md:text-lg text-gray-800">
          <li><span className="font-semibold">Số bàn đang hoạt động:</span> Biết được có bao nhiêu trận đấu đang diễn ra.</li>
          <li><span className="font-semibold">Trạng thái Camera:</span> Xem camera nào đang hoạt động tốt, camera nào mất kết nối.</li>
          <li><span className="font-semibold">Yêu cầu hỗ trợ mới:</span> Các cảnh báo hoặc yêu cầu giúp đỡ từ người chơi.</li>
          <li><span className="font-semibold">Lối tắt:</span> Truy cập nhanh đến các chức năng quản lý thiết bị và thành viên.</li>
        </ul>
      </section>

      {/* PHẦN 3 */}
      <section>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Phần 3: Hướng Dẫn Các Chức Năng Vận Hành Chính</h2>
        <ol className="list-decimal ml-6 space-y-4 text-base md:text-lg text-gray-800">
          <li>
            <span className="font-semibold text-lime-700">Quản Lý Thiết Bị (Bàn chơi & Camera):</span>
            <ul className="list-disc ml-6">
              <li><span className="font-semibold">Quản lý Bàn chơi (Manage Tables):</span>
                <ul className="list-disc ml-6">
                  <li>Vào mục &quot;Quản lý Bàn&quot;.</li>
                  <li>Thêm Bàn mới (Add Table): Nhập số bàn, loại bàn (ví dụ: bida, bóng bàn) và lưu lại.</li>
                  <li>Sửa thông tin Bàn (Edit Table): Cập nhật số bàn hoặc trạng thái.</li>
                  <li>Xem trạng thái: Biết bàn nào đang trống, bàn nào đang có trận đấu.</li>
                </ul>
              </li>
              <li><span className="font-semibold">Quản lý Camera (Manage Cameras):</span>
                <ul className="list-disc ml-6">
                  <li>Vào mục &quot;Quản lý Camera&quot;.</li>
                  <li>Thêm Camera mới (Add Camera): Nhập thông tin của camera AI mới lắp đặt (địa chỉ IP, thông tin đăng nhập của camera,...).</li>
                  <li>Sửa thông tin Camera (Edit Camera): Cập nhật cấu hình khi cần.</li>
                </ul>
              </li>
              <li><span className="font-semibold">Gán Camera vào Bàn chơi:</span>
                <ul className="list-disc ml-6">
                  <li>Sau khi thêm Bàn và Camera, bạn phải liên kết chúng với nhau.</li>
                  <li>Vào phần chỉnh sửa thông tin của một Bàn chơi.</li>
                  <li>Tìm mục &quot;Gán Camera&quot; (Assign Camera) và chọn đúng Camera AI đang theo dõi bàn đó.</li>
                  <li>Lưu lại. Nếu không thực hiện bước này, hệ thống sẽ không thể tự động ghi điểm.</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-lime-700">Quản Lý Trận Đấu (Manage Matches):</span>
            <ul className="list-disc ml-6">
              <li>Theo dõi các trận đấu đang diễn ra: Bảng điều khiển sẽ cho bạn thấy các trận đấu đang hoạt động.</li>
              <li>Chỉnh sửa thông tin trận đấu (Edit Match): Trong trường hợp xảy ra lỗi, bạn có thể can thiệp.</li>
              <li>Tìm trận đấu cần sửa trong danh sách, nhấn Sửa (Edit).</li>
              <li>Bạn có thể:
                <ul className="list-disc ml-6">
                  <li>Sửa lại điểm số bị Camera AI nhận diện sai.</li>
                  <li>Cập nhật lại thông tin người chơi nếu bị nhầm lẫn.</li>
                  <li>Kết thúc một trận đấu thủ công nếu nó bị kẹt.</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-lime-700">Quản Lý Thành Viên (Manage Membership):</span>
            <ul className="list-disc ml-6">
              <li>Vào mục &quot;Quản lý Thành viên&quot;.</li>
              <li>Thêm thành viên mới (Add Membership): Nhập thông tin người chơi mới đăng ký tại câu lạc bộ.</li>
              <li>Chỉnh sửa thông tin thành viên (Edit Membership): Cập nhật số điện thoại, tên, hoặc gia hạn tư cách thành viên.</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-lime-700">Xử Lý Yêu Cầu Hỗ Trợ (Handle Support Requests):</span>
            <ul className="list-disc ml-6">
              <li>Khi người chơi tại một bàn gặp sự cố và gửi yêu cầu hỗ trợ qua hệ thống, bạn sẽ nhận được thông báo.</li>
              <li>Vào mục &quot;Thông báo&quot; (Notifications) hoặc xem trên Bảng điều khiển.</li>
              <li>Xem chi tiết yêu cầu: Bàn số mấy đang cần hỗ trợ, lý do là gì.</li>
              <li>Đến trực tiếp để hỗ trợ người chơi.</li>
              <li>Sau khi giải quyết xong, đánh dấu yêu cầu là &quot;Đã hoàn thành&quot;.</li>
            </ul>
          </li>
        </ol>
      </section>

      {/* PHẦN 4 */}
      <section>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Phần 4: Các Chức Năng Khác</h2>
        <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
          <li><span className="font-semibold">Gửi Phản Hồi (Send Feedback):</span> Nếu bạn phát hiện lỗi hệ thống hoặc có đề xuất cải tiến, bạn có thể dùng chức năng này để gửi phản hồi trực tiếp cho Admin.</li>
          <li><span className="font-semibold">Quản lý hồ sơ (Profile):</span> Cập nhật thông tin cá nhân và đổi mật khẩu của bạn.</li>
        </ul>
      </section>
    </div>
  ),
  member: (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-lime-600 mb-2">
        Hướng Dẫn Sử Dụng Hệ Thống Scorelens - Dành Cho HỘI VIÊN
      </h1>

      {/* PHẦN 1 */}
      <section>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Phần 1: Kích Hoạt Tư Cách Thành Viên Trong Ứng Dụng</h2>
        <p className="text-base md:text-lg text-gray-800 mb-2">
          Để sử dụng các tính năng đặc biệt, bạn cần liên kết tài khoản ứng dụng của mình với tư cách thành viên đã đăng ký tại câu lạc bộ.
        </p>
        <ol className="list-decimal ml-6 space-y-2 text-base md:text-lg text-gray-800">
          <li>
            <span className="font-semibold text-lime-700">Đăng ký thành viên tại câu lạc bộ</span>:<br />
            Trước tiên, bạn cần đăng ký làm thành viên trực tiếp tại một trong các câu lạc bộ thuộc hệ thống. Nhân viên (Manager) sẽ tạo hồ sơ cho bạn với các thông tin như họ tên, số điện thoại.
          </li>
          <li>
            <span className="font-semibold text-lime-700">Tải ứng dụng và tạo tài khoản</span>:
            <ul className="list-disc ml-6">
              <li>Tải ứng dụng Scorelens từ App Store hoặc Google Play.</li>
              <li>Mở ứng dụng và chọn &quot;Đăng ký&quot; (Sign Up) để tạo một tài khoản người dùng mới bằng email của bạn.</li>
            </ul>
          </li>
          <li>
            <span className="font-semibold text-lime-700">Liên kết tài khoản với tư cách thành viên</span>:
            <ul className="list-disc ml-6">
              <li>Đăng nhập vào ứng dụng.</li>
              <li>Đi đến mục &quot;Hồ sơ&quot; (Profile) hoặc tìm nút &quot;Xác thực thành viên&quot; (Verify Membership).</li>
              <li>Nhập <span className="font-semibold">số điện thoại</span> mà bạn đã dùng để đăng ký tại câu lạc bộ.</li>
              <li>Hệ thống sẽ gửi một <span className="font-semibold">mã xác thực (verify code)</span> đến số điện thoại đó.</li>
              <li>Nhập mã này vào ứng dụng để hoàn tất việc liên kết.</li>
              <li><span className="text-lime-600 font-semibold">Thành công!</span> Tài khoản của bạn giờ đã có đầy đủ quyền lợi của một thành viên.</li>
            </ul>
          </li>
        </ol>
      </section>

      {/* PHẦN 2 */}
      <section>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Phần 2: Các Chức Năng Khi Tham Gia Trận Đấu</h2>
        <ol className="list-decimal ml-6 space-y-2 text-base md:text-lg text-gray-800">
            <li>
              <span className="font-semibold text-lime-700">Tạo hoặc Tham gia một trận đấu mới:</span><br />
              Đến bàn chơi, mở ứng dụng và nhấn &quot;Chơi ngay&quot; (Play Now) hoặc &quot;Tạo trận đấu&quot; (Create Match). Ứng dụng có thể yêu cầu bạn <span className="font-semibold">quét mã QR</span> được đặt tại bàn chơi để tự động xác định vị trí và camera.
            </li>
            <li>
              <span className="font-semibold text-lime-700">Theo dõi trận đấu trực tiếp:</span><br />
              Khi trận đấu bắt đầu, màn hình điện thoại của bạn sẽ hiển thị <span className="font-semibold">giao diện điểm số trực tiếp</span>. Điểm số được cập nhật hoàn toàn <span className="font-semibold">tự động</span> bởi hệ thống Camera AI. Bạn chỉ cần tập trung vào trận đấu!
            </li>
            <li>
              <span className="font-semibold text-lime-700">Gửi Yêu Cầu Hỗ Trợ (Support Request):</span><br />
              Nếu có sự cố tại bàn chơi (ví dụ: camera nhận diện sai, cần sự giúp đỡ của nhân viên), bạn có thể nhấn nút &quot;Hỗ trợ&quot; trên màn hình trận đấu để gửi yêu cầu trực tiếp đến Quản lý (Manager) của câu lạc bộ.
            </li>
          </ol>
        </section>

        {/* PHẦN 3 */}
        <section>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Phần 3: Các Tính Năng Độc Quyền Dành Cho Thành Viên</h2>
          <ol className="list-decimal ml-6 space-y-4 text-base md:text-lg text-gray-800">
            <li>
              <span className="font-semibold text-lime-700">Xem Lịch Sử Trận Đấu (View Match History):</span>
              <ul className="list-disc ml-6">
                <li>Từ menu chính, chọn mục &quot;Lịch sử&quot; (History).</li>
                <li>Xem lại toàn bộ các trận đấu mình đã tham gia: danh sách các trận đấu theo thời gian, kết quả thắng/thua, tỷ số chi tiết, đối thủ, thời gian và địa điểm.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-lime-700">Xem Thống Kê Cá Nhân (Personal Statistics):</span>
              <ul className="list-disc ml-6">
                <li>Tỷ lệ thắng/thua (%), tổng số trận đã đấu, chuỗi thắng/thua dài nhất, các thành tích cá nhân khác.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-lime-700">Hồ Sơ Được Lưu Sẵn (Pre-filled Profile):</span>
              <ul className="list-disc ml-6">
                <li>Khi bạn tạo hoặc tham gia một trận đấu mới, hệ thống sẽ tự động nhận diện và điền sẵn tên của bạn, giúp tiết kiệm thời gian và đảm bảo thông tin luôn chính xác.</li>
              </ul>
            </li>
          </ol>
        </section>

        {/* PHẦN 4 */}
        <section>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Phần 4: Quản Lý Tài Khoản và Gửi Phản Hồi</h2>
          <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
            <li><span className="font-semibold">Hồ sơ cá nhân (Profile):</span> Bạn có thể vào mục này để thay đổi ảnh đại diện, tên hiển thị và mật khẩu.</li>
            <li><span className="font-semibold">Gửi Phản Hồi (Send Feedback):</span> Nếu bạn có góp ý về ứng dụng hoặc phát hiện lỗi, hãy sử dụng chức năng &quot;Phản hồi&quot;. Đội ngũ phát triển sẽ tiếp nhận và cải thiện hệ thống.</li>
          </ul>
        </section>
      </div>
    ),
  user: (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-lime-600 mb-2">
        Hướng Dẫn Sử Dụng Hệ Thống Scorelens - Dành Cho NGƯỜI DÙNG
      </h1>

      {/* PHẦN 1 */}
      <section>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Phần 1: Cách Bắt Đầu - Chỉ 3 Bước Nhanh Gọn</h2>
        <ol className="list-decimal ml-6 space-y-2 text-base md:text-lg text-gray-800">
          <li>
            <span className="font-semibold text-lime-700">Dùng Camera Điện Thoại:</span><br />
            Mở ứng dụng <span className="font-semibold">Camera gốc</span> trên điện thoại của bạn (iPhone hoặc Android).
          </li>
          <li>
            <span className="font-semibold text-lime-700">Quét Mã QR:</span><br />
            Đưa camera về phía <span className="font-semibold">mã QR</span> được đặt ngay trên bàn chơi của bạn.
          </li>
          <li>
            <span className="font-semibold text-lime-700">Mở Link và Chơi:</span><br />
            Một đường link sẽ hiện lên trên màn hình camera. Hãy <span className="font-semibold">nhấn vào đường link đó</span>.<br />
            Trình duyệt web trên điện thoại của bạn (Safari, Chrome,...) sẽ tự động mở ra trang web của trận đấu.<br />
            <span className="text-lime-600 font-semibold">Vậy là xong!</span> Bạn đã kết nối với hệ thống và sẵn sàng thi đấu.
          </li>
        </ol>
      </section>

      {/* PHẦN 2 */}
      <section>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Phần 2: Sử Dụng Trang Web Trong Trận Đấu</h2>
        <ol className="list-decimal ml-6 space-y-2 text-base md:text-lg text-gray-800">
          <li>
            <span className="font-semibold text-lime-700">Nhập Tên (Nếu được yêu cầu):</span><br />
            Trang web có thể yêu cầu bạn nhập tên hoặc biệt danh cho mình và đối thủ. Việc này giúp bảng điểm hiển thị đúng người, đúng điểm.
          </li>
          <li>
            <span className="font-semibold text-lime-700">Theo Dõi Điểm Số Trực Tiếp:</span><br />
            Bây giờ, hãy cất điện thoại đi và tập trung vào trận đấu!<br />
            Mỗi khi có điểm được ghi, điểm số trên trang web sẽ <span className="font-semibold">tự động cập nhật</span> trong thời gian thực. Bạn có thể liếc nhìn điện thoại bất cứ lúc nào để xem tỷ số.
          </li>
          <li>
            <span className="font-semibold text-lime-700">Yêu Cầu Hỗ Trợ (Nếu cần):</span><br />
            Nếu có sự cố tại bàn chơi, hãy tìm nút &quot;Hỗ trợ&quot; (Support) trên trang web. Nhấn vào đó sẽ gửi thông báo ngay lập tức đến Quản lý câu lạc bộ.
          </li>
        </ol>
      </section>

      {/* PHẦN 3 */}
      <section>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Phần 3: Sau Khi Trận Đấu Kết Thúc</h2>
        <p className="text-base md:text-lg text-gray-800 mb-2">
          Khi trận đấu của bạn kết thúc, trang web sẽ hiển thị <span className="font-semibold">kết quả cuối cùng</span> và người chiến thắng.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-yellow-800 text-base md:text-lg font-semibold">
          LƯU Ý CỰC KỲ QUAN TRỌNG:<br />
          Vì bạn đang dùng web app với tư cách khách, dữ liệu trận đấu này chỉ là tạm thời.<br />
          Nếu bạn <span className="underline">đóng tab trình duyệt hoặc thoát ra</span>, thông tin về trận đấu này sẽ <span className="text-red-600 font-bold">mất vĩnh viễn</span> và bạn sẽ không thể xem lại được.
        </div>
      </section>

      {/* PHẦN 4 */}
      <section>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Phần 4: Muốn Lưu Lịch Sử? Hãy Trở Thành Thành Viên!</h2>
        <p className="text-base md:text-lg text-gray-800 mb-2">
          Bạn có muốn lưu lại mọi trận đấu để xem lại thành tích và sự tiến bộ của mình không? Hãy đăng ký làm <span className="text-lime-600 font-semibold">Thành viên</span> của câu lạc bộ!
        </p>
        <ul className="list-disc ml-6 text-base md:text-lg text-gray-800">
          <li><span className="font-semibold">Lưu lại toàn bộ lịch sử trận đấu</span> để xem bất cứ lúc nào.</li>
          <li><span className="font-semibold">Theo dõi thống kê cá nhân</span> (tỷ lệ thắng/thua, điểm số trung bình).</li>
          <li><span className="font-semibold">Không cần nhập lại tên</span> mỗi khi chơi.</li>
          <li>Để đăng ký, bạn chỉ cần liên hệ với nhân viên tại quầy. Rất nhanh chóng và đơn giản!</li>
        </ul>
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
      <div id="main-content" className="bg-white text-black min-h-screen pt-24">
        <div className="container mx-auto flex flex-col md:flex-row gap-8 px-4 pb-16">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
            <nav className="bg-white rounded-xl shadow p-4 text-black sticky top-28">
              <ul className="space-y-2">
                {ROLES.map(r => (
                  <li key={r.key}>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-lg font-bold transition-colors ${role === r.key ? 'bg-lime-100 text-lime-600' : 'text-black hover:bg-gray-100'}`}
                      onClick={() => setRole(r.key as 'business' | 'manager' | 'member' | 'user')}
                    >
                      {r.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          {/* Main Content */}
          <main className="flex-1 bg-white rounded-xl shadow p-8 text-black min-h-[600px]">
            {GUIDE_CONTENT[role]}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
} 