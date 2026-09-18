import { Link } from 'react-router-dom';
export function EmptyTripState() {
  return <div className="page-shell py-16 md:py-20"><div className="empty-trip-state"><p className="eyebrow">Bắt đầu từ vài lựa chọn</p><h2>Chưa có kế hoạch chuyến đi</h2><p>Cho TravelGO biết thời gian, ngân sách và điều bạn thích. Các phương án phù hợp sẽ xuất hiện tại đây.</p><Link to="/planner" className="button-primary mt-7 inline-flex px-6 py-3">Lập kế hoạch ngay</Link></div></div>;
}
