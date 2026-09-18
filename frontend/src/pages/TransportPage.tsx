import { EmptyTripState } from '../components/EmptyTripState';
import { PageIntro } from '../components/PageIntro';
import { TransportCompare } from '../components/TransportCompare';
import { TripResultNav } from '../components/TripResultNav';
import { PlanTripRequest, PlanTripResponse } from '../types/trip';

export function TransportPage({ request, response }: { request: PlanTripRequest; response: PlanTripResponse | null }) {
  return <><PageIntro eyebrow="Cân nhắc cách đi" title="Phương án di chuyển">So sánh chi phí, thời gian và độ thoải mái cho chuyến đi {request.numDays} ngày.</PageIntro>{response ? <div className="page-shell py-10 md:py-12"><TripResultNav /><TransportCompare options={response.transportOptions} /></div> : <EmptyTripState />}</>;
}
