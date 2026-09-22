import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RawDestination } from '../api/tripApi';
import { getDestinationImage } from '../data/destinationVisuals';

interface Props {
  destinations: RawDestination[];
  selectedDestinationId?: string;
  onSelectForPlan?: (destination: RawDestination) => void;
}

const REGION_FILTERS = [
  { id: 'all', label: 'Toàn quốc' },
  { id: 'Miền Bắc', label: 'Miền Bắc' },
  { id: 'Miền Trung', label: 'Miền Trung' },
  { id: 'Tây Nguyên', label: 'Tây Nguyên' },
  { id: 'Miền Nam & ĐBSCL', label: 'Miền Nam & ĐBSCL' },
];

const TAG_FILTERS = [
  { id: 'all', label: 'Tất cả chủ đề' },
  { id: 'beach', label: '🏖️ Biển đảo' },
  { id: 'mountain', label: '⛰️ Vùng núi' },
  { id: 'heritage', label: '🏛️ Di sản & Văn hóa' },
  { id: 'food', label: '🍜 Ẩm thực' },
];

// Strict bounds for Vietnam territory (Lat: 8.18 to 23.40, Lon: 102.10 to 110.00)
const VIETNAM_SOUTH_WEST = L.latLng(8.15, 102.10);
const VIETNAM_NORTH_EAST = L.latLng(23.45, 110.00);
const VIETNAM_BOUNDS = L.latLngBounds(VIETNAM_SOUTH_WEST, VIETNAM_NORTH_EAST);

