import { getDestinationImage } from '../data/destinationVisuals';
import { DestinationCardData } from '../types/trip';
import { TravelImage } from './TravelImage';

interface DestinationCardProps {
  destination: DestinationCardData;
  rank: number;
  numDays: number;
  selected: boolean;
  transportName?: string;
  onSelect: () => void;
}

export function DestinationCard({ destination, rank, numDays, selected, transportName, onSelect }: DestinationCardProps) {
  return (
    <article className={`destination-tile flex h-full flex-col ${selected ? '!border-ocean-400' : ''}`}>
      <div className="relative">
        <TravelImage src={getDestinationImage(destination.id)} alt={`Ảnh phong cảnh minh họa cho ${destination.name}`} className="destination-card-image" />
        <span className="absolute left-3 top-3 rounded-md border border-white/70 bg-white px-2.5 py-1 text-xs font-semibold text-ink">#{rank}{rank === 1 ? ' · Phù hợp nhất' : ''}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs text-muted">Việt Nam · {numDays} ngày</p><h2 className="mt-1 text-xl font-semibold">{destination.name}</h2></div><p className="rounded-lg bg-ocean-50 px-2 py-1.5 font-semibold text-brand">{Math.round(destination.totalScore * 10)}<span className="text-xs font-normal text-muted">/100</span></p></div>
        <dl className="mt-5 space-y-2 text-xs text-muted">
          <div className="flex justify-between gap-3"><dt>Điểm thời tiết tham khảo</dt><dd className="font-medium text-ink">{destination.normalizedScores.weather?.toFixed(1) ?? '—'}/10</dd></div>
          <div className="flex justify-between gap-3"><dt>Độ phù hợp sở thích</dt><dd className="font-medium text-ink">{destination.normalizedScores.preference_match?.toFixed(1) ?? '—'}/10</dd></div>
          {transportName && <div className="border-t border-line pt-2"><dt>Di chuyển gợi ý</dt><dd className="mt-1 leading-5 text-ink">{transportName}</dd></div>}
        </dl>
        <div className="mt-auto pt-5"><p className="text-xs text-muted">Chi phí ước tính theo điểm đến</p><p className="mt-1 text-xl font-semibold text-brand">{destination.estimatedCostVnd.toLocaleString('vi-VN')}đ</p></div>
        <a href="#destination-detail" onClick={onSelect} aria-current={selected ? 'true' : undefined} className={`${selected ? 'button-primary' : 'button-secondary'} mt-5 block px-4 py-2.5 text-center text-sm`}>{selected ? 'Đang xem chi tiết' : 'Xem chi tiết'}</a>
      </div>
    </article>
  );
}
