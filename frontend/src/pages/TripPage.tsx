import { ArrowRight, CalendarDays, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AiExplanationBox } from '../components/AiExplanationBox';
import { BudgetChart } from '../components/BudgetChart';
import { EmptyTripState } from '../components/EmptyTripState';
import { ItineraryTimeline } from '../components/ItineraryTimeline';
import { TransportCompare } from '../components/TransportCompare';
import { TripResultNav } from '../components/TripResultNav';
import { getDestinationImage } from '../data/destinationVisuals';
import { exploreDestinations } from '../data/travelContent';
import { PlanTripRequest, PlanTripResponse } from '../types/trip';

type TripPageProps = {
  request: PlanTripRequest;
  response: PlanTripResponse | null;
  departureDate?: string;
};

export function TripPage({ request, response, departureDate }: TripPageProps) {
  if (!response) return <><header className="page-intro"><div className="page-shell py-10 md:py-14"><p className="eyebrow">Hành trình của tôi</p><h1>Mọi phần của chuyến đi, trên cùng một dòng chảy.</h1></div></header><EmptyTripState /></>;

  const winner = response.topDestinations.find((item) => item.id === response.winnerId) || response.topDestinations[0];
  if (!winner) return <EmptyTripState />;
  const editorialDestination = exploreDestinations.find((item) => item.id === winner.id);
  const estimatedSpend = response.budgetBreakdown.transport + response.budgetBreakdown.accommodation + response.budgetBreakdown.food + response.budgetBreakdown.attractions;

  return (
    <>
      <header className="trip-overview">
        <div className="trip-overview-image"><img src={getDestinationImage(winner.id)} alt={`Phong cảnh minh họa cho ${winner.name}`} /></div>
        <div className="trip-overview-shade" />
        <div className="page-shell trip-overview-content">
          <p className="eyebrow">Hành trình đã sẵn sàng</p>
          <h1>{winner.name},<br />theo nhịp của bạn.</h1>
          <p>{editorialDestination?.description || 'Một điểm đến được cân nhắc từ thời gian, sở thích và khoản chi bạn đã chọn.'}</p>
          <dl>
            <div><dt><CalendarDays size={15} aria-hidden="true" /> Thời gian</dt><dd>{request.numDays} ngày{departureDate ? ` · ${new Date(departureDate + 'T00:00:00').toLocaleDateString('vi-VN')}` : ''}</dd></div>
            <div><dt><Users size={15} aria-hidden="true" /> Nhóm đi</dt><dd>{request.numPeople} người</dd></div>
            <div><dt><MapPin size={15} aria-hidden="true" /> Dự kiến</dt><dd>{estimatedSpend.toLocaleString('vi-VN')}đ</dd></div>
          </dl>
        </div>
      </header>

      <div className="page-shell trip-flow" aria-label="Chi tiết hành trình">
        <TripResultNav />

        <section className="trip-opening">
          <span className="trip-opening-score"><strong>{Math.round(winner.totalScore * 10)}</strong><small>/100 phù hợp</small></span>
          <div><p className="eyebrow">Tổng quan</p><h2>Một lịch trình đủ rõ để bạn có thể bắt đầu.</h2><p>TravelGO đã đặt điểm đến, cách di chuyển, từng ngày trải nghiệm và khoản chi cạnh nhau. Bạn vẫn nên kiểm tra giá thực tế trước khi đặt dịch vụ.</p></div>
          <Link to="/planner" className="text-link">Điều chỉnh lựa chọn <ArrowRight size={15} aria-hidden="true" /></Link>
        </section>

        <ItineraryTimeline days={response.itineraryDays} />
        <TransportCompare options={response.transportOptions} />
        <BudgetChart budget={response.budgetBreakdown} />
        <AiExplanationBox explanation={response.aiExplanation} dataSources={response.dataSources} assumptions={response.assumptions} />
      </div>
    </>
  );
}