export const InteractiveVietnamPickerMap: React.FC<Props> = ({
  destinations,
  selectedDestinationId,
  onSelectForPlan,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [regionFilter, setRegionFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDest, setActiveDest] = useState<RawDestination | null>(null);

  // Filter destinations based on user controls
  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      if (regionFilter !== 'all') {
        if (regionFilter === 'Miền Nam & ĐBSCL') {
          if (dest.region !== 'Miền Nam' && dest.region !== 'Tây Nam Bộ') return false;
        } else if (dest.region !== regionFilter) {
          return false;
        }
      }

      if (tagFilter !== 'all') {
        if (!dest.tags.includes(tagFilter)) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = dest.name.toLowerCase().includes(q);
        const matchesRegion = dest.region.toLowerCase().includes(q);
        if (!matchesName && !matchesRegion) return false;
      }

      return true;
    });
  }, [destinations, regionFilter, tagFilter, searchQuery]);

  // Initialize Leaflet Map with Strict Vietnam Bounds
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [16.0471, 107.8385], // Center of Vietnam
        zoom: 6,
        minZoom: 6,                 // Disallow zooming out to global view
        maxZoom: 14,
        maxBounds: VIETNAM_BOUNDS,  // Lock view strictly inside Vietnam
        maxBoundsViscosity: 1.0,    // Hard lock preventing dragging outside
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
        bounds: VIETNAM_BOUNDS,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render sleek pins for destinations (No text overlap)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    filteredDestinations.forEach((dest) => {
      if (!dest.coordinates || !dest.coordinates.lat || !dest.coordinates.lon) return;

      const latLng: [number, number] = [dest.coordinates.lat, dest.coordinates.lon];
      const isSelected = dest.id === (activeDest?.id || selectedDestinationId);

      // Category icon
      let iconEmoji = '📍';
      if (dest.tags.includes('beach') || dest.tags.includes('island')) iconEmoji = '🏖️';
      else if (dest.tags.includes('mountain') || dest.tags.includes('pass')) iconEmoji = '⛰️';
      else if (dest.tags.includes('heritage') || dest.tags.includes('culture')) iconEmoji = '🏛️';
      else if (dest.tags.includes('city')) iconEmoji = '🏙️';

      // Sleek circular badge pin without overlapping title
      const pinHtml = `
        <div style="
          width: ${isSelected ? '36px' : '30px'};
          height: ${isSelected ? '36px' : '30px'};
          border-radius: 50%;
          background: ${isSelected ? '#2F7F8F' : '#ffffff'};
          border: 2px solid ${isSelected ? '#E8B56B' : '#2F7F8F'};
          box-shadow: 0 4px 10px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${isSelected ? '16px' : '13px'};
          cursor: pointer;
          transition: transform 0.2s ease;
        " title="${dest.name}">
          ${iconEmoji}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'sleek-vietnam-pin',
        html: pinHtml,
        iconSize: [isSelected ? 36 : 30, isSelected ? 36 : 30],
        iconAnchor: [isSelected ? 18 : 15, isSelected ? 18 : 15],
      });

      const marker = L.marker(latLng, { icon: customIcon }).addTo(markersGroup);

      // Clean tooltip on hover
      marker.bindTooltip(`<strong>${dest.name}</strong><br/><span style="font-size:11px;color:#555;">${dest.region} · ${(dest.avg_daily_cost_vnd / 1000).toLocaleString('vi-VN')}k/ngày</span>`, {
        direction: 'top',
        offset: [0, -16],
        opacity: 0.95,
      });

      marker.on('click', () => {
        setActiveDest(dest);
        map.panTo(latLng, { animate: true, duration: 0.4 });
      });
    });
  }, [filteredDestinations, activeDest, selectedDestinationId]);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
      {/* Top Filter Bar */}
      <div className="border-b border-line bg-white/95 p-4 backdrop-blur-md">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Region Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-muted mr-1">Vùng miền:</span>
            {REGION_FILTERS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRegionFilter(r.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  regionFilter === r.id
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm điểm đến (Đà Lạt, Sa Pa...)..."
              className="w-full rounded-xl border border-line bg-slate-50 px-3 py-1.5 pl-8 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none"
            />
            <span className="absolute left-2.5 top-2 text-xs text-muted">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1.5 text-xs text-muted hover:text-ink"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tag Filters */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-muted mr-1">Chủ đề:</span>
          {TAG_FILTERS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTagFilter(t.id)}
              className={`rounded-lg px-2 py-0.5 text-[11px] font-medium transition-all ${
                tagFilter === t.id
                  ? 'bg-ocean-100 text-brand border border-brand'
                  : 'bg-white border border-line text-muted hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-muted">
            Hiển thị <strong>{filteredDestinations.length}</strong> điểm đến
          </span>
        </div>
      </div>

      {/* Real Map Canvas */}
      <div className="relative">
        <div ref={mapContainerRef} className="h-[520px] w-full z-0" />

        {/* Floating Quick Detail Card when marker is clicked */}
        {activeDest && (
          <div className="absolute bottom-6 left-6 right-6 z-[1000] mx-auto max-w-sm rounded-2xl border border-line bg-white/98 p-4 shadow-raised backdrop-blur-md transition-all md:left-6 md:right-auto md:w-96">
            <div className="flex items-start gap-3">
              <img
                src={getDestinationImage(activeDest.id)}
                alt={activeDest.name}
                className="h-20 w-20 rounded-xl object-cover shadow-sm border border-line"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-ocean-50 px-2 py-0.5 text-[10px] font-semibold text-brand">
                    {activeDest.region}
                  </span>
                  <button
                    onClick={() => setActiveDest(null)}
                    className="text-muted hover:text-ink text-sm p-0.5"
                  >
                    ✕
                  </button>
                </div>
                <h4 className="mt-1 text-base font-bold text-ink truncate">{activeDest.name}</h4>
                <p className="text-xs text-muted mt-0.5">
                  Chi phí: <strong className="text-brand font-semibold">{activeDest.avg_daily_cost_vnd.toLocaleString('vi-VN')}đ / ngày</strong>
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {activeDest.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 pt-3 border-t border-slate-100">
              {onSelectForPlan && (
                <button
                  type="button"
                  onClick={() => onSelectForPlan(activeDest)}
                  className="button-primary w-full py-2 text-xs font-semibold"
                >
                  Lên kế hoạch tới {activeDest.name} ➔
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map Footer Note */}
      <div className="border-t border-line bg-white/90 px-4 py-2 text-center text-[11px] text-muted flex items-center justify-center gap-2">
        <span>🇻🇳 <strong>OpenStreetMap Lãnh thổ Việt Nam</strong> (Đã khóa phạm vi trong nước)</span>
        <span>•</span>
        <span>Rê chuột để xem tên, nhấp để xem chi tiết và lên kế hoạch</span>
      </div>
    </div>
  );
};
