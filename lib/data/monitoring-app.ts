/**
 * Monitoring App page data — Vietnam.
 *
 * Six Monitoring App capabilities as they apply to Vietnamese homes and small
 * businesses. All copy is VN-shaped:
 *   - production / self-consumption framing (no diesel or petrol cost
 *     comparisons — the app shows how much of your solar you use against
 *     how much you draw from the grid)
 *   - no UK / EU regulatory hooks (§14a EnWG, EPEX SPOT, Octopus Agile,
 *     Stiebel Eltron, G99, ENA G98) - those were UK-localised from the
 *     earlier DE-source HEMSSection; the VN app is solar + battery +
 *     load orchestration with the inverter, no tariff-arbitrage or
 *     grid-service framing.
 *
 * Demo video URL is intentionally preserved as-is from the source CDN;
 * the user opted to keep the existing asset. Per vn-content-strategy
 * rule 1 (no fabrication) we do not inject a fake VN-specific CDN
 * path here until business confirms where the production video lives.
 */

export interface MonitoringAppFeature {
  /** Short emoji-free or emoji icon hint for the card. */
  icon: string
  /** Lucide icon key resolved inside FeaturesGrid. */
  iconKey: 'sun' | 'battery' | 'plug' | 'flame' | 'gauge' | 'shield'
  title: string
  description: string
}

/**
 * Six app capabilities for the VN site, ordered by how a Vietnamese
 * homeowner experiences them: solar first, battery next, appliance
 * control, climate, energy-use insight, last the backup-ride-through.
 */
export const monitoringAppFeatures: MonitoringAppFeature[] = [
  {
    icon: '☀️',
    iconKey: 'sun',
    title: 'Tối ưu sản lượng điện mặt trời',
    description:
      'Theo dõi MPPT theo thời gian thực để khai thác tối đa sản lượng tấm pin tạo ra trong ngày.',
  },
  {
    icon: '🔋',
    iconKey: 'battery',
    title: 'Quản lý pin lưu trữ',
    description:
      'Lên lịch sạc và xả pin theo phụ tải của ngôi nhà, ưu tiên khung giờ buổi tối và khi lưới điện mất.',
  },
  {
    icon: '🚗',
    iconKey: 'plug',
    title: 'Kiểm soát sạc xe điện',
    description:
      'Sạc xe bằng nguồn điện mặt trời dư thừa và lên lịch theo khung giá điện khi xe và bộ sạc đã được kết nối.',
  },
  {
    icon: '🌡️',
    iconKey: 'flame',
    title: 'Điều hòa không làm ngắt hệ thống',
    description:
      'Cân đối công suất biến tần với dòng khởi động của điều hòa để tải lớn không làm ngắt hệ thống.',
  },
  {
    icon: '📊',
    iconKey: 'gauge',
    title: 'Theo dõi sản lượng & tiêu thụ',
    description:
      'So sánh lượng điện tự dùng từ mặt trời với lượng điện nhập từ lưới để bạn thấy rõ hiệu quả sử dụng năng lượng mỗi tháng.',
  },
  {
    icon: '🛡️',
    iconKey: 'shield',
    title: 'Duy trì điện khi mất lưới',
    description:
      'Chuyển mạch liền mạch sang pin dự phòng khi lưới điện gặp sự cố – giữ đèn, quạt và kết nối mạng luôn hoạt động.',
  },
]

/**
 * Page-intro block: "One brain for SIX SYSTEMS".
 */
export const monitoringAppIntro = {
  eyebrow: 'Điều khiển thông minh',
  title: 'Một bộ não cho',
  titleHighlight: 'sáu hệ thống',
  body: 'Ứng dụng giám sát Solavita điều phối điện mặt trời, pin lưu trữ, sạc xe điện, điều hòa, phụ tải trong nhà và điện dự phòng trên một màn hình duy nhất.',
}

/**
 * The original UK file carried floating HUD card copy that quoted
 * £-denominated revenue figures and German / GB regulatory framing.
 * Those have been retired for the VN site. Retaining the export shape
 * so callers in components/monitoring-app/* keep typechecking; consumers
 * render the VN-shaped monitoringAppFeatures / monitoringAppIntro above
 * instead.
 */

export interface MonitoringAppVideo {
  src: string
  poster?: string
  caption: string
  duration: string
}

/**
 * Demo video - URL preserved per the user's explicit instruction to
 * keep the existing asset. Move to `public/videos/monitoring-app-vn-demo.mp4`
 * (or the production VN CDN) once business confirms the final host.
 */
export const monitoringAppDemoVideo: MonitoringAppVideo = {
  src: 'https://www.solavita.com/Public/Uploads/uploadfile/files/20250815/wangyeshipin22.mp4',
  caption: 'Video demo trực tiếp Ứng dụng giám sát: điều phối năng lượng thông minh',
  duration: '1:42',
}