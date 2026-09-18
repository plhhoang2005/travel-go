import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { RegionExplorer } from '../components/RegionExplorer';
import { Reveal } from '../components/Reveal';

export function HomePage() {
  return (
    <>
      <Hero />
      <section className="page-shell home-section popular-section">
        <Reveal>
          <div className="section-lead">
            <div><p className="eyebrow">Điểm đến được yêu thích</p><h2>Những nơi khiến mình muốn xách ba lô lên</h2></div>
            <Link to="/destinations" className="text-link">Xem tất cả <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </Reveal>
        <div className="popular-grid">
          <Reveal className="popular-feature">
            <Link to="/destinations?region=north" className="photo-story">
              <img src="/images/ha-giang.webp" alt="Đường đèo uốn lượn giữa núi xanh Hà Giang" loading="lazy" />
              <span className="photo-story-overlay" />
              <span className="photo-story-copy"><small>Hà Giang · Miền Bắc</small><strong>Qua những cung đường chạm mây</strong><em>Mã Pí Lèng · Sông Nho Quế</em></span>
            </Link>
          </Reveal>
          <div className="popular-side">
            <Reveal delay={90}>
              <Link to="/destinations?region=south" className="photo-story photo-story-small">
                <img src="/images/da-lat.webp" alt="Hồ nước và rừng thông trong sương Đà Lạt" loading="lazy" />
                <span className="photo-story-overlay" />
                <span className="photo-story-copy"><small>Đà Lạt · Lâm Đồng</small><strong>Một cuối tuần giữa thông và sương</strong></span>
              </Link>
            </Reveal>
            <Reveal delay={160}>
              <Link to="/destinations?region=islands" className="photo-story photo-story-small">
                <img src="/images/phu-quoc.webp" alt="Bờ biển và hàng dừa Phú Quốc" loading="lazy" />
                <span className="photo-story-overlay" />
                <span className="photo-story-copy"><small>Phú Quốc · Kiên Giang</small><strong>Những ngày chỉ cần biển xanh</strong></span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="region-section">
        <div className="page-shell home-section">
          <Reveal><div className="section-lead"><div><p className="eyebrow">Khám phá theo vùng</p><h2>Việt Nam, mỗi miền một nhịp</h2></div><p>Chọn nơi bắt đầu bằng cảnh quan và trải nghiệm bạn đang mong chờ.</p></div></Reveal>
          <Reveal delay={80}><RegionExplorer /></Reveal>
        </div>
      </section>

      <section className="inspiration-section">
        <div className="inspiration-image"><img src="/images/hoi-an.webp" alt="Đèn lồng và ngôi nhà cổ tường vàng ở Hội An" loading="lazy" /></div>
        <Reveal className="page-shell inspiration-content">
          <p className="eyebrow">Cảm hứng lên đường</p>
          <h2>Có những chuyến đi bắt đầu từ một buổi chiều rất khác.</h2>
          <p>Phố cổ Hội An vừa đủ chậm để bạn nghe tiếng bước chân trên phố, ngồi lâu hơn bên hiên nhà và để lịch trình có vài khoảng trống.</p>
          <Link to="/destinations?region=central" className="text-link text-link-light">Đi về miền Trung <ArrowRight size={16} aria-hidden="true" /></Link>
        </Reveal>
      </section>

      <section className="page-shell home-section how-section">
        <Reveal><div className="section-lead"><div><p className="eyebrow">Từ ý tưởng đến hành trình</p><h2>Ba bước, đủ để bắt đầu</h2></div><p>TravelGO giữ phần so sánh ở phía sau, để phía trước chỉ còn những quyết định thật sự cần thiết.</p></div></Reveal>
        <ol className="how-list">
          {[
            ['01', 'Chia sẻ cách bạn muốn đi', 'Chọn nơi xuất phát, số ngày, khoản chi và vài điều bạn yêu thích.'],
            ['02', 'Cân nhắc những lựa chọn phù hợp', 'Điểm đến và phương tiện được đặt cạnh nhau bằng các tiêu chí rõ ràng.'],
            ['03', 'Mang theo một kế hoạch vừa đủ', 'Xem lịch trình từng ngày, chi phí dự kiến và phần dự phòng.'],
          ].map(([step, title, copy]) => (
            <li key={step}><span>{step}</span><div><h3>{title}</h3><p>{copy}</p></div></li>
          ))}
        </ol>
      </section>

      <section className="planner-cta-section">
        <Reveal className="page-shell planner-cta">
          <div><p className="eyebrow">Chuyến đi tiếp theo</p><h2>Bạn đã có vài ngày rảnh. Mình cùng tìm một nơi để đi.</h2></div>
          <Link to="/planner" className="button-primary inline-flex items-center gap-2 px-5 py-3.5">Bắt đầu lập kế hoạch <ArrowRight size={17} aria-hidden="true" /></Link>
        </Reveal>
      </section>
    </>
  );
}
