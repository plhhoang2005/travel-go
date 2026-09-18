import { MapPin } from 'lucide-react';
import { DestinationCardData, PlanTripRequest } from '../types/trip';

interface DestinationHeroProps { destination: DestinationCardData; request: PlanTripRequest; imageUrl: string; }

export function DestinationHero({ destination, request, imageUrl }: DestinationHeroProps) {
  return (
    <section id="destinations" className="scroll-mt-24">
      <div className="section-heading">
        <p className="eyebrow">Tìm hiểu thêm</p>
        <h2>Chi tiết điểm đến {destination.name}</h2>
      </div>
      <article className="overflow-hidden rounded-xl border border-line bg-white">
        <div className="grid md:grid-cols-[1.25fr_0.75fr]">
          <img src={imageUrl} alt={`Ảnh phong cảnh minh họa cho đề xuất ${destination.name}`} loading="lazy" className="h-56 w-full object-cover md:h-[300px]" onError={(event) => { if (!event.currentTarget.src.endsWith('/images/vietnam-hero.webp')) event.currentTarget.src = '/images/vietnam-hero.webp'; }} />
          <div className="flex flex-col justify-between p-6 sm:p-8">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-brand"><MapPin size={16} />Việt Nam</div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <h3 className="text-3xl font-semibold tracking-tight text-ink">{destination.name}</h3>
                <div className="text-right"><span className="text-2xl font-semibold text-brand">{destination.totalScore}</span><span className="text-sm text-muted">/10</span></div>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted">Một lựa chọn để cân nhắc cho chuyến đi. Xem các tiêu chí bên dưới để hiểu mức độ phù hợp.</p>
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
              <div><dt className="meta-label">Thời gian</dt><dd className="mt-1 font-semibold text-ink">{request.numDays} ngày</dd></div>
              <div><dt className="meta-label">Nhóm đi</dt><dd className="mt-1 font-semibold text-ink">{request.numPeople} người</dd></div>
              <div><dt className="meta-label">Ước tính</dt><dd className="mt-1 font-semibold text-ink">{Math.round(destination.estimatedCostVnd / 100000) / 10} triệu</dd></div>
            </dl>
          </div>
        </div>
      </article>
    </section>
  );
}
