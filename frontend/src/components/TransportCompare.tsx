import { Bus, Clock3, Plane, Star, TrainFront } from 'lucide-react';
import { TransportOptionData } from '../types/trip';

interface TransportCompareProps { options: TransportOptionData[]; }
const modeIcons = { may_bay: Plane, tau_lua: TrainFront, xe_khach: Bus };
const tradeoffLabels: Record<string, string> = { cheapest: 'Tiết kiệm nhất', fastest: 'Nhanh nhất', balanced: 'Cân bằng nhất', comfortable: 'Thoải mái nhất' };

export function TransportCompare({ options }: TransportCompareProps) {
  return (
    <section className="content-section">
      <div className="section-heading"><p className="eyebrow">Đi lại thuận tiện</p><h2>Chọn cách di chuyển</h2><p>So sánh chi phí, thời gian và mức độ thoải mái cho hành trình.</p></div>
      {options?.length ? <div className="grid gap-3 lg:grid-cols-3">{options.map((option) => {
        const Icon = modeIcons[option.mode as keyof typeof modeIcons] || Bus;
        return <article key={option.mode} className={`transport-card ${option.isParetoOptimal ? 'is-recommended' : ''}`}>
          <div className="flex items-start justify-between gap-3"><span className="icon-box"><Icon size={21} /></span>{option.isParetoOptimal && <span className="subtle-badge">Lựa chọn tốt</span>}</div>
          <h3 className="mt-5 text-lg font-semibold text-ink">{option.displayName}</h3>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-brand">{option.priceTotalVnd.toLocaleString('vi-VN')}đ</p>
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="flex items-center gap-2 text-muted"><Clock3 size={15} />Thời gian</dt><dd className="font-medium text-ink">{option.durationHours} giờ</dd></div>
            <div className="flex justify-between"><dt className="flex items-center gap-2 text-muted"><Star size={15} />Thoải mái</dt><dd className="font-medium text-ink">{option.comfortScore}/10</dd></div>
          </dl>
          <p className="mt-4 text-sm leading-6 text-muted">{option.recommendationReason}</p>
          <p className="mt-3 text-xs font-medium text-brand">{tradeoffLabels[option.tradeoffType] || option.tradeoffType}</p>
        </article>;
      })}</div> : <p className="empty-copy">Chưa có phương tiện phù hợp.</p>}
    </section>
  );
}
