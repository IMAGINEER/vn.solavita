'use client'

import { motion } from 'motion/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'

export default function TermsPage() {
  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F9FC]">
      <Header showBackButton={true} onBack={handleBack} logoHref="/" />

      <section className="pt-24 pb-8 lg:pt-32 lg:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Điều khoản sử dụng' },
            ]}
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-3xl lg:text-4xl font-cw-bold text-[#0A1628] mt-6 mb-2"
          >
            Điều khoản sử dụng
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="text-sm text-[#4A5568] mb-4"
          >
            Solavita · Cập nhật lần cuối: 2 tháng 11 năm 2026
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-[#0F766E] to-[#10B981] rounded"
          />
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">1 Về các Điều khoản này</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Các Điều khoản sử dụng này điều chỉnh việc Bạn truy cập và sử dụng trang web Solavita, bao gồm nội dung, thông tin sản phẩm, mô tả giải pháp, biểu mẫu yêu cầu tư vấn và các công cụ trực tuyến.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Trong các Điều khoản này, "Solavita", "chúng tôi" đề cập đến <strong className="text-[#0A1628]">SKYWORTH RENEWABLE ENERGY COMPANY LIMITED</strong>, công ty được thành lập tại Hồng Kông và là đơn vị vận hành trang web này. Thông tin liên hệ của chúng tôi được cung cấp ở cuối các Điều khoản này.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Bằng việc truy cập hoặc sử dụng trang web này, Bạn đồng ý với các Điều khoản này. Nếu Bạn không đồng ý, vui lòng ngừng sử dụng trang web.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">2 Thông tin trên trang web</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Trang web này cung cấp thông tin chung về hệ thống điện mặt trời quang điện, pin lưu trữ năng lượng, các giải pháp nguồn điện dự phòng và các dịch vụ liên quan cho ứng dụng dân dụng và thương mại.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Nội dung trang web được cung cấp cho mục đích thông tin chung. Nội dung này không cấu thành báo giá có tính ràng buộc, thiết kế kỹ thuật, đánh giá kỹ thuật, tư vấn chuyên môn hoặc đề nghị giao kết hợp đồng, trừ khi được nêu rõ ràng khác đi trong một thỏa thuận bằng văn bản riêng.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Thông số sản phẩm, cấu hình, khả năng cung ứng và phương án dịch vụ có thể thay đổi. Mọi việc mua hoặc lắp đặt đều tuân theo báo giá, hợp đồng, đánh giá kỹ thuật và các điều khoản đã thỏa thuận áp dụng.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">3 Hiệu suất điện mặt trời và ước tính tiết kiệm</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Sản lượng điện mặt trời, hiệu suất pin, chi phí điện, mức tiết kiệm tiềm năng và các số liệu khác hiển thị trên trang web này hoặc được tạo ra bởi các công cụ trực tuyến chỉ là ước tính nhằm mục đích minh họa.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Kết quả thực tế có thể khác nhau tùy thuộc vào, trong số các yếu tố khác:
              </p>
              <ul className="list-disc pl-6 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-1">
                <li>Cường độ bức xạ mặt trời, thời tiết, bóng che và điều kiện lắp đặt.</li>
                <li>Cấu hình hệ thống, hiệu suất thiết bị và dung lượng pin.</li>
                <li>Mức tiêu thụ năng lượng và thói quen vận hành của hộ gia đình hoặc doanh nghiệp.</li>
                <li>Các tải tiêu thụ được hệ thống đáp ứng tại từng thời điểm.</li>
                <li>Tình trạng thiết bị, việc bảo trì và các yêu cầu kỹ thuật áp dụng.</li>
              </ul>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Chúng tôi không bảo đảm một mức sản lượng điện cụ thể, tỷ lệ tự chủ năng lượng, mức tiết kiệm chi phí điện, thời gian hoàn vốn hoặc lợi tức tài chính, trừ khi được thỏa thuận rõ ràng trong hợp đồng bằng văn bản có tính ràng buộc.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Hệ thống điện mặt trời và pin lưu trữ có thể không cung cấp đủ cho mọi nhu cầu tiêu thụ tại mọi thời điểm và không nên được giả định là thay thế hoàn toàn nhu cầu đấu nối với lưới điện hoặc các phương án dự phòng khác.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">4 Sử dụng được chấp nhận</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Bạn đồng ý không:
              </p>
              <ul className="list-disc pl-6 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-1">
                <li>Sử dụng trang web này cho các mục đích trái pháp luật, gian lận hoặc gây nhầm lẫn.</li>
                <li>Cố gắng truy cập trái phép vào trang web, hệ thống hoặc dữ liệu của trang web.</li>
                <li>Can thiệp vào hoạt động, bảo mật hoặc khả năng truy cập của trang web.</li>
                <li>Đưa mã độc hoặc thực hiện các hoạt động có thể gây tổn hại cho trang web.</li>
                <li>Sao chép, thu thập tự động (scrape), tái tạo hoặc khai thác thương mại nội dung trang web, trừ khi pháp luật cho phép hoặc có sự chấp thuận bằng văn bản của chúng tôi.</li>
              </ul>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Chúng tôi có thể hạn chế quyền truy cập khi cần thiết một cách hợp lý để bảo vệ trang web, người dùng hoặc lợi ích hợp pháp của chúng tôi.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">5 Quyền sở hữu trí tuệ</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Trừ khi có chỉ dẫn khác, văn bản, hình ảnh đồ họa, thiết kế trực quan, logo, tài liệu sản phẩm và nội dung khác trên trang web thuộc sở hữu hoặc được cấp phép cho chủ thể quyền liên quan.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Bạn có thể xem và sử dụng trang web cho mục đích cá nhân hoặc đánh giá hợp pháp phục vụ hoạt động kinh doanh. Bạn không được tái tạo, phân phối, sửa đổi hoặc khai thác thương mại các tài liệu được bảo hộ nếu không có sự chấp thuận trước, trừ trường hợp pháp luật hiện hành cho phép việc sử dụng đó.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Tên gọi, nhãn hiệu và tài liệu của bên thứ ba vẫn thuộc quyền sở hữu của chủ sở hữu tương ứng.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">6 Yêu cầu tư vấn và thông tin gửi đến</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Việc gửi yêu cầu tư vấn qua trang web này không tự nó tạo ra hợp đồng mua bán, thỏa thuận lắp đặt, quan hệ đại lý hoặc bảo đảm rằng sản phẩm hay dịch vụ sẽ có sẵn.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Bạn đồng ý cung cấp thông tin chính xác khi gửi yêu cầu và không gửi những thông tin mà Bạn không có quyền chia sẻ.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Mọi báo giá, đề xuất, bảo hành, cam kết lắp đặt hoặc nghĩa vụ dịch vụ sẽ được điều chỉnh bởi các điều khoản bằng văn bản áp dụng.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">7 Trang web và dịch vụ của bên thứ ba</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Trang web này có thể chứa liên kết đến trang web hoặc dịch vụ của bên thứ ba nhằm mục đích thuận tiện. Chúng tôi không kiểm soát các bên thứ ba đó và không chịu trách nhiệm về nội dung, khả năng truy cập, hoạt động bảo mật hoặc điều khoản của họ.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Việc Bạn sử dụng trang web hoặc dịch vụ của bên thứ ba tuân theo các điều khoản và chính sách áp dụng của nhà cung cấp đó.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">8 Tuyên bố miễn trừ trách nhiệm và giới hạn trách nhiệm</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Trong phạm vi pháp luật hiện hành cho phép, trang web này và nội dung chung của trang web được cung cấp theo hiện trạng ("as is") và theo khả năng sẵn có ("as available"). Chúng tôi không bảo đảm rằng trang web sẽ luôn không bị gián đoạn, không có lỗi, đầy đủ hoặc được cập nhật.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Không nội dung nào trong các Điều khoản này loại trừ hoặc giới hạn bất kỳ trách nhiệm, quyền hoặc biện pháp khắc phục nào mà pháp luật hiện hành không cho phép loại trừ hoặc giới hạn.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Theo giới hạn đó, chúng tôi không chịu trách nhiệm đối với thiệt hại gián tiếp hoặc hệ quả phát sinh chỉ từ việc Bạn sử dụng hoặc không thể sử dụng trang web này. Mọi trách nhiệm liên quan đến sản phẩm, việc lắp đặt hoặc dịch vụ được cung cấp theo một hợp đồng riêng sẽ được xác định theo hợp đồng đó và pháp luật hiện hành.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">9 Quyền riêng tư và cookie</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Việc chúng tôi thu thập và sử dụng thông tin cá nhân được mô tả trong <a href="/privacy/" className="text-[#0F766E] hover:underline">Chính sách bảo mật</a> của chúng tôi. Thông tin về cookie và các công nghệ tương tự được mô tả trong <a href="/cookies/" className="text-[#0F766E] hover:underline">Chính sách cookie</a> của chúng tôi.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">10 Thay đổi các Điều khoản này</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Chúng tôi có thể cập nhật các Điều khoản này theo thời gian. Phiên bản sửa đổi sẽ được công bố trên trang này kèm ngày sửa đổi được cập nhật. Các thay đổi có hiệu lực từ ngày được nêu trong Điều khoản sửa đổi, tuân theo pháp luật hiện hành.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">11 Luật điều chỉnh</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Các Điều khoản này tuân theo pháp luật của Đặc khu Hành chính Hồng Kông, không loại trừ bất kỳ biện pháp bảo vệ người tiêu dùng bắt buộc hoặc quyền khác áp dụng theo pháp luật quốc gia nơi Bạn cư trú.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">12 Liên hệ với chúng tôi</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Nếu có câu hỏi về các Điều khoản này, vui lòng liên hệ:
              </p>
              <ul className="list-none pl-0 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-1">
                <li><strong className="text-[#0A1628]">Đơn vị vận hành trang web:</strong> SKYWORTH RENEWABLE ENERGY COMPANY LIMITED</li>
                <li><strong className="text-[#0A1628]">Liên hệ:</strong> Johny Zhang</li>
                <li><strong className="text-[#0A1628]">Email:</strong> <a href="mailto:vn@solavita.com" className="text-[#0F766E] hover:underline">vn@solavita.com</a></li>
                <li><strong className="text-[#0A1628]">Địa chỉ đã đăng ký hoặc địa chỉ kinh doanh:</strong> <span className="text-red-600">TBD — Địa chỉ trụ sở đã đăng ký tại Hồng Kông (chờ xác nhận)</span></li>
              </ul>
            </div>

            <div className="pt-6 mt-8 border-t border-[rgba(10,22,40,0.1)]">
              <p className="text-xs text-[#9CA3AF]">
                Cập nhật lần cuối: 2 tháng 11 năm 2026 · Solavita
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}