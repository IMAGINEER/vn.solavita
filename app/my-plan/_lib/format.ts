/**
 * Các hàm định dạng cho giao diện `/my-plan`.
 *
 * Số tiền tạm thời vẫn dùng ký hiệu ₦ (chờ xác nhận giá bán tại Việt Nam)
 * nhưng đã chuyển sang bộ phân cách `vi-VN` để cách đọc số khớp với phần
 * còn lại của site. Ngày dùng định dạng `vi-VN`. Thêm
 * `tabular-nums` ở phía component để các cột số có độ rộng ổn định.
 *
 * Ghi chú: helper `formatGBP` trước đây đã bị xoá (không còn nơi gọi,
 * phần ROI nằm ở nơi khác). Nếu sau này cần hiển thị GBP, hãy thêm lại
 * một cách rõ ràng - đừng biến nó thành helper chung.
 */

export function formatNGN(value: number): string {
  if (!Number.isFinite(value)) return '₦0'
  return '₦' + Math.round(value).toLocaleString('vi-VN')
}

export function formatKwh(value: number): string {
  return Math.round(value).toLocaleString('vi-VN') + ' kWh'
}

export function formatKw(value: number): string {
  return value.toFixed(1) + ' kWp'
}

/**
 * Ngày theo kiểu "31/08/2026". Tự xử lý an toàn nếu `Intl` không khả dụng.
 */
export function formatDateEnGB(date: Date): string {
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}