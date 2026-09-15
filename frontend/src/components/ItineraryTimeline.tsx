import React from 'react';
import { ItineraryDayData } from '../types/trip';

interface ItineraryTimelineProps {
  days: ItineraryDayData[];
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ days }) => {
  if (!days?.length) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Chưa có lịch trình phù hợp cho chuyến đi này.</div>;
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span>🗺️</span> Lịch Trình Chi Tiết Theo Ngày (Greedy Constraint)
      </h3>

      <div className="space-y-4">
        {days.map((day) => (
          <div key={day.day} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-xs rounded-lg">
                Ngày {day.day}
              </span>
              <h4 className="font-bold text-sm text-slate-800">{day.title}</h4>
            </div>

            <div className="space-y-2 border-l-2 border-emerald-200 pl-3 ml-2">
              {day.activities.map((act, idx) => (
                <div key={idx} className="text-xs relative">
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mr-2">
                    {act.time}
                  </span>
                  <span className="text-slate-800 font-medium">{act.title}</span>
                  {act.costVnd > 0 && (
                    <span className="text-slate-400 ml-2">
                      ({act.costVnd.toLocaleString('vi-VN')} đ)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
