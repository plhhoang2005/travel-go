import { DestinationCardData } from '../types/trip';

const scoreLabels: Record<string, string> = {
  budget_fit: 'Ngân sách', weather: 'Thời tiết', preference_match: 'Sở thích',
  travel_time: 'Di chuyển', uniqueness: 'Độ độc đáo',
};

export function ScoreBreakdown({ destination }: { destination: DestinationCardData }) {
  return (
    <section className="content-section">
      <div className="section-heading"><p className="eyebrow">Hiểu từng lựa chọn</p><h2>Điểm phù hợp của {destination.name}</h2><p>Mức đóng góp của từng tiêu chí vào tổng điểm, quy đổi về thang 100.</p></div>
      <div className="grid gap-x-10 gap-y-5 md:grid-cols-2">
        {Object.entries(destination.scoreContributions || {}).map(([key, score]) => {
          const contribution = Math.max(0, Math.min(100, score * 10));
          return (
            <div key={key}>
              <div className="mb-2 flex justify-between text-sm"><span>{scoreLabels[key] || key}</span><span className="font-semibold text-brand">{contribution.toFixed(1)} <span className="text-xs font-normal text-muted">điểm</span></span></div>
              <div role="meter" aria-label={scoreLabels[key] || key} aria-valuenow={contribution} aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded bg-ocean-50"><div className="h-full rounded bg-brand" style={{ width: `${contribution}%` }} /></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
