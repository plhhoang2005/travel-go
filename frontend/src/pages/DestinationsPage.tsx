import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiExplanationBox } from '../components/AiExplanationBox';
import { DestinationCard } from '../components/DestinationCard';
import { DestinationHero } from '../components/DestinationHero';
import { ExploreGrid } from '../components/ExploreGrid';
import { PageIntro } from '../components/PageIntro';
import { Reveal } from '../components/Reveal';
import { ScoreBreakdown } from '../components/ScoreBreakdown';
import { getDestinationImage } from '../data/destinationVisuals';
import { PlanTripRequest, PlanTripResponse } from '../types/trip';

export function DestinationsPage({ request, response }: { request: PlanTripRequest; response: PlanTripResponse | null }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => { setSelectedId(response?.winnerId ?? null); }, [response]);
  const topThree = response?.topDestinations.slice(0, 3) ?? [];
  const selected = topThree.find((item) => item.id === selectedId) || topThree[0];
  const recommendationTitle = topThree.length === 3 ? 'Ba lựa chọn phù hợp nhất' : topThree.length === 2 ? 'Hai lựa chọn phù hợp nhất' : 'Lựa chọn phù hợp nhất';
  const recommendedTransport = response?.transportOptions.find((item) => item.isParetoOptimal && ['balanced', 'cheapest'].includes(item.tradeoffType)) || response?.transportOptions[0];

  return (
    <>
      <PageIntro eyebrow="Từ núi đến biển" title="Khám phá Việt Nam theo nhịp của bạn">Chọn một vùng, tìm cảm hứng và bắt đầu từ nơi khiến bạn muốn lên đường.</PageIntro>
      <div className="page-shell space-y-20 py-12 md:py-16">
        {response && selected ? (
          <Reveal>
            <section className="recommendation-section" aria-labelledby="recommendation-heading">
              <div className="section-lead">
                <div><p className="eyebrow">Dành riêng cho chuyến đi này</p><h2 id="recommendation-heading">{recommendationTitle}</h2></div>
                <p>Dựa trên {request.numDays} ngày, {request.numPeople} người, sở thích và ngân sách bạn đã chọn.</p>
              </div>
              <div className="recommendation-grid">
                {topThree.map((destination, index) => <DestinationCard key={destination.id} destination={destination} rank={index + 1} numDays={request.numDays} selected={destination.id === selected.id} onSelect={() => setSelectedId(destination.id)} transportName={destination.id === response.winnerId ? recommendedTransport?.displayName : undefined} />)}
              </div>
              <p className="mt-4 text-xs leading-6 text-muted">Ảnh mang tính minh họa. Điểm thời tiết là tiêu chí tham khảo, không phải dự báo nhiệt độ trực tiếp.</p>
              <p className="recommendation-context">Khi bạn mở một lựa chọn khác, TravelGO chỉ thay phần so sánh điểm đến. Phương tiện, ngân sách và lịch trình vẫn thuộc về đề xuất chính <strong>{response.topDestinations.find((item) => item.id === response.winnerId)?.name}</strong>.</p>
              <div id="destination-detail" className="mt-12 scroll-mt-24 space-y-8">
                <DestinationHero destination={selected} request={request} imageUrl={getDestinationImage(selected.id)} />
                <ScoreBreakdown destination={selected} />
              </div>
              {selected.id === response.winnerId && <div className="mt-8"><AiExplanationBox explanation={response.aiExplanation} dataSources={response.dataSources} assumptions={response.assumptions} /></div>}
              <div className="result-actions">
                <Link to="/trip/current" className="button-primary px-5 py-3 text-sm">Mở hành trình hoàn chỉnh</Link>
                <Link to="/budget" className="button-secondary px-5 py-3 text-sm">Xem ngân sách</Link>
                <Link to="/planner" className="text-link px-2 py-3 text-sm">Điều chỉnh chuyến đi</Link>
              </div>
            </section>
          </Reveal>
        ) : (
          <Reveal>
            <aside className="explore-planner-note">
              <div><p className="eyebrow">Muốn gợi ý sát hơn?</p><h2>Cho TravelGO biết bạn có bao nhiêu ngày và muốn chi bao nhiêu.</h2></div>
              <Link to="/planner" className="button-primary px-5 py-3 text-sm">Tạo gợi ý riêng</Link>
            </aside>
          </Reveal>
        )}
        <Reveal><ExploreGrid /></Reveal>
      </div>
    </>
  );
}
