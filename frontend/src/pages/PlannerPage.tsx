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
      <PageIntro eyebrow="Bắt đầu hành trình" title="Một chuyến đi vừa với bạn, không phải với số đông.">Trả lời năm câu hỏi ngắn. TravelGO sẽ cân nhắc điểm đến, cách đi, khoản chi và lịch trình trong cùng một hành trình.</PageIntro>
      <div className="page-shell planner-page space-y-8 py-9 md:py-12">
        <TravelSearchPanel request={request} onChange={onChange} onSubmit={onSubmit} loading={loading} departureDate={departureDate} onDateChange={onDateChange} />
        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={() => void onSubmit()} onUseDemo={onUseDemo} />}
        {response && winner && !loading && !error && (
          <section className="plan-summary" aria-labelledby="plan-created" role="status">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div><p className="eyebrow">Kế hoạch đã sẵn sàng</p><h2 id="plan-created" className="mt-2 text-2xl font-semibold">{winner.name} đang chờ bạn.</h2><p className="mt-2 text-sm text-muted">{plannedRequest.numDays} ngày · {plannedRequest.numPeople} người · Ngân sách {plannedRequest.budgetVnd.toLocaleString('vi-VN')}đ{plannedDate && ` · Khởi hành ${new Date(plannedDate + 'T00:00:00').toLocaleDateString('vi-VN')}`}</p></div>
              <div className="text-left md:text-right"><span className="text-xs text-muted">Điểm phù hợp</span><p className="text-2xl font-semibold text-brand">{Math.round(winner.totalScore * 10)}<span className="text-sm font-normal"> / 100</span></p></div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link to="/trip/current" className="button-primary px-5 py-3 text-sm">Mở hành trình hoàn chỉnh</Link>
              <Link to="/destinations" className="text-link text-sm">So sánh các điểm đến</Link>
            </div>
          </section>
        )}
        {!response && !loading && !error && <p className="planner-footnote">Không có lựa chọn nào bị khóa. Bạn có thể quay lại bất kỳ câu hỏi nào trước khi tạo hành trình.</p>}
      </div>
    </>
  );
}
