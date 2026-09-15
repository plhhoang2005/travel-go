import React from 'react';
import { DestinationCardData } from '../types/trip';

interface DestinationCardProps {
  destination: DestinationCardData;
  isWinner: boolean;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  isWinner,
}) => {
  return (
    <div
      className={`p-5 rounded-2xl border transition-all ${
        isWinner
          ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 shadow-md ring-2 ring-emerald-400/20'
          : 'bg-white border-slate-100 shadow-sm hover:border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          {isWinner && (
            <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-600 text-white mb-1">
              🏆 Lựa Chọn #1 Tối Ưu Nhất
            </span>
          )}
          <h3 className="text-lg font-bold text-slate-800">{destination.name}</h3>
          <p className="text-xs text-slate-500">
            Ước tính chi phí: <span className="font-semibold text-slate-700">{destination.estimatedCostVnd.toLocaleString('vi-VN')} VNĐ</span>
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black text-emerald-600">
            {destination.totalScore}
            <span className="text-xs font-normal text-slate-400">/10</span>
          </div>
          <span className="text-[10px] text-slate-400 block">Điểm MCDA</span>
        </div>
      </div>

      {/* Score Contribution Progress Bars */}
      <div className="space-y-2 mt-4 pt-3 border-t border-slate-200/50 text-xs">
        <p className="font-semibold text-slate-600 text-[11px] mb-1">
          📊 Đóng góp điểm thành phần (Score Contributions):
        </p>

        {Object.entries(destination.scoreContributions || {}).map(([key, val]) => {
          const labelMap: Record<string, string> = {
            budget_fit: 'Phù hợp Ngân sách (30%)',
            weather: 'Thời tiết tốt (20%)',
            preference_match: 'Sở thích cá nhân (25%)',
            travel_time: 'Thời gian di chuyển (15%)',
            uniqueness: 'Độ độc đáo (10%)',
          };

          const label = labelMap[key] || key;
          const maxContribMap: Record<string, number> = {
            budget_fit: 3.0,
            weather: 2.0,
            preference_match: 2.5,
            travel_time: 1.5,
            uniqueness: 1.0,
          };
          const maxVal = maxContribMap[key] || 3.0;
          const percent = Math.min(100, Math.round((val / maxVal) * 100));

          return (
            <div key={key}>
              <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                <span>{label}</span>
                <span className="font-semibold text-slate-700">+{val} điểm</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
