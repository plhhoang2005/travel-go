import { KeyboardEvent, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { regionStories } from '../data/travelContent';

export function RegionExplorer() {
  const [activeId, setActiveId] = useState(regionStories[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = regionStories.find((region) => region.id === activeId) || regionStories[0];

  const moveTab = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    let nextIndex = direction ? (currentIndex + direction + regionStories.length) % regionStories.length : currentIndex;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = regionStories.length - 1;
    if (!direction && !['Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    setActiveId(regionStories[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="region-explorer">
      <div className="region-tabs" role="tablist" aria-label="Khám phá theo vùng">
        {regionStories.map((region, index) => (
          <button
            key={region.id}
            ref={(element) => { tabRefs.current[index] = element; }}
            id={`region-tab-${region.id}`}
            type="button"
            role="tab"
            aria-selected={activeId === region.id}
            aria-controls={`region-story-${region.id}`}
            tabIndex={activeId === region.id ? 0 : -1}
            className={activeId === region.id ? 'is-active' : ''}
            onClick={() => setActiveId(region.id)}
            onKeyDown={(event) => moveTab(event, index)}
          >
            {region.title}
          </button>
        ))}
      </div>
      <div key={active.id} id={`region-story-${active.id}`} role="tabpanel" aria-labelledby={`region-tab-${active.id}`} className="region-story">
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
