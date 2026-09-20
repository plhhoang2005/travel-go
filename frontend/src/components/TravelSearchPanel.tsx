import { TripForm } from './TripForm';
import { TripPresets } from './TripPresets';
import { PlanTripRequest } from '../types/trip';

type Props = {
  request: PlanTripRequest; onChange: (request: PlanTripRequest) => void;
  onSubmit: (request?: PlanTripRequest) => Promise<void>; loading: boolean;
  departureDate: string; onDateChange: (date: string) => void;
};
const presets: Record<number, PlanTripRequest> = {
  1: { origin: 'Ho Chi Minh', numDays: 3, numPeople: 2, budgetVnd: 4000000, preferences: ['mountain', 'food', 'romantic'], priority: 'balanced' },
  2: { origin: 'Ho Chi Minh', numDays: 4, numPeople: 3, budgetVnd: 8000000, preferences: ['beach', 'resort', 'seafood'], priority: 'comfortable' },
  3: { origin: 'Ho Chi Minh', numDays: 2, numPeople: 2, budgetVnd: 1500000, preferences: ['beach', 'food', 'quick-trip'], priority: 'cheapest' },
};

export function TravelSearchPanel({ request, onChange, onSubmit, loading, departureDate, onDateChange }: Props) {
  return (
    <section className="travel-panel" aria-label="Thông tin lập kế hoạch">
      <div className="planner-preset-area">
        <div><p className="eyebrow">Muốn bắt đầu nhanh?</p><p>Chọn một nhịp đi mẫu rồi thay đổi từng câu trả lời theo ý bạn.</p></div>
        <TripPresets onApplyPreset={(id) => { if (presets[id]) onChange({ ...presets[id], preferences: [...presets[id].preferences] }); }} loading={loading} />
      </div>
      <div>
        <TripForm request={request} onChange={onChange} onSubmit={() => void onSubmit()} loading={loading} departureDate={departureDate} onDateChange={onDateChange} />
      </div>
    </section>
  );
}
