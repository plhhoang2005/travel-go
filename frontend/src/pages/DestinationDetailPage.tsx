import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { TravelImage } from '../components/TravelImage';
import { exploreDestinations } from '../data/travelContent';

export function DestinationDetailPage() {
  const { slug } = useParams();
  const destination = exploreDestinations.find((item) => item.id === slug);

  if (!destination) return <Navigate to="/destinations" replace />;

  const related = exploreDestinations
    .filter((item) => item.id !== destination.id && (item.region === destination.region || item.region === 'central'))
    .slice(0, 2);

  return (
    <>
      <article className="destination-detail">
        <div className="page-shell destination-detail-head">
          <Link to="/destinations" className="detail-back"><ArrowLeft size={15} aria-hidden="true" /> Tất cả điểm đến</Link>
          <div className="destination-detail-title">
            <div>
              <p className="eyebrow">{destination.province} · {destination.duration}</p>
              <h1>{destination.name}</h1>
            </div>
            <p>{destination.travelStyle}</p>
          </div>
        </div>

        <div className="page-shell destination-detail-visual">
          <TravelImage src={destination.image} alt={destination.alt} loading="eager">
            <span className="destination-photo-caption">{destination.detail}</span>
          </TravelImage>
        </div>

        <div className="page-shell destination-detail-body">
          <Reveal className="destination-detail-story">
            <p className="story-number" aria-hidden="true">01</p>
            <div>
              <p className="eyebrow">Cảm giác nơi này</p>
              <h2>{destination.description}</h2>
              <p>{destination.note}</p>
            </div>
          </Reveal>

          <Reveal delay={90} className="destination-detail-aside">
            <p className="eyebrow">Gợi ý để bắt đầu</p>
            <dl>
              <div><dt>Thời lượng</dt><dd>{destination.duration}</dd></div>
              <div><dt>Nhịp chuyến đi</dt><dd>{destination.travelStyle}</dd></div>
            </dl>
            <div className="destination-highlights">
              <span>Những nơi có thể ghé</span>
              <ul>{destination.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
            </div>
            <Link to="/planner" className="button-primary inline-flex items-center gap-2 px-5 py-3">
              Lên kế hoạch chuyến đi <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </article>

      <section className="related-destinations">
        <div className="page-shell">
          <div className="section-lead">
            <div><p className="eyebrow">Đi tiếp từ đây</p><h2>Hai nhịp Việt Nam khác</h2></div>
            <Link to="/destinations" className="text-link">Xem bản đồ cảm hứng <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="related-destination-list">
            {related.map((item) => (
              <Link to={`/destination/${item.id}`} key={item.id}>
                <img src={item.image} alt="" loading="lazy" />
                <span><small>{item.province} · {item.duration}</small><strong>{item.name}</strong></span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
