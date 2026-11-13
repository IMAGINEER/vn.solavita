'use client'

import { motion } from 'motion/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import {
  SITE_LEGAL_NAME,
  SITE_COMPANY_NUMBER,
  SITE_REGISTERED_OFFICE,
} from '@/lib/seo/site'

export default function CookiesPage() {
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
              { label: 'Chính sách cookie' },
            ]}
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-3xl lg:text-4xl font-cw-bold text-[#0A1628] mt-6 mb-2"
          >
            Chính sách cookie
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="text-sm text-[#4A5568] mb-4"
          >
            Solavita · Cập nhật lần cuối: 12 tháng 11 năm 2026
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
              <p className="text-sm text-[#4A5568] leading-relaxed mb-6">
                Chính sách cookie này giải thích cách Solavita sử dụng cookie và các công nghệ tương tự trên trang web này. Chính sách này nên được đọc cùng với <a href="/privacy/" className="text-[#0F766E] hover:underline">Chính sách bảo mật</a> của chúng tôi.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">1 Cookie là gì?</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Cookie là các tệp văn bản nhỏ được lưu trên thiết bị của Bạn khi Bạn truy cập một trang web. Trang web cũng có thể sử dụng các công nghệ tương tự, chẳng hạn như lưu trữ cục bộ (local storage), pixel hoặc script, để ghi nhớ tùy chọn, duy trì chức năng, tìm hiểu cách sử dụng hoặc hỗ trợ quảng cáo.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Chính sách này giải thích cách Solavita có thể sử dụng cookie và các công nghệ tương tự trên trang web này. Các công nghệ thực tế được sử dụng phụ thuộc vào cấu hình của trang web và các dịch vụ do đơn vị vận hành bật.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">2 Các loại cookie</h2>
              <p className="text-sm text-[#0A1628] font-cw-bold mb-1">Các công nghệ thiết yếu</p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Các công nghệ này hỗ trợ các chức năng thiết yếu của trang web, bảo mật, quản lý mạng hoặc các tính năng mà Bạn yêu cầu cụ thể. Khi pháp luật cho phép, các công nghệ này có thể hoạt động mà không cần sự đồng ý.
              </p>
              <p className="text-sm text-[#0A1628] font-cw-bold mb-1">Các công nghệ phân tích và hiệu suất</p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Các công nghệ này giúp đo lường lưu lượng truy cập, tìm hiểu cách khách truy cập sử dụng trang web và xác định các vấn đề kỹ thuật. Các công nghệ này chỉ nên được bật theo đúng yêu cầu áp dụng về sự đồng ý và cấu hình thực tế của trang web.
              </p>
              <p className="text-sm text-[#0A1628] font-cw-bold mb-1">Các công nghệ tiếp thị và quảng cáo</p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Các công nghệ này có thể được sử dụng để đo lường hiệu quả quảng cáo, xác định yêu cầu tư vấn thuộc các chiến dịch hoặc cá nhân hóa hoạt động tiếp thị. Các công nghệ này chỉ nên được sử dụng khi thực sự được cài đặt và đáp ứng sự đồng ý cần thiết hoặc các điều kiện hợp pháp khác.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Chúng tôi sẽ không coi các công nghệ phân tích hoặc tiếp thị là đang hoạt động chỉ vì chính sách này mô tả chúng.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">3 Cookie được sử dụng trên trang web này</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Các cookie và công nghệ tương tự chính xác phụ thuộc vào các công cụ được bật trên trang web.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Danh mục cookie và công nghệ tương tự cụ thể — bao gồm tên, nhà cung cấp, mục đích, phân loại, thời hạn và việc có truyền dữ liệu đến bên thứ ba hay không — phụ thuộc vào cấu hình thực tế của trang web tại từng thời điểm. Chúng tôi rà soát danh mục này định kỳ và cập nhật khi cấu hình thay đổi. Bạn có thể liên hệ với chúng tôi để biết thông tin chi tiết về các công nghệ đang hoạt động.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">4 Quản lý tùy chọn của Bạn</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Khi có công cụ tùy chọn cookie hoặc công cụ đồng ý, Bạn có thể dùng công cụ đó để xem xét hoặc thay đổi lựa chọn của mình. Nếu trang web chưa có công cụ như vậy, Bạn có thể thay đổi lựa chọn qua cài đặt trình duyệt.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Bạn cũng có thể quản lý hoặc xóa cookie thông qua cài đặt trình duyệt. Việc chặn toàn bộ cookie có thể ảnh hưởng đến một số chức năng của trang web. Các điều khiển của trình duyệt không nhất thiết ngăn được mọi công nghệ tương tự hoạt động.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Nếu pháp luật hiện hành yêu cầu sự đồng ý trước đối với các công nghệ không thiết yếu, các công nghệ đó sẽ không được kích hoạt trước khi có sự đồng ý.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">5 Dịch vụ của bên thứ ba</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Một số tính năng của trang web có thể phụ thuộc vào dịch vụ của bên thứ ba, chẳng hạn như nội dung nhúng, phân tích, quảng cáo hoặc công cụ liên lạc. Nếu được bật, các nhà cung cấp đó có thể xử lý thông tin kỹ thuật theo chính sách riêng của họ.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Các nhà cung cấp bên thứ ba được sử dụng phụ thuộc vào các tính năng thực tế được bật trên trang web, chẳng hạn như dịch vụ lưu trữ, phân tích, nhúng nội dung hoặc công cụ liên lạc. Các nhà cung cấp này xử lý thông tin kỹ thuật theo chính sách quyền riêng tư và cookie riêng của họ. Thông tin chi tiết về các nhà cung cấp đang hoạt động có thể được cung cấp khi có yêu cầu.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">6 Thay đổi đối với Chính sách này</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Chúng tôi có thể cập nhật Chính sách cookie này khi công nghệ của trang web, nhà cung cấp dịch vụ hoặc yêu cầu pháp lý thay đổi. Phiên bản mới nhất sẽ được công bố trên trang này kèm ngày sửa đổi được cập nhật.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">7 Liên hệ với chúng tôi</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Nếu có câu hỏi về cookie hoặc các công nghệ tương tự, vui lòng liên hệ:
              </p>
              <ul className="list-none pl-0 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-1">
                <li><strong className="text-[#0A1628]">Đơn vị vận hành trang web:</strong> {SITE_LEGAL_NAME} (công ty được thành lập tại Việt Nam)</li>
                <li><strong className="text-[#0A1628]">Mã số doanh nghiệp:</strong> {SITE_COMPANY_NUMBER}</li>
                <li><strong className="text-[#0A1628]">Liên hệ:</strong> Johny Zhang</li>
                <li><strong className="text-[#0A1628]">Email:</strong> <a href="mailto:vn@solavita.com" className="text-[#0F766E] hover:underline">vn@solavita.com</a></li>
                <li><strong className="text-[#0A1628]">Địa chỉ:</strong> {SITE_REGISTERED_OFFICE}</li>
              </ul>
            </div>

            <div className="pt-6 mt-8 border-t border-[rgba(10,22,40,0.1)]">
              <p className="text-xs text-[#9CA3AF]">
                Cập nhật lần cuối: 12 tháng 11 năm 2026 · Solavita
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}