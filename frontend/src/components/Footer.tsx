import { Link } from 'react-router-dom';
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-grid">
        <div>
          <Link to="/" className="brand-wordmark footer-brand">Travel<span>GO</span></Link>
          <p className="mt-4 max-w-sm leading-6">Một nơi để bạn chọn điểm đến, cân đối chi phí và bắt đầu hành trình theo cách nhẹ nhàng hơn.</p>
        </div>
        <nav aria-label="Điều hướng cuối trang">
          <p>Khám phá</p>
          <Link to="/destinations">Điểm đến Việt Nam</Link>
          <Link to="/planner">Lập kế hoạch</Link>
          <Link to="/itinerary">Chuyến đi của tôi</Link>
        </nav>
        <nav aria-label="Thông tin TravelGO">
          <p>TravelGO</p>
          <Link to="/about">Về sản phẩm</Link>
          <Link to="/transport">Phương tiện</Link>
          <Link to="/budget">Ngân sách</Link>
        </nav>
      </div>
      <div className="page-shell footer-bottom">
        <p>© 2026 TravelGO</p>
        <p>Dữ liệu giá và thời tiết mang tính tham khảo.</p>
      </div>
    </footer>
  );
}
