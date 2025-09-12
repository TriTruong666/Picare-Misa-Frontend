export const formatPrice = (price: number): string => {
  const formatted = new Intl.NumberFormat("vi-VN").format(price);
  return `${formatted} VND`;
};

export const relativeTime = (dateString: string): string => {
  const date = new Date(dateString);

  // Convert UTC -> Vietnam timezone (UTC+7)
  const vnTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  const now = new Date();
  const nowVN = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  const diffMs = nowVN.getTime() - vnTime.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return "Mới đây";
  }
  if (diffMin < 60) {
    return `${diffMin} phút trước`;
  }
  if (diffHour < 24) {
    return `${diffHour} giờ trước`;
  }
  if (diffDay >= 1) {
    const day = vnTime.getDate().toString().padStart(2, "0");
    const month = (vnTime.getMonth() + 1).toString().padStart(2, "0");
    const year = vnTime.getFullYear();
    const hours = vnTime.getHours().toString().padStart(2, "0");
    const minutes = vnTime.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  return "";
}
