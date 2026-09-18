import { Link } from 'react-router-dom';
import { ErrorState } from '../components/ErrorState';
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
  const winner = response?.topDestinations.find((item) => item.id === response.winnerId) || response?.topDestinations[0];
  return (
    <>
      <PageIntro eyebrow="Bắt đầu hành trình" title="Bạn muốn chuyến đi như thế nào?">Chọn nơi xuất phát, thời gian và ngân sách. TravelGO sẽ tìm các điểm đến phù hợp cho bạn.</PageIntro>
      <div className="page-shell space-y-8 py-9 md:py-10">
        <TravelSearchPanel request={request} onChange={onChange} onSubmit={onSubmit} loading={loading} departureDate={departureDate} onDateChange={onDateChange} />
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={() => void onSubmit()} onUseDemo={onUseDemo} />}
        {response && winner && !loading && !error && (
          <section className="plan-summary" aria-labelledby="plan-created" role="status">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div><p className="eyebrow">Kế hoạch đã sẵn sàng</p><h2 id="plan-created" className="mt-2 text-2xl font-semibold">{winner.name} đang chờ bạn.</h2><p className="mt-2 text-sm text-muted">{plannedRequest.numDays} ngày · {plannedRequest.numPeople} người · Ngân sách {plannedRequest.budgetVnd.toLocaleString('vi-VN')}đ{plannedDate && ` · Khởi hành ${new Date(plannedDate + 'T00:00:00').toLocaleDateString('vi-VN')}`}</p></div>
              <div className="text-left md:text-right"><span className="text-xs text-muted">Điểm phù hợp</span><p className="text-2xl font-semibold text-brand">{Math.round(winner.totalScore * 10)}<span className="text-sm font-normal"> / 100</span></p></div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/destinations" className="button-primary px-4 py-2.5 text-sm">Xem điểm đến</Link>
              <Link to="/transport" className="button-secondary px-4 py-2.5 text-sm">Xem phương tiện</Link>
              <Link to="/budget" className="button-secondary px-4 py-2.5 text-sm">Xem ngân sách</Link>
              <Link to="/itinerary" className="button-secondary px-4 py-2.5 text-sm">Xem lịch trình</Link>
            </div>
          </section>
        )}
        {!response && !loading && !error && <p className="border-l border-ocean-300 pl-4 text-sm leading-6 text-muted">Chưa biết bắt đầu từ đâu? Chọn một gợi ý nhanh, điều chỉnh theo ý bạn rồi bấm “Lập kế hoạch”.</p>}
      </div>
    </>
  );
}
