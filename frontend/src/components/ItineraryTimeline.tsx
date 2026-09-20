import { Clock3 } from 'lucide-react';
import { ItineraryDayData } from '../types/trip';

interface ItineraryTimelineProps { days: ItineraryDayData[]; }

function periodLabel(time: string) {
  const hour = Number(time.split(':')[0]);
  if (hour < 12) return 'Buổi sáng';
  if (hour < 17) return 'Buổi chiều';
  return 'Buổi tối';
}

export function ItineraryTimeline({ days }: ItineraryTimelineProps) {
  if (!days?.length) return <section className="content-section"><p className="empty-copy">Chưa có lịch trình phù hợp cho chuyến đi này.</p></section>;

  return (
    <section id="itinerary" className="journey-timeline scroll-mt-24" aria-labelledby="itinerary-heading">
      <div className="section-lead journey-timeline-head">
        <div><p className="eyebrow">Từng ngày một</p><h2 id="itinerary-heading">Lịch trình của bạn</h2></div>
        <p>Một kế hoạch đủ rõ để lên đường, nhưng vẫn còn khoảng trống cho những điều bất ngờ.</p>
      </div>

      <nav className="journey-day-nav" aria-label="Đi nhanh đến một ngày">
        {days.map((day) => <a key={day.day} href={`#trip-day-${day.day}`}>Ngày {String(day.day).padStart(2, '0')}</a>)}
      </nav>

      <div className="journey-days">
        {days.map((day) => (
          <article key={day.day} id={`trip-day-${day.day}`} className="journey-day scroll-mt-28">
            <header>
              <span aria-hidden="true">{String(day.day).padStart(2, '0')}</span>
              <div><p>Ngày {day.day}</p><h3>{day.title}</h3></div>
            </header>
            <ol>
              {day.activities.map((activity, index) => (
                <li key={`${activity.time}-${index}`}>
                  <div className="journey-time"><time>{activity.time}</time><span>{periodLabel(activity.time)}</span></div>
                  <span className="journey-marker" aria-hidden="true" />
                  <div className="journey-activity">
                    <h4>{activity.title}</h4>
                    <p><span><Clock3 size={14} aria-hidden="true" /> {activity.durationHours} giờ</span>{activity.costVnd > 0 && <span>{activity.costVnd.toLocaleString('vi-VN')}đ</span>}</p>
                  </div>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </section>
  );
}
