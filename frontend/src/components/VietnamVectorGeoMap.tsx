import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RawDestination } from '../api/tripApi';
import { getDestinationImage } from '../data/destinationVisuals';
import { DestinationCardData } from '../types/trip';
import provincesGeoJson from '../data/vietnam-provinces.json';

type DestinationItem = RawDestination | DestinationCardData;

interface Props {
  destinations: DestinationItem[];
  selectedId?: string;
  winnerId?: string;
  origin?: string;
  onSelectDestination?: (id: string) => void;
  onSelectForPlan?: (destination: RawDestination) => void;
}

// Bounding box strictly encompassing Vietnam mainland and maritime archipelagos
const BOUNDS = {
  minLon: 101.5,
  maxLon: 117.2,
  minLat: 7.2,
  maxLat: 24.0,
};

const SVG_WIDTH = 900;
const SVG_HEIGHT = 1000;

// Mathematical Mercator projection function (GPS WGS84 to SVG Canvas)
function project(lon: number, lat: number): [number, number] {
  const x = ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * SVG_WIDTH;

  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));

  const minLatRad = (BOUNDS.minLat * Math.PI) / 180;
  const minMercN = Math.log(Math.tan(Math.PI / 4 + minLatRad / 2));

  const maxLatRad = (BOUNDS.maxLat * Math.PI) / 180;
  const maxMercN = Math.log(Math.tan(Math.PI / 4 + maxLatRad / 2));

  const y = SVG_HEIGHT - ((mercN - minMercN) / (maxMercN - minMercN)) * SVG_HEIGHT;
  return [Number(x.toFixed(1)), Number(y.toFixed(1))];
}

// Region categorization helper for 63 provinces
function getProvinceRegion(name: string): string {
  const n = name.toLowerCase();
  if (
    n.includes('hà nội') || n.includes('quảng ninh') || n.includes('hải phòng') ||
    n.includes('bắc') || n.includes('phú thọ') || n.includes('vĩnh phúc') ||
    n.includes('thái nguyên') || n.includes('lào cai') || n.includes('yên bái') ||
    n.includes('hà giang') || n.includes('tuyên quang') || n.includes('cao bằng') ||
    n.includes('lạng sơn') || n.includes('điện biên') || n.includes('lai châu') ||
    n.includes('sơn la') || n.includes('hòa bình') || n.includes('hà nam') ||
    n.includes('nam định') || n.includes('ninh bình') || n.includes('thái bình') ||
    n.includes('hưng yên') || n.includes('hải dương')
  ) {
    return 'Miền Bắc';
  }
  if (
    n.includes('kon tum') || n.includes('gia lai') || n.includes('đắk') ||
    n.includes('lâm đồng')
  ) {
    return 'Tây Nguyên';
  }
  if (
    n.includes('thanh hóa') || n.includes('nghệ an') || n.includes('hà tĩnh') ||
    n.includes('quảng bình') || n.includes('quảng trị') || n.includes('huế') ||
    n.includes('đà nẵng') || n.includes('quảng nam') || n.includes('quảng ngãi') ||
    n.includes('bình định') || n.includes('phú yên') || n.includes('khánh hòa') ||
    n.includes('ninh thuận') || n.includes('bình thuận')
  ) {
    return 'Miền Trung';
  }
  return 'Miền Nam';
}

// Color palettes for Light (Bright) and Dark Themes
const REGION_COLORS_LIGHT: Record<string, { fill: string; stroke: string; glow: string; label: string; hoverFill: string }> = {
  'Miền Bắc': {
    fill: '#bfdbfe',        // soft crisp blue
    stroke: '#1d4ed8',      // deep blue border
    glow: 'rgba(59, 130, 246, 0.25)',
    label: 'text-blue-700',
    hoverFill: '#93c5fd',
  },
  'Miền Trung': {
    fill: '#99f6e4',        // soft refreshing teal
    stroke: '#0f766e',      // deep teal border
    glow: 'rgba(13, 148, 136, 0.25)',
    label: 'text-teal-700',
    hoverFill: '#5eead4',
  },
  'Tây Nguyên': {
    fill: '#bbf7d0',        // soft highland green
    stroke: '#15803d',      // forest green border
    glow: 'rgba(22, 163, 74, 0.25)',
    label: 'text-emerald-700',
    hoverFill: '#86efac',
  },
  'Miền Nam': {
    fill: '#fecdd3',        // soft warm coral/rose
    stroke: '#be123c',      // deep crimson border
    glow: 'rgba(225, 29, 72, 0.25)',
    label: 'text-rose-700',
    hoverFill: '#fda4af',
  },
};

