import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDestinations, RawDestination } from '../api/tripApi';
import { AiExplanationBox } from '../components/AiExplanationBox';
import { ErrorState } from '../components/ErrorState';
import { VietnamVectorGeoMap } from '../components/VietnamVectorGeoMap';
import { LoadingState } from '../components/LoadingState';
import { PageIntro } from '../components/PageIntro';
import { TravelSearchPanel } from '../components/TravelSearchPanel';
import { PlanTripRequest, PlanTripResponse } from '../types/trip';

type Props = {
  request: PlanTripRequest; onChange: (request: PlanTripRequest) => void;
  onSubmit: (request?: PlanTripRequest) => Promise<void>; loading: boolean;
  error: string | null; onUseDemo: () => void;
  response: PlanTripResponse | null; plannedRequest: PlanTripRequest;
  departureDate: string; onDateChange: (date: string) => void; plannedDate: string;
};

export function PlannerPage({ request, onChange, onSubmit, loading, error, onUseDemo, response, plannedRequest, departureDate, onDateChange, plannedDate }: Props) {
  const [plannerMode, setPlannerMode] = useState<'form' | 'map'>('form');
  const [allDestinations, setAllDestinations] = useState<RawDestination[]>([]);

  useEffect(() => {
    void fetchDestinations().then((data) => setAllDestinations(data));
  }, []);

  const handleSelectDestinationFromMap = (dest: RawDestination) => {
    // Pre-fill request with destination characteristics
    const updatedRequest: PlanTripRequest = {
      ...request,
      preferences: dest.tags && dest.tags.length > 0 ? dest.tags.slice(0, 3) : ['mountain', 'food'],
      budgetVnd: Math.max(request.budgetVnd, (dest.avg_daily_cost_vnd * request.numDays * request.numPeople) + 1_000_000),
    };
    onChange(updatedRequest);
    setPlannerMode('form');
    void onSubmit(updatedRequest);
  };

  const winner = response?.topDestinations.find((item) => item.id === response.winnerId) || response?.topDestinations[0];

  return (
    <>
      <PageIntro eyebrow="Bắt đầu hành trình" title="Bạn muốn chuyến đi như thế nào?">
        Chọn nơi xuất phát, thời gian và ngân sách, hoặc nhấp trực tiếp vào bản đồ Việt Nam để TravelGO đề xuất hành trình tối ưu.
      </PageIntro>

      <div className="page-shell space-y-8 py-9 md:py-10">
        {/* Decision Intelligence AI Active Indicator */}
        <div className="flex items-center justify-between flex-wrap gap-3 rounded-2xl bg-ocean-50 border border-ocean-200/80 px-5 py-3">
          <div className="flex items-center gap-2.5 text-xs text-ocean-950 font-medium">
            <span className="flex h-2.5 w-2.5 rounded-full bg-brand animate-pulse" />
            <span><strong>Decision Intelligence AI Engine:</strong> Tối ưu hóa đa mục tiêu bằng 4 mô hình toán học (MCDA, Pareto, Greedy, Độ nhạy ngân sách) + Open-Meteo Live API.</span>
          </div>
          <span className="text-[11px] font-bold text-brand bg-white border border-ocean-200 rounded-lg px-2.5 py-1 shadow-sm">
            ✨ Bấm "Lập kế hoạch" để chạy phân tích AI
          </span>
        </div>

        {/* Navigation Mode Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-2xl bg-slate-100 p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => setPlannerMode('form')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                plannerMode === 'form' ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
              }`}
            >
              <span>⚙️</span> Nhập tiêu chí & Ngân sách
            </button>
            <button
              type="button"
              onClick={() => setPlannerMode('map')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                plannerMode === 'map' ? 'bg-white text-brand shadow-sm' : 'text-muted hover:text-ink'
              }`}
            >
              <span>🗺️</span> Chọn trực tiếp trên Bản đồ Việt Nam
            </button>
          </div>
        </div>

        {plannerMode === 'map' ? (
          <div className="space-y-4">
            <div className="rounded-2xl bg-ocean-50 border border-ocean-200 p-4 text-xs text-ocean-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>📍</span>
                <span>Nhấp vào điểm đến bạn muốn đi trên bản đồ để xem chi tiết và <strong>Lên kế hoạch ngay</strong>.</span>
              </span>
              <button
                type="button"
                onClick={() => setPlannerMode('form')}
                className="font-bold underline text-brand hover:opacity-80"
              >
                Chuyển về Form tùy chỉnh
              </button>
            </div>
            <VietnamVectorGeoMap
              destinations={allDestinations}
              selectedId={response?.winnerId}
              winnerId={response?.winnerId}
              origin={request.origin}
              onSelectForPlan={handleSelectDestinationFromMap}
            />
          </div>
        ) : (
          <TravelSearchPanel
            request={request}
            onChange={onChange}
            onSubmit={onSubmit}
            loading={loading}
            departureDate={departureDate}
            onDateChange={onDateChange}
          />
        )}

        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={() => void onSubmit()} onUseDemo={onUseDemo} />}
        {response && winner && !loading && !error && (
          <div className="space-y-8">
            <section className="plan-summary" aria-labelledby="plan-created" role="status">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <p className="eyebrow">Kế hoạch đã sẵn sàng</p>
                  <h2 id="plan-created" className="mt-2 text-2xl font-semibold">{winner.name} đang chờ bạn.</h2>
                  <p className="mt-2 text-sm text-muted">
                    {plannedRequest.numDays} ngày · {plannedRequest.numPeople} người · Ngân sách {plannedRequest.budgetVnd.toLocaleString('vi-VN')}đ
                    {plannedDate && ` · Khởi hành ${new Date(plannedDate + 'T00:00:00').toLocaleDateString('vi-VN')}`}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <span className="text-xs text-muted">Điểm phù hợp AI (MCDA)</span>
                  <p className="text-2xl font-semibold text-brand">
                    {Math.round(winner.totalScore * 10)}
                    <span className="text-sm font-normal"> / 100</span>
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/destinations" className="button-primary px-4 py-2.5 text-sm">Xem chi tiết điểm đến & Bản đồ</Link>
                <Link to="/transport" className="button-secondary px-4 py-2.5 text-sm">Xem tối ưu phương tiện</Link>
                <Link to="/budget" className="button-secondary px-4 py-2.5 text-sm">Xem mô phỏng ngân sách</Link>
                <Link to="/itinerary" className="button-secondary px-4 py-2.5 text-sm">Xem lịch trình tối ưu</Link>
              </div>
            </section>

            {/* Decision Intelligence AI Explanation Layer */}
            <AiExplanationBox
              explanation={response.aiExplanation}
              dataSources={response.dataSources}
              assumptions={response.assumptions}
            />
          </div>
        )}
        {!response && !loading && !error && (
          <p className="border-l border-ocean-300 pl-4 text-sm leading-6 text-muted">
            Chưa biết bắt đầu từ đâu? Bạn có thể mở <strong>Bản đồ Việt Nam</strong> phía trên để chọn điểm đến, hoặc chọn một gợi ý nhanh bên dưới rồi bấm <strong>“Lập kế hoạch”</strong>.
          </p>
        )}
      </div>
    </>
  );
}
