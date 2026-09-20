import { ArrowUpRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { exploreDestinations, RegionId, regionLabels } from '../data/travelContent';
import { TravelImage } from './TravelImage';

const filters: RegionId[] = ['all', 'north', 'central', 'south', 'islands'];

export function ExploreGrid() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedRegion = searchParams.get('region') as RegionId | null;
  const activeRegion = requestedRegion && filters.includes(requestedRegion) ? requestedRegion : 'all';
  const destinations = activeRegion === 'all'
    ? exploreDestinations
    : exploreDestinations.filter((destination) => destination.region === activeRegion);

  return (
    <section aria-labelledby="explore-heading">
      <div className="section-lead">
        <div>
          <p className="eyebrow">Đi dọc Việt Nam</p>
          <h2 id="explore-heading">Chọn một nơi hợp với nhịp đi của bạn</h2>
        </div>
        <p>Không cần xem hết mọi nơi. Bắt đầu từ một vùng, một cảnh quan hoặc cảm giác bạn đang tìm.</p>
      </div>
      <div className="explore-filters" role="group" aria-label="Lọc điểm đến theo vùng">
        {filters.map((filter) => (
          <button
            type="button"
            key={filter}
            className={activeRegion === filter ? 'is-active' : ''}
            aria-pressed={activeRegion === filter}
            onClick={() => setSearchParams(filter === 'all' ? {} : { region: filter })}
          >
            {regionLabels[filter]}
          </button>
        ))}
      </div>
      <div className="explore-grid" aria-live="polite">
        {destinations.map((destination, index) => (
          <article key={destination.id} className="explore-card">
            <Link to={`/destination/${destination.id}`} aria-label={`Khám phá ${destination.name}`} className="explore-card-image">
              <TravelImage src={destination.image} alt={destination.alt}>
                <span className="explore-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              </TravelImage>
            </Link>
            <div className="explore-card-copy">
              <p>{destination.province} · {destination.duration}</p>
              <h3><Link to={`/destination/${destination.id}`}>{destination.name}</Link></h3>
              <span>{destination.description}</span>
              <Link to={`/destination/${destination.id}`} className="text-link" aria-label={`Khám phá ${destination.name}`}>
                Đọc hành trình <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
