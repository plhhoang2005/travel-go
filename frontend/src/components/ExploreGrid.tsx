import { ArrowUpRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { exploreDestinations, RegionId, regionLabels } from '../data/travelContent';

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
        {destinations.map((destination) => (
          <article key={destination.id} className="explore-card">
            <div className="explore-card-image">
              <img src={destination.image} alt={destination.alt} loading="lazy" />
            </div>
            <div className="explore-card-copy">
              <p>{destination.province} · {destination.detail}</p>
              <h3>{destination.name}</h3>
              <span>{destination.description}</span>
              <Link to="/planner" className="text-link" aria-label={`Lập kế hoạch đi ${destination.name}`}>
                Lên kế hoạch <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
