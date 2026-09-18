import { BudgetChart } from '../components/BudgetChart';
import { EmptyTripState } from '../components/EmptyTripState';
import { PageIntro } from '../components/PageIntro';
import { TripResultNav } from '../components/TripResultNav';
import { PlanTripRequest, PlanTripResponse } from '../types/trip';

export function BudgetPage({ request, response }: { request: PlanTripRequest; response: PlanTripResponse | null }) {
  return <><PageIntro eyebrow="Giữ khoản chi trong tầm tay" title="Phân bổ ngân sách">Theo dõi cách ngân sách {request.budgetVnd.toLocaleString('vi-VN')}đ được chia cho toàn bộ chuyến đi.</PageIntro>{response ? <div className="page-shell py-10 md:py-12"><TripResultNav /><BudgetChart budget={response.budgetBreakdown} /></div> : <EmptyTripState />}</>;
}
