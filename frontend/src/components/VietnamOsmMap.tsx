import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DestinationCardData } from '../types/trip';

interface VietnamOsmMapProps {
  destinations: DestinationCardData[];
  winnerId?: string;
  selectedId?: string;
  origin?: string;
  onSelectDestination?: (id: string) => void;
}

const ORIGIN_COORDS: Record<string, [number, number]> = {
  'ho chi minh': [10.8231, 106.6297],
  'tp. hồ chí minh': [10.8231, 106.6297],
  'tp hcm': [10.8231, 106.6297],
  'hà nội': [21.0285, 105.8542],
  'ha noi': [21.0285, 105.8542],
  'đà nẵng': [16.0544, 108.2022],
  'da nang': [16.0544, 108.2022],
  'cần thơ': [10.0452, 105.7469],
  'can tho': [10.0452, 105.7469],
};

const VIETNAM_BOUNDS = L.latLngBounds(L.latLng(8.15, 102.10), L.latLng(23.45, 110.00));

export const VietnamOsmMap: React.FC<VietnamOsmMapProps> = ({
  destinations,
  winnerId,
  selectedId,
  origin,
  onSelectDestination,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [16.0471, 107.8385], // Center of Vietnam
        zoom: 6,
        minZoom: 6,
        maxZoom: 14,
        maxBounds: VIETNAM_BOUNDS,
        maxBoundsViscosity: 1.0,
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

  // Update Markers and Route when destinations change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    const bounds: L.LatLngExpression[] = [];

    // Origin Marker
    let originLatLng: [number, number] | null = null;
    if (origin) {
      const key = origin.toLowerCase().trim();
      originLatLng = ORIGIN_COORDS[key] || [10.8231, 106.6297];
      bounds.push(originLatLng);

      const originIcon = L.divIcon({
        className: 'custom-origin-icon',
        html: `
          <div style="background: #183238; color: white; padding: 4px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid white; white-space: nowrap;">
            <span>📍</span> Xuất phát: ${origin}
          </div>
        `,
        iconSize: [120, 28],
        iconAnchor: [60, 14],
      });

      L.marker(originLatLng, { icon: originIcon }).addTo(markersGroup);
    }

    let winnerLatLng: [number, number] | null = null;

    destinations.forEach((dest, index) => {
      if (!dest.latitude || !dest.longitude) return;

      const latLng: [number, number] = [dest.latitude, dest.longitude];
      bounds.push(latLng);

      const isWinner = dest.id === winnerId || index === 0;
      const isSelected = dest.id === selectedId;

      if (isWinner) {
        winnerLatLng = latLng;
      }

      const score = Math.round(dest.totalScore * 10);
      const temp = Math.round(dest.avgTempMax ?? 26);
      const rain = dest.avgPrecipitation ?? 0;

      const badgeBg = isWinner
        ? 'linear-gradient(135deg, #2F7F8F 0%, #183238 100%)'
        : isSelected
        ? '#3E8FA0'
        : '#ffffff';
      const textColor = isWinner || isSelected ? '#ffffff' : '#183238';
      const border = isWinner ? '2px solid #E8B56B' : '1px solid rgba(0,0,0,0.15)';

      const markerIcon = L.divIcon({
        className: 'custom-dest-icon',
        html: `
          <div style="
            width: ${isWinner ? '36px' : '30px'};
            height: ${isWinner ? '36px' : '30px'};
            border-radius: 50%;
            background: ${isWinner ? '#E8B56B' : isSelected ? '#2F7F8F' : '#ffffff'};
            color: ${isWinner ? '#ffffff' : isSelected ? '#ffffff' : '#183238'};
            border: 2px solid ${isWinner ? '#ffffff' : '#2F7F8F'};
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isWinner ? '16px' : '12px'};
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            ${isWinner ? '👑' : `#${index + 1}`}
          </div>
        `,
        iconSize: [isWinner ? 36 : 30, isWinner ? 36 : 30],
        iconAnchor: [isWinner ? 18 : 15, isWinner ? 18 : 15],
      });

      const popupContent = document.createElement('div');
      popupContent.style.fontFamily = 'inherit';
      popupContent.style.padding = '4px';
      popupContent.innerHTML = `
        <div style="font-size: 14px; font-weight: 700; color: #183238;">${dest.name}</div>
        <div style="font-size: 11px; color: #667A7E; margin-top: 2px;">${dest.region || 'Việt Nam'}</div>
        <div style="margin-top: 8px; display: flex; justify-content: space-between; font-size: 12px;">
          <span>Điểm MCDA:</span>
          <strong style="color: #2F7F8F;">${score}/100</strong>
        </div>
        <div style="font-size: 12px; margin-top: 4px; display: flex; justify-content: space-between;">
          <span>Chi phí ước tính:</span>
          <strong>${dest.estimatedCostVnd.toLocaleString('vi-VN')}đ</strong>
        </div>
        <div style="font-size: 11px; margin-top: 6px; padding: 4px 6px; background: #EEF7F7; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
          <span>🌤️ ${temp}°C · Mưa ${rain}mm</span>
          <span style="font-size: 9px; font-weight: bold; padding: 2px 4px; border-radius: 4px; background: ${dest.weatherSource?.includes('LIVE') ? '#0284c7' : '#d97706'}; color: white;">
            ${dest.weatherSource?.includes('LIVE') ? 'LIVE' : 'FALLBACK'}
          </span>
        </div>
        <button id="btn-select-${dest.id}" style="margin-top: 10px; width: 100%; padding: 6px 12px; background: #2F7F8F; color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
          Xem chi tiết điểm này
        </button>
      `;

      const marker = L.marker(latLng, { icon: markerIcon }).addTo(markersGroup);
      marker.bindTooltip(`<strong>${dest.name}</strong><br/><span style="font-size:11px;color:#555;">${score}/100 · ${temp}°C</span>`, {
        direction: 'top',
        offset: [0, -18],
      });
      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${dest.id}`);
        if (btn && onSelectDestination) {
          btn.onclick = () => {
            onSelectDestination(dest.id);
            marker.closePopup();
          };
        }
      });
    });

    // Draw route line from Origin to Winner
    if (originLatLng && winnerLatLng) {
      const polyline = L.polyline([originLatLng, winnerLatLng], {
        color: '#2F7F8F',
        weight: 3,
        opacity: 0.85,
        dashArray: '8, 8',
      }).addTo(map);
      routeLayerRef.current = polyline;
    }

    // Auto-fit bounds if we have points
    if (bounds.length > 0) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [50, 50], maxZoom: 9 });
    }
  }, [destinations, winnerId, selectedId, origin, onSelectDestination]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-line bg-ocean-50 shadow-soft">
      {/* Map Header Overlay */}
      <div className="absolute left-4 top-4 z-[1000] flex flex-wrap items-center gap-2 rounded-xl bg-white/95 px-3.5 py-2 text-xs font-medium text-ink shadow-md backdrop-blur-sm">
        <span className="flex items-center gap-1.5 text-brand">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <strong>OpenStreetMap Việt Nam</strong>
        </span>
        <span className="text-muted">•</span>
        <span className="text-muted">{destinations.length} điểm đến trên toàn quốc</span>
      </div>

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="h-[460px] w-full z-0" />
    </div>
  );
};
