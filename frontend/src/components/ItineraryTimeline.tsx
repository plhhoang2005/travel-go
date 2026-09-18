import { useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { ItineraryDayData } from '../types/trip';

interface ItineraryTimelineProps { days: ItineraryDayData[]; }

export function ItineraryTimeline({ days }: ItineraryTimelineProps) {
  const [activeDay, setActiveDay] = useState(days?.[0]?.day ?? 1);
  useEffect(() => { if (days?.length && !days.some((item) => item.day === activeDay)) setActiveDay(days[0].day); }, [days, activeDay]);
  if (!days?.length) return <section className="content-section"><p className="empty-copy">Chưa có lịch trình phù hợp cho chuyến đi này.</p></section>;
  const selectedDay = days.find((item) => item.day === activeDay) || days[0];
  return (
    <section id="itinerary" className="content-section scroll-mt-24">
      <div className="section-heading"><p className="eyebrow">Từng ngày một</p><h2>Lịch trình của bạn</h2><p>Một kế hoạch vừa đủ chi tiết để bạn bắt đầu chuyến đi.</p></div>
      <div role="tablist" aria-label="Chọn ngày trong lịch trình" className="flex gap-2 overflow-x-auto border-b border-line">{days.map((day) => <button key={day.day} type="button" role="tab" aria-selected={activeDay === day.day} aria-controls={`day-panel-${day.day}`} onClick={() => setActiveDay(day.day)} className={`day-tab ${activeDay === day.day ? 'is-active' : ''}`}>Ngày {day.day}</button>)}</div>
      <div id={`day-panel-${selectedDay.day}`} role="tabpanel" className="pt-8">
        <p className="text-sm font-medium text-brand">Ngày {selectedDay.day}</p><h3 className="mt-2 text-2xl font-semibold text-ink">{selectedDay.title}</h3>
        <ol className="mt-8">{selectedDay.activities.map((activity, index) => <li key={`${activity.time}-${index}`} className="timeline-item"><time className="timeline-time">{activity.time}</time><div className="timeline-marker" aria-hidden="true" /><div className="pb-8"><h4 className="font-semibold text-ink">{activity.title}</h4><p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-muted"><span className="inline-flex items-center gap-1"><Clock3 size={14} />{activity.durationHours} giờ</span>{activity.costVnd > 0 && <span>{activity.costVnd.toLocaleString('vi-VN')}đ</span>}</p></div></li>)}</ol>
      </div>
    </section>
  );
}