const REGION_COLORS_DARK: Record<string, { fill: string; stroke: string; glow: string; label: string; hoverFill: string }> = {
  'Miền Bắc': {
    fill: '#1e293b',
    stroke: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.3)',
    label: 'text-blue-400',
    hoverFill: '#334155',
  },
  'Miền Trung': {
    fill: '#132e35',
    stroke: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.3)',
    label: 'text-cyan-400',
    hoverFill: '#164e63',
  },
  'Tây Nguyên': {
    fill: '#1f2d24',
    stroke: '#10b981',
    glow: 'rgba(16, 185, 129, 0.3)',
    label: 'text-emerald-400',
    hoverFill: '#14532d',
  },
  'Miền Nam': {
    fill: '#2a1b2d',
    stroke: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.3)',
    label: 'text-rose-400',
    hoverFill: '#4c1d34',
  },
};

const REGION_FILTERS = [
  { id: 'all', label: 'Toàn quốc (23)' },
  { id: 'Miền Bắc', label: 'Miền Bắc' },
  { id: 'Miền Trung', label: 'Miền Trung' },
  { id: 'Tây Nguyên', label: 'Tây Nguyên' },
  { id: 'Miền Nam', label: 'Miền Nam & ĐBSCL' },
];

const TAG_FILTERS = [
  { id: 'all', label: 'Tất cả chủ đề' },
  { id: 'beach', label: '🏖️ Biển đảo' },
  { id: 'mountain', label: '⛰️ Vùng núi' },
  { id: 'heritage', label: '🏛️ Di sản & Văn hóa' },
  { id: 'food', label: '🍜 Ẩm thực' },
];

