import { Bus, CalendarDays, MapPin, Route, Wallet } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { TripForm } from './TripForm';
import { TripPresets } from './TripPresets';
import { PlanTripRequest } from '../types/trip';

const tabs = [
  ['/planner', Route, 'Lập kế hoạch'], ['/destinations', MapPin, 'Điểm đến'],
  ['/transport', Bus, 'Phương tiện'], ['/budget', Wallet, 'Ngân sách'], ['/itinerary', CalendarDays, 'Lịch trình'],
] as const;
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
      <nav className="flex gap-6 overflow-x-auto border-b border-line" aria-label="Các phần của kế hoạch">
        {tabs.map(([to, Icon, label]) => <NavLink to={to} key={to} className={({ isActive }) => `planner-tab ${isActive ? 'is-active' : ''}`}><Icon size={16} aria-hidden="true" />{label}</NavLink>)}
      </nav>
      <div className="pt-6">
        <TripForm request={request} onChange={onChange} onSubmit={() => void onSubmit()} loading={loading} departureDate={departureDate} onDateChange={onDateChange} />
        <TripPresets onApplyPreset={(id) => { if (presets[id]) onChange({ ...presets[id], preferences: [...presets[id].preferences] }); }} loading={loading} />
      </div>
    </section>
  );
}
