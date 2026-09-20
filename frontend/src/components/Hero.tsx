import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const heroSlides = [
  {
    image: '/images/ninh-binh.webp',
    name: 'Tràng An, Ninh Bình',
    meta: 'Miền Bắc · Đi chậm giữa non nước',
    alt: 'Đoàn thuyền đi giữa núi đá vôi và màu xanh Ninh Bình',
  },
  {
    image: '/images/ha-giang.webp',
    name: 'Mã Pí Lèng, Hà Giang',
    meta: 'Miền Bắc · Chạm mây trên cao nguyên đá',
    alt: 'Cung đường đèo uốn lượn giữa núi xanh Hà Giang',
  },
  {
    image: '/images/hoi-an.webp',
    name: 'Phố cổ Hội An',
    meta: 'Miền Trung · Một chiều bên sông Hoài',
    alt: 'Nhà cổ tường vàng và đèn lồng ở Hội An',
  },
  {
    image: '/images/phu-quoc.webp',
    name: 'Phú Quốc, Kiên Giang',
    meta: 'Biển đảo · Theo nắng về phía Nam',
    alt: 'Bờ biển xanh và hàng dừa ở Phú Quốc',
  },
] as const;

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const nextSlide = (activeSlide + 1) % heroSlides.length;

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section className="home-hero">
      <div className="page-shell hero-layout">
        <div className="hero-copy">
          <p className="hero-kicker"><span aria-hidden="true" /><span>Việt Nam · những ngày muốn lên đường</span></p>
          <h1>Đi đâu đó,<br />theo cách của riêng bạn.</h1>
          <p className="hero-description">
            Lên kế hoạch chuyến đi phù hợp với thời gian, ngân sách và cách bạn muốn khám phá.
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
        <div
          className="hero-photography"
          aria-label="Phong cảnh du lịch Việt Nam"
          onMouseEnter={() => setPaused(true)}
          onPointerMove={(event) => {
            if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            const rect = event.currentTarget.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            event.currentTarget.style.setProperty('--hero-rx', `${y * -2.2}deg`);
            event.currentTarget.style.setProperty('--hero-ry', `${x * 2.6}deg`);
            event.currentTarget.style.setProperty('--hero-x', `${x * 7}px`);
            event.currentTarget.style.setProperty('--hero-y', `${y * 5}px`);
          }}
          onPointerLeave={(event) => {
            setPaused(false);
            event.currentTarget.style.setProperty('--hero-rx', '0deg');
            event.currentTarget.style.setProperty('--hero-ry', '0deg');
            event.currentTarget.style.setProperty('--hero-x', '0px');
            event.currentTarget.style.setProperty('--hero-y', '0px');
          }}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <figure className="hero-photo-main">
            <div className="hero-photo-stack">
              <img
                key={heroSlides[activeSlide].image}
                src={heroSlides[activeSlide].image}
                alt={heroSlides[activeSlide].alt}
                className="is-active"
                loading={activeSlide === 0 ? 'eager' : 'lazy'}
                fetchPriority={activeSlide === 0 ? 'high' : 'auto'}
              />
            </div>
            <figcaption key={heroSlides[activeSlide].name}>
              <strong>{heroSlides[activeSlide].name}</strong>
              <span>{heroSlides[activeSlide].meta}</span>
            </figcaption>
          </figure>

          <button
            type="button"
            className="hero-photo-inset"
            onClick={() => setActiveSlide(nextSlide)}
            aria-label={`Xem tiếp: ${heroSlides[nextSlide].name}`}
          >
            <img key={heroSlides[nextSlide].image} src={heroSlides[nextSlide].image} alt="" />
            <span>{heroSlides[nextSlide].name}</span>
            <i aria-hidden="true"><ArrowRight size={14} /></i>
          </button>

          <div className="hero-slide-controls" aria-label="Chọn cảnh đẹp" role="group">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                className={index === activeSlide ? 'is-active' : ''}
                onClick={() => setActiveSlide(index)}
                aria-label={`Xem ${slide.name}`}
                aria-pressed={index === activeSlide}
              >
                <span aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