export const VietnamVectorGeoMap: React.FC<Props> = ({
  destinations,
  selectedId,
  winnerId,
  origin,
  onSelectDestination,
  onSelectForPlan,
}) => {
  // Theme state: Bright / Light mode is DEFAULT as requested
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [regionFilter, setRegionFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [hoveredDest, setHoveredDest] = useState<DestinationItem | null>(null);
  const [activeDest, setActiveDest] = useState<DestinationItem | null>(null);

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragMoved, setDragMoved] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  const regionColorMap = theme === 'light' ? REGION_COLORS_LIGHT : REGION_COLORS_DARK;

  // Wheel zoom with passive: false to prevent outer window scroll
  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      setZoomLevel((prev) => {
        const next = Math.max(0.6, Math.min(prev * zoomFactor, 4.5));
        return Number(next.toFixed(2));
      });
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary button
    setIsDragging(true);
    setDragMoved(false);
    setDragStart({
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    if (Math.abs(newX - panOffset.x) > 4 || Math.abs(newY - panOffset.y) > 4) {
      setDragMoved(true);
    }
    setPanOffset({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragMoved(false);
      setDragStart({
        x: e.touches[0].clientX - panOffset.x,
        y: e.touches[0].clientY - panOffset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const newX = e.touches[0].clientX - dragStart.x;
    const newY = e.touches[0].clientY - dragStart.y;
    if (Math.abs(newX - panOffset.x) > 4 || Math.abs(newY - panOffset.y) > 4) {
      setDragMoved(true);
    }
    setPanOffset({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Precompute SVG paths for 63 provinces from GeoJSON
  interface ProvincePath {
    id: any;
    name: string;
    region: string;
    path: string;
  }

  const provincePaths: ProvincePath[] = useMemo(() => {
    return (provincesGeoJson as any).features.map((feature: any, idx: number): ProvincePath => {
      const name = feature.properties.name || `Tỉnh ${idx + 1}`;
      const region = getProvinceRegion(name);
      const geom = feature.geometry;

      let pathString = '';
      if (geom.type === 'Polygon') {
        pathString = geom.coordinates
          .map((ring: number[][]) => 'M ' + ring.map(([lon, lat]) => project(lon, lat).join(',')).join(' L ') + ' Z')
          .join(' ');
      } else if (geom.type === 'MultiPolygon') {
        pathString = geom.coordinates
          .map((poly: number[][][]) =>
            poly.map((ring: number[][]) => 'M ' + ring.map(([lon, lat]) => project(lon, lat).join(',')).join(' L ') + ' Z').join(' ')
          )
          .join(' ');
      }

      return {
        id: feature.properties.cartodb_id || idx,
        name,
        region,
        path: pathString,
      };
    });
  }, []);

  // Filtered destination list
  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const region = 'region' in dest ? dest.region : '';
      if (regionFilter !== 'all') {
        if (regionFilter === 'Miền Nam') {
          if (region !== 'Miền Nam' && region !== 'Tây Nam Bộ') return false;
        } else if (region !== regionFilter) {
          return false;
        }
      }

      const tags = 'tags' in dest ? dest.tags : [];
      if (tagFilter !== 'all' && !tags.includes(tagFilter)) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = dest.name.toLowerCase().includes(q);
        const matchesRegion = Boolean(region && region.toLowerCase().includes(q));
        if (!matchesName && !matchesRegion) return false;
      }

      return true;
    });
  }, [destinations, regionFilter, tagFilter, searchQuery]);

  // Destination coordinates resolution helper
  const getCoords = (dest: DestinationItem): [number, number] | null => {
    if ('coordinates' in dest && dest.coordinates) {
      return [dest.coordinates.lon, dest.coordinates.lat];
    }
    if ('longitude' in dest && 'latitude' in dest) {
      return [(dest as any).longitude, (dest as any).latitude];
    }
    return null;
  };

  // Helper to get category icon
  const getCategoryIcon = (dest: DestinationItem) => {
    const tags = 'tags' in dest ? dest.tags : [];
    if (tags.includes('beach') || tags.includes('island')) return '🏖️';
    if (tags.includes('mountain') || tags.includes('trekking') || tags.includes('pass')) return '⛰️';
    if (tags.includes('heritage') || tags.includes('culture') || tags.includes('temple')) return '🏛️';
    if (tags.includes('food')) return '🍜';
    return '🏙️';
  };

  // Helper for destination click
  const handleDestinationClick = (dest: DestinationItem, e?: React.MouseEvent) => {
    if (dragMoved) return; // Ignore clicks if user was panning
    e?.stopPropagation();
    setActiveDest(dest);
    if (onSelectDestination) {
      onSelectDestination(dest.id);
    }
  };

  // Origin coords for geodesic flight route
  const originCoords: [number, number] | null = useMemo(() => {
    if (!origin) return null;
    const o = origin.toLowerCase();
    if (o.includes('hồ chí minh') || o.includes('hcm')) return [106.6297, 10.8231];
    if (o.includes('hà nội')) return [105.8542, 21.0285];
    if (o.includes('đà nẵng')) return [108.2022, 16.0544];
    if (o.includes('cần thơ')) return [105.7469, 10.0452];
    return [106.6297, 10.8231];
  }, [origin]);

  const originSvgPoint = originCoords ? project(originCoords[0], originCoords[1]) : null;

  // Selected or active destination point
  const activeDestPoint = useMemo(() => {
    const target = activeDest || destinations.find((d) => d.id === selectedId);
    if (!target) return null;
    const coords = getCoords(target);
    if (!coords) return null;
    return project(coords[0], coords[1]);
  }, [activeDest, selectedId, destinations]);

  return (
    <div
      className={`relative flex flex-col rounded-3xl border transition-colors duration-300 shadow-xl overflow-hidden ${
        theme === 'light'
          ? 'border-slate-200/90 bg-white text-slate-800'
          : 'border-slate-800 bg-[#0b1120] text-slate-100'
      }`}
    >
      {/* Top Header & Interactive Filter Bar */}
      <div
        className={`z-10 border-b px-4 py-3 backdrop-blur-md transition-colors duration-300 ${
          theme === 'light'
            ? 'border-slate-200/80 bg-white/95 text-slate-800'
            : 'border-slate-800/80 bg-slate-900/90 text-white'
        }`}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className={`text-sm font-bold tracking-wide uppercase ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                Bản đồ Du lịch Quyết định Toàn cảnh Việt Nam
              </h3>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                  theme === 'light'
                    ? 'bg-sky-50 text-sky-700 border-sky-300'
                    : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                }`}
              >
                100% Lãnh thổ & Biển đảo VN
              </span>
            </div>
            <p className={`mt-0.5 text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
              Cuộn chuột để phóng to · Giữ chuột kéo thả để di chuyển · Nhấp điểm đến để xem phân tích
            </p>
          </div>

          {/* Search Box & Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm điểm đến (Đà Lạt, Sa Pa...)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-44 sm:w-48 rounded-xl border px-3 py-1.5 text-xs transition-colors focus:outline-none focus:ring-1 ${
                  theme === 'light'
                    ? 'border-slate-300 bg-slate-50 text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500'
                    : 'border-slate-700 bg-slate-800/90 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Zoom Controls */}
            <div
              className={`flex items-center rounded-xl border p-0.5 shadow-sm ${
                theme === 'light'
                  ? 'border-slate-200 bg-slate-100 text-slate-700'
                  : 'border-slate-700 bg-slate-800/90 text-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(Number((z + 0.25).toFixed(2)), 4.0))}
                title="Phóng to (hoặc cuộn chuột lên)"
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  theme === 'light' ? 'hover:bg-white text-slate-800' : 'hover:bg-slate-700 text-white'
                }`}
              >
                +
              </button>
              <span className="px-1 text-[11px] font-semibold opacity-75">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(Number((z - 0.25).toFixed(2)), 0.6))}
                title="Thu nhỏ (hoặc cuộn chuột xuống)"
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  theme === 'light' ? 'hover:bg-white text-slate-800' : 'hover:bg-slate-700 text-white'
                }`}
              >
                -
              </button>
              <button
                type="button"
                onClick={() => {
                  setZoomLevel(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
                title="Đặt lại vị trí ban đầu"
                className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                  theme === 'light' ? 'hover:bg-white text-slate-800' : 'hover:bg-slate-700 text-white'
                }`}
              >
                ↺
              </button>
            </div>

            {/* Theme Toggle Button (Light / Dark) */}
            <button
              type="button"
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              title={theme === 'light' ? 'Chuyển sang giao diện Tối' : 'Chuyển sang giao diện Sáng'}
              className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold shadow-sm transition-all ${
                theme === 'light'
                  ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                  : 'border-cyan-500/40 bg-slate-800 text-cyan-300 hover:bg-slate-700'
              }`}
            >
              {theme === 'light' ? (
                <>
                  <span className="text-sm">☀️</span>
                  <span className="hidden sm:inline">Sáng</span>
                </>
              ) : (
                <>
                  <span className="text-sm">🌙</span>
                  <span className="hidden sm:inline">Tối</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Region & Tag Filter Buttons */}
        <div
          className={`mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs ${
            theme === 'light' ? 'border-slate-200/80' : 'border-slate-800/60'
          }`}
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[11px] font-semibold mr-1 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              Khu vực:
            </span>
            {REGION_FILTERS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRegionFilter(r.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  regionFilter === r.id
                    ? theme === 'light'
                      ? 'bg-sky-600 text-white font-semibold shadow-sm shadow-sky-600/30'
                      : 'bg-cyan-500 text-slate-950 font-semibold shadow-sm shadow-cyan-500/30'
                    : theme === 'light'
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {TAG_FILTERS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTagFilter(t.id)}
                className={`rounded-lg px-2 py-1 text-[11px] font-medium transition-all ${
                  tagFilter === t.id
                    ? theme === 'light'
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                      : 'bg-emerald-500 text-slate-950 font-semibold'
                    : theme === 'light'
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    : 'bg-slate-800/40 text-slate-400 hover:bg-slate-700/60'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main SVG Vector Canvas Container with Drag & Wheel Zoom */}
      <div
        ref={mapContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative h-[680px] w-full overflow-hidden select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${
          theme === 'light'
            ? 'bg-gradient-to-b from-[#e0f2fe] via-[#f0fdfa] to-[#e6f4fa]'
            : 'bg-gradient-to-b from-[#070b14] via-[#09101e] to-[#060a12]'
        }`}
      >
        {/* Decorative Ocean Coordinate Grid */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="45" height="45" patternUnits="userSpaceOnUse">
              <path
                d="M 45 0 L 0 0 0 45"
                fill="none"
                stroke={theme === 'light' ? '#0284c7' : '#38bdf8'}
                strokeWidth="0.5"
                strokeOpacity={theme === 'light' ? '0.15' : '0.1'}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>

        {/* Vietnam SVG Layer */}
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="h-full w-full pointer-events-auto"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: '40% 50%',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <defs>
            {/* Glow Filters */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-gold" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Watermark: BIỂN ĐÔNG VIỆT NAM, VỊNH BẮC BỘ, VỊNH THÁI LAN */}
          <g className="pointer-events-none">
            <text
              x="680"
              y="620"
              textAnchor="middle"
              className="text-[28px] font-extrabold tracking-[0.4em] uppercase"
              style={{
                letterSpacing: '0.35em',
                fontFamily: 'system-ui, sans-serif',
                fill: theme === 'light' ? '#0369a1' : '#38bdf8',
                fillOpacity: theme === 'light' ? 0.22 : 0.12,
              }}
            >
              BIỂN ĐÔNG
            </text>
            <text
              x="680"
              y="650"
              textAnchor="middle"
              className="text-[13px] font-semibold tracking-[0.25em] uppercase"
              style={{
                fill: theme === 'light' ? '#0284c7' : '#22d3ee',
                fillOpacity: theme === 'light' ? 0.25 : 0.12,
              }}
            >
              VIETNAM EAST SEA
            </text>
            <text
              x="180"
              y="870"
              textAnchor="middle"
              className="text-[14px] font-semibold tracking-[0.2em] uppercase"
              style={{
                fill: theme === 'light' ? '#0369a1' : '#22d3ee',
                fillOpacity: theme === 'light' ? 0.25 : 0.15,
              }}
            >
              VỊNH THÁI LAN
            </text>
            <text
              x="390"
              y="220"
              textAnchor="middle"
              className="text-[15px] font-semibold tracking-[0.2em] uppercase"
              style={{
                fill: theme === 'light' ? '#0369a1' : '#22d3ee',
                fillOpacity: theme === 'light' ? 0.25 : 0.15,
              }}
            >
              VỊNH BẮC BỘ
            </text>
          </g>

          {/* Flight Route Line (from Origin to Selected Destination) */}
          {originSvgPoint && activeDestPoint && (
            <g className="pointer-events-none">
              <path
                d={`M ${originSvgPoint[0]} ${originSvgPoint[1]} Q ${(originSvgPoint[0] + activeDestPoint[0]) / 2 + 30} ${(originSvgPoint[1] + activeDestPoint[1]) / 2 - 40} ${activeDestPoint[0]} ${activeDestPoint[1]}`}
                fill="none"
                stroke={theme === 'light' ? '#0284c7' : '#38bdf8'}
                strokeWidth={theme === 'light' ? '3' : '2.5'}
                strokeDasharray="6,6"
                className="opacity-90"
              />
              <circle
                cx={activeDestPoint[0]}
                cy={activeDestPoint[1]}
                r="16"
                fill="none"
                stroke={theme === 'light' ? '#0284c7' : '#38bdf8'}
                strokeWidth="1.5"
                className="animate-ping"
                opacity="0.4"
              />
            </g>
          )}

          {/* 63 Provinces (Official GIS Geometry) */}
          <g className="provinces-layer">
            {provincePaths.map((prov) => {
              const isHovered = hoveredProvince === prov.name;
              const style = regionColorMap[prov.region] || regionColorMap['Miền Bắc'];
              const isRegionDimmed =
                regionFilter !== 'all' &&
                regionFilter !== prov.region &&
                !(regionFilter === 'Miền Nam' && prov.region === 'Tây Nam Bộ');

              return (
                <path
                  key={prov.id}
                  d={prov.path}
                  fill={isHovered ? style.hoverFill : style.fill}
                  stroke={isHovered ? (theme === 'light' ? '#0f172a' : '#38bdf8') : style.stroke}
                  strokeWidth={isHovered ? '2.0' : theme === 'light' ? '0.9' : '0.7'}
                  strokeOpacity={isRegionDimmed ? 0.2 : 0.9}
                  fillOpacity={isRegionDimmed ? 0.15 : isHovered ? 1 : theme === 'light' ? 0.85 : 0.65}
                  className="transition-colors duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredProvince(prov.name)}
                  onMouseLeave={() => setHoveredProvince(null)}
                />
              );
            })}
          </g>

          {/* ============================================================ */}
          {/* QUẦN ĐẢO HOÀNG SA (TP. ĐÀ NẴNG)                              */}
          {/* ============================================================ */}
          <g className="hoang-sa-archipelago cursor-default">
            {/* Archipelago Bounding Box */}
            <rect
              x="535"
              y="390"
              width="150"
              height="115"
              rx="8"
              fill={theme === 'light' ? 'rgba(2, 132, 199, 0.06)' : 'rgba(6, 182, 212, 0.04)'}
              stroke={theme === 'light' ? '#0284c7' : 'rgba(6, 182, 212, 0.35)'}
              strokeWidth="1.2"
              strokeDasharray="4,4"
            />
            {/* Islands reef clusters */}
            <g fill={theme === 'light' ? '#0284c7' : '#38bdf8'} stroke={theme === 'light' ? '#0369a1' : '#0ea5e9'} strokeWidth="0.8">
              <circle cx="560" cy="425" r="3.5" />
              <circle cx="585" cy="415" r="4.2" />
              <circle cx="615" cy="420" r="3.0" />
              <circle cx="640" cy="445" r="4.5" />
              <circle cx="620" cy="460" r="3.2" />
              <circle cx="590" cy="470" r="3.8" />
              <circle cx="565" cy="455" r="2.8" />
            </g>
            {/* Patriotic Title Banner */}
            <rect
              x="542"
              y="474"
              width="136"
              height="24"
              rx="5"
              fill={theme === 'light' ? '#ffffff' : '#0f172a'}
              stroke={theme === 'light' ? '#0284c7' : '#38bdf8'}
              strokeWidth={theme === 'light' ? '1.2' : '0.8'}
              className="drop-shadow-sm"
            />
            <text
              x="610"
              y="485"
              textAnchor="middle"
              className="text-[9.5px] font-bold"
              style={{ fill: theme === 'light' ? '#0369a1' : '#a5f3fc' }}
            >
              QUẦN ĐẢO HOÀNG SA
            </text>
            <text
              x="610"
              y="495"
              textAnchor="middle"
              className="text-[8px] font-semibold"
              style={{ fill: theme === 'light' ? '#0284c7' : '#22d3ee' }}
            >
              (TP. ĐÀ NẴNG - VIỆT NAM)
            </text>
          </g>

          {/* ============================================================ */}
          {/* QUẦN ĐẢO TRƯỜNG SA (TỈNH KHÁNH HÒA)                         */}
          {/* ============================================================ */}
          <g className="truong-sa-archipelago cursor-default">
            {/* Archipelago Bounding Box */}
            <rect
              x="630"
              y="740"
              width="180"
              height="190"
              rx="8"
              fill={theme === 'light' ? 'rgba(2, 132, 199, 0.06)' : 'rgba(6, 182, 212, 0.04)'}
              stroke={theme === 'light' ? '#0284c7' : 'rgba(6, 182, 212, 0.35)'}
              strokeWidth="1.2"
              strokeDasharray="4,4"
            />
            {/* Islands reef clusters */}
            <g fill={theme === 'light' ? '#0284c7' : '#38bdf8'} stroke={theme === 'light' ? '#0369a1' : '#0ea5e9'} strokeWidth="0.8">
              <circle cx="660" cy="770" r="3.8" />
              <circle cx="710" cy="765" r="4.0" />
              <circle cx="760" cy="785" r="3.5" />
              <circle cx="775" cy="830" r="4.5" />
              <circle cx="740" cy="845" r="3.2" />
              <circle cx="690" cy="860" r="4.2" />
              <circle cx="720" cy="895" r="3.5" />
              <circle cx="665" cy="890" r="3.0" />
              <circle cx="750" cy="910" r="2.8" />
            </g>
            {/* Patriotic Title Banner */}
            <rect
              x="648"
              y="898"
              width="144"
              height="24"
              rx="5"
              fill={theme === 'light' ? '#ffffff' : '#0f172a'}
              stroke={theme === 'light' ? '#0284c7' : '#38bdf8'}
              strokeWidth={theme === 'light' ? '1.2' : '0.8'}
              className="drop-shadow-sm"
            />
            <text
              x="720"
              y="909"
              textAnchor="middle"
              className="text-[9.5px] font-bold"
              style={{ fill: theme === 'light' ? '#0369a1' : '#a5f3fc' }}
            >
              QUẦN ĐẢO TRƯỜNG SA
            </text>
            <text
              x="720"
              y="919"
              textAnchor="middle"
              className="text-[8px] font-semibold"
              style={{ fill: theme === 'light' ? '#0284c7' : '#22d3ee' }}
            >
              (TỈNH KHÁNH HÒA - VIỆT NAM)
            </text>
          </g>

          {/* CÔN ĐẢO & PHÚ QUỐC SOVEREIGNTY LABELS */}
          <g className="island-labels pointer-events-none">
            <text
              x="135"
              y="810"
              textAnchor="middle"
              className="text-[9.5px] font-bold drop-shadow-sm"
              style={{ fill: theme === 'light' ? '#0369a1' : '#67e8f9' }}
            >
              ĐẢO PHÚ QUỐC
            </text>
            <text
              x="310"
              y="915"
              textAnchor="middle"
              className="text-[9.5px] font-bold drop-shadow-sm"
              style={{ fill: theme === 'light' ? '#0369a1' : '#67e8f9' }}
            >
              CÔN ĐẢO
            </text>
          </g>

          {/* Origin Point Marker (e.g. TP.HCM) */}
          {originSvgPoint && (
            <g className="origin-marker pointer-events-none">
              <circle cx={originSvgPoint[0]} cy={originSvgPoint[1]} r="14" fill="#10b981" fillOpacity="0.25" className="animate-pulse" />
              <circle cx={originSvgPoint[0]} cy={originSvgPoint[1]} r="6.5" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
              <rect
                x={originSvgPoint[0] - 45}
                y={originSvgPoint[1] + 8}
                width="90"
                height="18"
                rx="4"
                fill={theme === 'light' ? '#065f46' : '#064e3b'}
                stroke="#10b981"
                strokeWidth="1"
                className="drop-shadow-sm"
              />
              <text x={originSvgPoint[0]} y={originSvgPoint[1] + 20} textAnchor="middle" className="text-[9px] font-bold fill-emerald-100">
                🚩 {origin} (Điểm đi)
              </text>
            </g>
          )}

          {/* 23 Destination Pins (Pulsing Glow Markers) */}
          <g className="destination-markers">
            {filteredDestinations.map((dest) => {
              const coords = getCoords(dest);
              if (!coords) return null;
              const [x, y] = project(coords[0], coords[1]);

              const isWinner = dest.id === winnerId;
              const isSelected = dest.id === selectedId || dest.id === activeDest?.id;
              const isHovered = hoveredDest?.id === dest.id;
              const icon = getCategoryIcon(dest);

              return (
                <g
                  key={dest.id}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={(e) => handleDestinationClick(dest, e)}
                  onMouseEnter={() => setHoveredDest(dest)}
                  onMouseLeave={() => setHoveredDest(null)}
                >
                  {/* Outer Pulsing Glow on Selected / Winner */}
                  {(isSelected || isWinner) && (
                    <circle
                      cx={x}
                      cy={y}
                      r={isWinner ? 22 : 18}
                      fill={isWinner ? '#f59e0b' : theme === 'light' ? '#0284c7' : '#38bdf8'}
                      fillOpacity={theme === 'light' ? 0.35 : 0.25}
                      className="animate-ping"
                    />
                  )}

                  {/* Marker Pin Base */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 14 : isWinner ? 13 : isHovered ? 12 : 9.5}
                    fill={
                      isWinner
                        ? '#f59e0b'
                        : isSelected
                        ? theme === 'light'
                          ? '#0284c7'
                          : '#0284c7'
                        : theme === 'light'
                        ? '#ffffff'
                        : '#0f172a'
                    }
                    stroke={
                      isWinner
                        ? '#b45309'
                        : isSelected
                        ? theme === 'light'
                          ? '#0369a1'
                          : '#38bdf8'
                        : theme === 'light'
                        ? '#334155'
                        : '#64748b'
                    }
                    strokeWidth={isSelected || isWinner ? 2.5 : 1.5}
                    className="drop-shadow-md transition-all duration-200"
                  />

                  {/* Icon Emoji */}
                  <text
                    x={x}
                    y={y + (isSelected ? 4.5 : 3.5)}
                    textAnchor="middle"
                    className={`${isSelected ? 'text-[12px]' : 'text-[9.5px]'} pointer-events-none select-none`}
                  >
                    {isWinner ? '👑' : icon}
                  </text>

                  {/* Label Tag (Always visible for winner/selected, or on hover / deep zoom) */}
                  {(isSelected || isWinner || isHovered || zoomLevel > 1.3) && (
                    <g className="pointer-events-none">
                      <rect
                        x={x - 42}
                        y={y - 28}
                        width="84"
                        height="18"
                        rx="5"
                        fill={
                          isWinner
                            ? theme === 'light'
                              ? '#fef3c7'
                              : '#78350f'
                            : isSelected
                            ? theme === 'light'
                              ? '#e0f2fe'
                              : '#0369a1'
                            : theme === 'light'
                            ? '#ffffff'
                            : '#0f172a'
                        }
                        stroke={
                          isWinner
                            ? '#f59e0b'
                            : isSelected
                            ? '#0284c7'
                            : theme === 'light'
                            ? '#cbd5e1'
                            : '#334155'
                        }
                        strokeWidth="1"
                        className="drop-shadow-md"
                      />
                      <text
                        x={x}
                        y={y - 15}
                        textAnchor="middle"
                        className="text-[10px] font-bold"
                        style={{
                          fill:
                            isWinner
                              ? '#92400e'
                              : isSelected
                              ? '#0369a1'
                              : theme === 'light'
                              ? '#0f172a'
                              : '#ffffff',
                        }}
                      >
                        {dest.name.split(' (')[0]}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating Quick Action Overlay: Mouse/Pan Hint */}
        <div
          className={`absolute bottom-3 right-3 z-10 flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[11px] font-medium shadow-md backdrop-blur-md transition-opacity pointer-events-none opacity-80 hover:opacity-100 ${
            theme === 'light'
              ? 'border-slate-200 bg-white/90 text-slate-600'
              : 'border-slate-800 bg-slate-900/90 text-slate-300'
          }`}
        >
          <span>🖱️ Cuộn chuột để phóng to</span>
          <span>·</span>
          <span>🖐️ Giữ chuột kéo để di chuyển</span>
        </div>

        {/* Floating Province Tooltip */}
        {hoveredProvince && (
          <div
            className={`absolute top-4 left-4 z-20 rounded-xl border px-3 py-1.5 text-xs shadow-lg backdrop-blur-md ${
              theme === 'light'
                ? 'border-slate-300 bg-white/95 text-slate-800'
                : 'border-slate-700 bg-slate-900/90 text-slate-200'
            }`}
          >
            <span className={`font-bold ${theme === 'light' ? 'text-sky-700' : 'text-cyan-400'}`}>
              {hoveredProvince}
            </span>
            <span className={`ml-2 text-[10px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
              ({getProvinceRegion(hoveredProvince)})
            </span>
          </div>
        )}

        {/* Floating Quick Detail Bottom Card (When destination is clicked) */}
        {activeDest && (
          <div
            className={`absolute bottom-4 left-4 right-4 z-30 mx-auto max-w-xl rounded-2xl border p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200 ${
              theme === 'light'
                ? 'border-sky-300/80 bg-white/98 text-slate-800'
                : 'border-cyan-500/40 bg-slate-900/95 text-slate-100'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <img
                  src={getDestinationImage(activeDest.id)}
                  alt={activeDest.name}
                  className="h-16 w-20 rounded-xl object-cover border border-slate-200 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{getCategoryIcon(activeDest)}</span>
                    <h4 className={`text-base font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      {activeDest.name}
                    </h4>
                    {activeDest.id === winnerId && (
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-400/40">
                        👑 Đề xuất số 1
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    {'region' in activeDest ? activeDest.region : 'Việt Nam'} ·{' '}
                    {'avg_daily_cost_vnd' in activeDest
                      ? `~${(activeDest.avg_daily_cost_vnd / 1000).toLocaleString('vi-VN')}k VNĐ/ngày`
                      : 'avgDailyCostVnd' in activeDest
                      ? `~${((activeDest as any).avgDailyCostVnd / 1000).toLocaleString('vi-VN')}k VNĐ/ngày`
                      : 'Chi phí linh hoạt'}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {('tags' in activeDest ? activeDest.tags : []).slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                          theme === 'light'
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveDest(null)}
                className={`rounded-lg p-1 transition-colors ${
                  theme === 'light' ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-700' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title="Đóng"
              >
                ✕
              </button>
            </div>

            {/* Action Buttons */}
            <div
              className={`mt-3.5 flex items-center justify-end gap-2 border-t pt-3 ${
                theme === 'light' ? 'border-slate-100' : 'border-slate-800/80'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  if (onSelectDestination) onSelectDestination(activeDest.id);
                  setActiveDest(null);
                }}
                className={`rounded-xl border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  theme === 'light'
                    ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                Xem chi tiết điểm đến
              </button>
              {onSelectForPlan && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectForPlan(activeDest as RawDestination);
                  }}
                  className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-sky-600/20 hover:from-sky-500 hover:to-blue-500 transition-all"
                >
                  Lên kế hoạch tới {activeDest.name.split(' (')[0]} ➔
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 border-t px-4 py-2.5 text-xs transition-colors duration-300 ${
          theme === 'light'
            ? 'border-slate-200 bg-slate-50/90 text-slate-600'
            : 'border-slate-800/80 bg-slate-950/70 text-slate-400'
        }`}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <span className={`font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-slate-300'}`}>
            Chú giải:
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`h-3 w-3 rounded-full ${
                theme === 'light' ? 'bg-blue-300 border border-blue-600' : 'bg-blue-500/60 border border-blue-400'
              }`}
            />
            <span className={theme === 'light' ? 'font-medium text-slate-700' : ''}>Miền Bắc</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`h-3 w-3 rounded-full ${
                theme === 'light' ? 'bg-teal-300 border border-teal-600' : 'bg-cyan-500/60 border border-cyan-400'
              }`}
            />
            <span className={theme === 'light' ? 'font-medium text-slate-700' : ''}>Miền Trung</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`h-3 w-3 rounded-full ${
                theme === 'light' ? 'bg-emerald-300 border border-emerald-600' : 'bg-emerald-500/60 border border-emerald-400'
              }`}
            />
            <span className={theme === 'light' ? 'font-medium text-slate-700' : ''}>Tây Nguyên</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`h-3 w-3 rounded-full ${
                theme === 'light' ? 'bg-rose-300 border border-rose-600' : 'bg-rose-500/60 border border-rose-400'
              }`}
            />
            <span className={theme === 'light' ? 'font-medium text-slate-700' : ''}>Miền Nam</span>
          </div>
        </div>

        <div className={`flex items-center gap-3 text-[11px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
          <span className="font-medium">🇻🇳 Khẳng định chủ quyền Hoàng Sa & Trường Sa</span>
          <span>·</span>
          <span>📍 23 điểm đến WGS84</span>
        </div>
      </div>
    </div>
  );
};
