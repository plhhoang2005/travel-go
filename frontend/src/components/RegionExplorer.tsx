import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { regionStories } from '../data/travelContent';

export function RegionExplorer() {
  const [activeId, setActiveId] = useState(regionStories[0].id);
  const active = regionStories.find((region) => region.id === activeId) || regionStories[0];

  return (
    <div className="region-explorer">
      <div className="region-tabs" role="tablist" aria-label="Khám phá theo vùng">
        {regionStories.map((region) => (
          <button
            key={region.id}
            type="button"
            role="tab"
            aria-selected={activeId === region.id}
            aria-controls="region-story"
            className={activeId === region.id ? 'is-active' : ''}
            onClick={() => setActiveId(region.id)}
          >
            {region.title}
          </button>
        ))}
      </div>
      <div id="region-story" role="tabpanel" className="region-story">
        <div className="region-image-wrap">
          <img key={active.image} src={active.image} alt={active.alt} loading="lazy" />
        </div>
        <div className="region-copy">
          <p className="eyebrow">Đi theo một miền</p>
          <h3>{active.title}</h3>
          <p>{active.copy}</p>
          <span>{active.places}</span>
          <Link to={`/destinations?region=${active.id}`} className="text-link">
            Xem điểm đến <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
