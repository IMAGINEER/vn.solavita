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

export default function PrivacyPage() {
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
              { label: 'Chính sách bảo mật' },
            ]}
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-3xl lg:text-4xl font-cw-bold text-[#0A1628] mt-6 mb-2"
          >
            Chính sách bảo mật
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
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">1 Giới thiệu</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Chính sách bảo mật này giải thích cách <strong className="text-[#0A1628]">{SITE_LEGAL_NAME}</strong> ("Solavita", "chúng tôi" hoặc "Solavita Việt Nam") thu thập, sử dụng, lưu trữ và chia sẻ thông tin cá nhân khi Bạn truy cập trang web này, liên hệ với chúng tôi hoặc gửi yêu cầu tư vấn.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Chúng tôi hướng tới việc xử lý thông tin cá nhân một cách minh bạch và tuân thủ pháp luật hiện hành về bảo vệ dữ liệu, bao gồm Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và các văn bản hướng dẫn thi hành, trong phạm vi áp dụng đối với Bạn; và Pháp lệnh Bảo vệ dữ liệu cá nhân (Personal Data (Privacy) Ordinance) của Hồng Kông, trong phạm vi áp dụng cho hoạt động xử lý do công ty mẹ tại Hồng Kông của chúng tôi thực hiện.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">2 Thông tin chúng tôi có thể thu thập</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Tùy thuộc vào cách Bạn tương tác với trang web, chúng tôi có thể thu thập các nhóm thông tin sau:
              </p>
              <p className="text-sm text-[#0A1628] font-cw-bold mb-1">Thông tin do Bạn cung cấp</p>
              <ul className="list-disc pl-6 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-1">
                <li>Họ tên và thông tin liên hệ, chẳng hạn như địa chỉ email và số điện thoại.</li>
                <li>Thông tin về địa điểm nhà ở hoặc địa điểm kinh doanh mà Bạn lựa chọn cung cấp.</li>
                <li>Thông tin chi tiết về nhu cầu sử dụng năng lượng, công trình, phương án lắp đặt dự kiến hoặc yêu cầu kinh doanh của Bạn.</li>
                <li>Thông tin chứa trong tin nhắn và các trao đổi khác mà Bạn gửi đến chúng tôi.</li>
              </ul>
              <p className="text-sm text-[#0A1628] font-cw-bold mb-1">Thông tin kỹ thuật và thông tin về việc sử dụng</p>
              <ul className="list-disc pl-6 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-1">
                <li>Địa chỉ IP, loại trình duyệt, thông tin thiết bị, hệ điều hành và vị trí gần đúng được suy ra từ thông tin kỹ thuật.</li>
                <li>Các trang đã xem, thông tin giới thiệu (referral), sự kiện tương tác và dấu thời gian.</li>
                <li>Mã định danh cookie và dữ liệu kỹ thuật tương tự, trong trường hợp các công nghệ này được sử dụng.</li>
              </ul>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Chúng tôi chỉ thu thập những thông tin phù hợp với chức năng thực tế của trang web và quy trình kinh doanh của chúng tôi.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">3 Cách chúng tôi sử dụng thông tin</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Tùy thuộc vào pháp luật hiện hành và hoàn cảnh thu thập, chúng tôi có thể sử dụng thông tin cá nhân để:
              </p>
              <ul className="list-disc pl-6 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-1">
                <li>Phản hồi các yêu cầu và đề nghị cung cấp thông tin.</li>
                <li>Đánh giá nhu cầu sử dụng năng lượng đã nêu và xây dựng hoặc phối hợp xây dựng phương án đề xuất.</li>
                <li>Trao đổi về sản phẩm, báo giá, yêu cầu lắp đặt hoặc yêu cầu dịch vụ hậu mãi.</li>
                <li>Vận hành, bảo mật, khắc phục sự cố và cải thiện trang web.</li>
                <li>Đo lường hiệu suất trang web trong trường hợp hoạt động phân tích được thực hiện hợp pháp.</li>
                <li>Đáp ứng nghĩa vụ pháp lý và xác lập, thực hiện hoặc bảo vệ các quyền, yêu cầu pháp lý.</li>
              </ul>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Chúng tôi sẽ không sử dụng thông tin cá nhân cho mục đích không liên quan nếu việc đó không phù hợp với pháp luật hiện hành hoặc với thông tin đã cung cấp cho Bạn.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">4 Cơ sở pháp lý cho việc xử lý dữ liệu</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Trong trường hợp pháp luật hiện hành yêu cầu có cơ sở pháp lý cho việc xử lý dữ liệu, chúng tôi sẽ dựa trên cơ sở phù hợp với hoạt động liên quan. Tùy theo hoàn cảnh, cơ sở đó có thể bao gồm sự đồng ý của Bạn, các bước thực hiện theo yêu cầu của Bạn trước khi giao kết hợp đồng, việc tuân thủ nghĩa vụ pháp lý hoặc một cơ sở hợp pháp khác được pháp luật hiện hành cho phép.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Khi cần có sự đồng ý, Bạn có thể rút lại sự đồng ý thông qua cơ chế liên quan hoặc bằng cách liên hệ với chúng tôi. Việc rút lại sự đồng ý không ảnh hưởng đến hoạt động xử lý dữ liệu đã được thực hiện hợp pháp trước thời điểm rút lại.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">5 Chia sẻ thông tin</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Chúng tôi không bán thông tin cá nhân như một sản phẩm dữ liệu độc lập.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Chúng tôi có thể chia sẻ thông tin liên quan với các nhà cung cấp dịch vụ hoặc các bên nhận thông tin khác khi cần thiết cho các mục đích như lưu trữ trang web, gửi biểu mẫu, liên lạc, bảo mật, phân tích, quản lý quan hệ khách hàng hoặc thực hiện yêu cầu của Bạn.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Chúng tôi cũng có thể tiết lộ thông tin khi pháp luật yêu cầu, để bảo vệ quyền lợi hợp pháp hoặc liên quan đến việc tổ chức lại hoạt động kinh doanh, tuân theo các yêu cầu pháp lý hiện hành.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Các bên nhận thông tin cụ thể phụ thuộc vào dịch vụ thực tế mà chúng tôi sử dụng, bao gồm các nhà cung cấp dịch vụ lưu trữ trang web, gửi biểu mẫu, phân tích, nhắn tin và quản lý quan hệ khách hàng. Các nhà cung cấp này chỉ được xử lý thông tin cá nhân theo hướng dẫn của chúng tôi, trong phạm vi cần thiết để cung cấp dịch vụ và phải tuân thủ nghĩa vụ bảo mật, bảo vệ dữ liệu cá nhân theo hợp đồng và pháp luật hiện hành. Danh sách nhà cung cấp cụ thể được rà soát định kỳ và cập nhật khi có thay đổi.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">6 Chuyển dữ liệu quốc tế</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Một số nhà cung cấp dịch vụ có thể xử lý hoặc lưu trữ thông tin bên ngoài Việt Nam, Hồng Kông hoặc quốc gia nơi Bạn cư trú.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Khi thông tin cá nhân được chuyển ra nước ngoài, chúng tôi sẽ thực hiện các bước mà pháp luật hiện hành về bảo vệ dữ liệu yêu cầu, bao gồm mọi biện pháp bảo đảm hoặc đánh giá cần thiết.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Trước khi chuyển dữ liệu cá nhân ra nước ngoài, chúng tôi thực hiện các nghĩa vụ theo pháp luật hiện hành về bảo vệ dữ liệu cá nhân, bao gồm lập hồ sơ đánh giá tác động chuyển dữ liệu cá nhân ra nước ngoài, cung cấp hồ sơ cho cơ quan có thẩm quyền khi được yêu cầu và áp dụng các biện pháp bảo vệ phù hợp. Dữ liệu có thể được lưu trữ và xử lý tại Việt Nam hoặc tại quốc gia, vùng lãnh thổ nơi nhà cung cấp dịch vụ hoặc đơn vị trực thuộc của chúng tôi đặt máy chủ; trong mọi trường hợp, thông tin được bảo vệ theo Chính sách này và pháp luật hiện hành.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">7 Thời hạn lưu trữ dữ liệu</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Chúng tôi chỉ lưu trữ thông tin cá nhân trong thời hạn hợp lý cần thiết cho các mục đích thu thập, bao gồm phản hồi yêu cầu, duy trì hồ sơ kinh doanh liên quan, đáp ứng nghĩa vụ pháp lý và giải quyết tranh chấp.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Thời hạn lưu trữ phụ thuộc vào loại thông tin, mục đích xử lý và yêu cầu pháp lý hiện hành. Chúng tôi sẽ xóa hoặc ẩn danh hóa thông tin khi không còn cần thiết, trong phạm vi phù hợp và khả thi về mặt kỹ thuật.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Thông tin cá nhân được lưu giữ theo các tiêu chí sau: thông tin liên hệ và yêu cầu tư vấn được lưu giữ trong thời gian cần thiết để xử lý yêu cầu, thực hiện hợp đồng hoặc giải quyết tranh chấp; dữ liệu phân tích và nhật ký máy chủ được lưu giữ trong thời gian cần thiết cho mục đích vận hành, bảo mật và cải thiện trang web; sau khi hết thời hạn nêu trên hoặc khi pháp luật yêu cầu, thông tin sẽ được xóa hoặc ẩn danh hóa. Thời hạn cụ thể được xác định theo tính chất dữ liệu, mục đích xử lý và yêu cầu của pháp luật hiện hành.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">8 Bảo mật dữ liệu</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức hợp lý nhằm bảo vệ thông tin cá nhân khỏi việc truy cập trái phép, mất mát, sử dụng sai mục đích hoặc thay đổi.
              </p>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Không có phương thức truyền tải hoặc lưu trữ nào hoàn toàn an toàn. Chúng tôi không thể bảo đảm an toàn tuyệt đối, nhưng sẽ thực hiện các bước phù hợp để bảo vệ thông tin trong phạm vi kiểm soát của mình.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">9 Quyền riêng tư của Bạn</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Tùy thuộc vào pháp luật hiện hành và các trường hợp ngoại lệ liên quan, Bạn có thể có quyền:
              </p>
              <ul className="list-disc pl-6 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-1">
                <li>Yêu cầu truy cập thông tin cá nhân mà chúng tôi lưu giữ về Bạn.</li>
                <li>Yêu cầu chỉnh sửa thông tin không chính xác hoặc chưa đầy đủ.</li>
                <li>Yêu cầu xóa thông tin cá nhân khi pháp luật cho phép.</li>
                <li>Phản đối hoặc yêu cầu hạn chế một số hoạt động xử lý dữ liệu.</li>
                <li>Yêu cầu cung cấp bản sao một số thông tin ở định dạng có thể chuyển giao khi áp dụng.</li>
                <li>Rút lại sự đồng ý trong trường hợp việc xử lý dựa trên sự đồng ý.</li>
                <li>Khiếu nại với cơ quan có thẩm quyền về bảo vệ dữ liệu cá nhân.</li>
              </ul>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Để gửi yêu cầu, vui lòng liên hệ với chúng tôi theo thông tin dưới đây. Chúng tôi có thể cần xác minh danh tính của Bạn trước khi phản hồi.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">10 Trẻ em</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Trang web này dành cho các yêu cầu tư vấn dân dụng và thương mại thông thường, không được thiết kế để thu thập trực tiếp thông tin cá nhân của trẻ em. Nếu Bạn cho rằng một trẻ em đã cung cấp thông tin cá nhân không đúng cách, vui lòng liên hệ với chúng tôi để chúng tôi đánh giá và xử lý vấn đề.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">11 Trang web của bên thứ ba</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Trang web của chúng tôi có thể chứa liên kết đến trang web của bên thứ ba. Hoạt động bảo mật của các trang web đó được điều chỉnh bởi chính sách riêng của họ. Vui lòng xem xét các chính sách đó trước khi cung cấp thông tin cá nhân cho những trang web này.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">12 Thay đổi đối với Chính sách này</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Chúng tôi có thể cập nhật Chính sách bảo mật này để phản ánh những thay đổi trong hoạt động, công nghệ hoặc yêu cầu pháp lý. Phiên bản mới nhất sẽ được công bố trên trang này kèm ngày sửa đổi được cập nhật.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-cw-bold text-[#0A1628] mt-8 mb-3">13 Liên hệ với chúng tôi</h2>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Đối với các câu hỏi hoặc yêu cầu về quyền riêng tư, vui lòng liên hệ:
              </p>
              <ul className="list-none pl-0 text-sm text-[#4A5568] leading-relaxed mb-3 space-y-1">
                <li><strong className="text-[#0A1628]">Bên kiểm soát dữ liệu cá nhân / đơn vị vận hành trang web:</strong> {SITE_LEGAL_NAME} (công ty được thành lập tại Việt Nam)</li>
                <li><strong className="text-[#0A1628]">Mã số doanh nghiệp:</strong> {SITE_COMPANY_NUMBER}</li>
                <li><strong className="text-[#0A1628]">Liên hệ về quyền riêng tư:</strong> Johny Zhang</li>
                <li><strong className="text-[#0A1628]">Email:</strong> <a href="mailto:vn@solavita.com" className="text-[#0F766E] hover:underline">vn@solavita.com</a></li>
                <li><strong className="text-[#0A1628]">Địa chỉ:</strong> {SITE_REGISTERED_OFFICE}</li>
              </ul>
              <p className="text-sm text-[#4A5568] leading-relaxed mb-3">
                Mọi câu hỏi, yêu cầu thực hiện quyền hoặc khiếu nại liên quan đến bảo vệ dữ liệu cá nhân xin gửi đến đầu mối liên hệ nêu trên. Chúng tôi sẽ tiếp nhận, xác minh và phản hồi trong thời hạn pháp luật quy định.
              </p>
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