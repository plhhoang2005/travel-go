import { EmptyTripState } from '../components/EmptyTripState';
import { ItineraryTimeline } from '../components/ItineraryTimeline';
import { PageIntro } from '../components/PageIntro';
import { TripResultNav } from '../components/TripResultNav';
import { PlanTripRequest, PlanTripResponse } from '../types/trip';

export function ItineraryPage({ request, response, departureDate }: { request: PlanTripRequest; response: PlanTripResponse | null; departureDate?: string }) {
  return (
    <>
      <PageIntro eyebrow="Mỗi ngày một trải nghiệm" title="Lịch trình của bạn">
        {response ? `Các hoạt động dành cho ${request.numPeople} người trong ${response.itineraryDays.length} ngày.` : 'Một hành trình rõ ràng, để bạn tận hưởng chuyến đi.'}
        {departureDate && ` Khởi hành dự kiến: ${new Date(departureDate + 'T00:00:00').toLocaleDateString('vi-VN')}.`}
      </PageIntro>
      {response ? <div className="page-shell py-10"><TripResultNav /><ItineraryTimeline days={response.itineraryDays} /></div> : <EmptyTripState />}
    </>
  );
}
