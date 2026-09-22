import { useEffect, useState } from 'react';
import { Clock3, DollarSign, Trash2, CalendarDays } from 'lucide-react';
import { ItineraryDayData } from '../types/trip';

interface ItineraryTimelineProps {
  days: ItineraryDayData[];
  viewMode?: 'tabs' | 'all';
  onDeleteActivity?: (dayNum: number, activityIndex: number) => void;
}

export function ItineraryTimeline({ days, viewMode = 'tabs', onDeleteActivity }: ItineraryTimelineProps) {
  const [activeDay, setActiveDay] = useState(days?.[0]?.day ?? 1);

  useEffect(() => {
    if (days?.length && !days.some((item) => item.day === activeDay)) {
      setActiveDay(days[0].day);
    }
  }, [days, activeDay]);

  if (!days?.length) {
    return (
      <section className="content-section">
        <p className="empty-copy">Chưa có lịch trình phù hợp cho chuyến đi này.</p>
      </section>
    );
  }

  const selectedDay = days.find((item) => item.day === activeDay) || days[0];

  return (
    <section id="itinerary" className="content-section scroll-mt-24">
      {/* Screen Interactive Header */}
      <div className="section-heading no-print flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Từng ngày một</p>
          <h2>Lịch trình chi tiết</h2>
          <p>Lịch trình được tối ưu theo khung giờ Sáng - Chiều - Tối, cân bằng thời gian nghỉ ngơi.</p>
        </div>
      </div>

      {/* Tabs - only visible in 'tabs' viewMode and hidden when printing */}
      {viewMode === 'tabs' && (
        <div
          role="tablist"
          aria-label="Chọn ngày trong lịch trình"
          className="no-print flex gap-2 overflow-x-auto border-b border-line pb-2"
        >
          {days.map((day) => (
            <button
              key={day.day}
              type="button"
              role="tab"
              aria-selected={activeDay === day.day}
              aria-controls={`day-panel-${day.day}`}
              onClick={() => setActiveDay(day.day)}
              className={`day-tab flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeDay === day.day
                  ? 'bg-ocean-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CalendarDays size={15} />
              Ngày {day.day}
            </button>
          ))}
        </div>
      )}

      {/* Single Day View (Tabs mode on screen) */}
      {viewMode === 'tabs' && (
        <div id={`day-panel-${selectedDay.day}`} role="tabpanel" className="no-print pt-6">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ocean-700">Ngày {selectedDay.day}</span>
              <h3 className="text-xl font-bold text-ink mt-0.5">{selectedDay.title}</h3>
            </div>
            <span className="text-xs bg-ocean-50 text-ocean-800 font-semibold px-2.5 py-1 rounded-full border border-ocean-200">
              {selectedDay.activities.length} hoạt động
            </span>
          </div>

          <ol className="mt-6 space-y-4">
            {selectedDay.activities.map((activity, index) => (
              <li
                key={`${activity.time}-${index}`}
                className="group relative flex items-start gap-4 p-4 rounded-xl border border-slate-200/80 bg-white hover:border-ocean-300 hover:shadow-sm transition"
              >
                <div className="flex flex-col items-center shrink-0 w-16 pt-0.5">
                  <span className="text-sm font-bold text-ocean-800 font-mono bg-ocean-50 px-2 py-0.5 rounded-lg border border-ocean-200/60">
                    {activity.time}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-ink text-base">{activity.title}</h4>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
                    <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                      <Clock3 size={13} className="text-ocean-600" />
                      {activity.durationHours} giờ
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      <DollarSign size={12} />
                      {activity.costVnd > 0 ? `${activity.costVnd.toLocaleString('vi-VN')}đ` : 'Miễn phí vé'}
                    </span>
                  </div>
                </div>

                {onDeleteActivity && (
                  <button
                    type="button"
                    onClick={() => onDeleteActivity(selectedDay.day, index)}
                    title="Xóa hoạt động này"
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* All Days View (Screen all-days mode OR Print View) */}
      <div className={viewMode === 'all' ? 'space-y-8 pt-4' : 'hidden print:block space-y-6 pt-2'}>
        {days.map((day) => (
          <div key={day.day} className="print-day-block rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-line mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ocean-700">Ngày {day.day}</span>
                <h3 className="text-lg sm:text-xl font-bold text-ink mt-0.5">{day.title}</h3>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-full">
                {day.activities.length} hoạt động
              </span>
            </div>

            <ol className="space-y-3">
              {day.activities.map((activity, index) => (
                <li
                  key={`${activity.time}-${index}`}
                  className="timeline-item flex items-start gap-3.5 p-3 rounded-xl bg-slate-50/70 border border-slate-200/70"
                >
                  <span className="text-xs font-bold text-ocean-800 font-mono bg-white px-2 py-0.5 rounded border border-ocean-200 shrink-0">
                    {activity.time}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink text-sm sm:text-base">{activity.title}</p>
                    <p className="mt-1 flex items-center gap-3 text-xs text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={12} /> {activity.durationHours} giờ
                      </span>
                      <span>•</span>
                      <span className="font-medium text-emerald-700">
                        {activity.costVnd > 0 ? `${activity.costVnd.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
                      </span>
                    </p>
                  </div>
                  {onDeleteActivity && viewMode === 'all' && (
                    <button
                      type="button"
                      onClick={() => onDeleteActivity(day.day, index)}
                      title="Xóa hoạt động này"
                      className="no-print p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
