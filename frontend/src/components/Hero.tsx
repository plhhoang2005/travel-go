import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="home-hero">
      <div className="page-shell hero-layout">
        <div className="hero-copy">
          <p className="hero-kicker"><span aria-hidden="true" />Hành trình của bạn, theo cách của bạn</p>
          <h1>Đi đâu cho chuyến đi tiếp theo?</h1>
          <p className="hero-description">
            Tìm một nơi thật sự hợp với thời gian, ngân sách và điều bạn muốn cảm nhận trên đường đi.
          </p>
          <div className="hero-actions">
            <Link to="/planner" className="button-primary inline-flex items-center gap-2 px-5 py-3.5">Lập kế hoạch <ArrowRight size={17} aria-hidden="true" /></Link>
            <Link to="/destinations" className="text-link">Khám phá Việt Nam <ArrowDownRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="hero-note">
            <span>01</span>
            <p>Từ một ý tưởng mơ hồ đến lịch trình, phương tiện và khoản chi rõ ràng.</p>
          </div>
        </div>
        <div className="hero-photography" aria-label="Phong cảnh du lịch Việt Nam">
          <figure className="hero-photo-main">
            <img src="/images/ninh-binh.webp" alt="Đoàn thuyền đi giữa núi đá vôi và màu xanh Ninh Bình" />
            <figcaption><strong>Tràng An, Ninh Bình</strong><span>Miền Bắc · Đi chậm giữa non nước</span></figcaption>
          </figure>
          <figure className="hero-photo-inset">
            <img src="/images/hoi-an.webp" alt="Nhà cổ tường vàng và đèn lồng ở Hội An" />
            <figcaption>Hội An · Quảng Nam</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
