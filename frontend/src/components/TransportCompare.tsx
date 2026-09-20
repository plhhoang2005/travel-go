import { Bus, Clock3, Plane, Star, TrainFront } from 'lucide-react';
import { TransportOptionData } from '../types/trip';

interface TransportCompareProps { options: TransportOptionData[]; }
const modeIcons = { may_bay: Plane, tau_lua: TrainFront, xe_khach: Bus };
const tradeoffLabels: Record<string, string> = { cheapest: 'Tiết kiệm nhất', fastest: 'Nhanh nhất', balanced: 'Cân bằng nhất', comfortable: 'Thoải mái nhất' };

export function TransportCompare({ options }: TransportCompareProps) {
  return (
    <section className="transport-compare" aria-labelledby="transport-heading">
      <div className="section-lead">
        <div><p className="eyebrow">Đi lại thuận tiện</p><h2 id="transport-heading">Chọn cách di chuyển</h2></div>
        <p>Đặt thời gian, chi phí và độ thoải mái cạnh nhau để thấy lựa chọn nào hợp với nhịp đi của bạn.</p>
      </div>
      {options?.length ? (
        <div className="transport-list">
          {options.map((option, index) => {
            const Icon = modeIcons[option.mode as keyof typeof modeIcons] || Bus;
            return (
              <article key={option.mode} className={option.isParetoOptimal ? 'is-recommended' : ''}>
                <div className="transport-rank"><span>{String(index + 1).padStart(2, '0')}</span><Icon size={21} aria-hidden="true" /></div>
                <div className="transport-name">
                  <div>{option.isParetoOptimal && <span className="subtle-badge">Lựa chọn nổi bật</span>}<small>{tradeoffLabels[option.tradeoffType] || option.tradeoffType}</small></div>
                  <h3>{option.displayName}</h3>
                  <p>{option.recommendationReason}</p>
                </div>
                <dl>
                  <div><dt><Clock3 size={14} aria-hidden="true" /> Thời gian</dt><dd>{option.durationHours} giờ</dd></div>
                  <div><dt><Star size={14} aria-hidden="true" /> Thoải mái</dt><dd>{option.comfortScore}/10</dd></div>
                </dl>
                <div className="transport-price"><span>Tổng chi phí</span><strong>{option.priceTotalVnd.toLocaleString('vi-VN')}đ</strong></div>
              </article>
            );
          })}
        </div>
      ) : <p className="empty-copy">Chưa có phương tiện phù hợp.</p>}
    </section>
  );
}
