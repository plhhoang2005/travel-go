import { Search } from 'lucide-react';
import { PlanTripRequest } from '../types/trip';

interface TripFormProps {
  request: PlanTripRequest;
  onChange: (req: PlanTripRequest) => void;
  onSubmit: () => void;
  loading: boolean;
  departureDate: string;
  onDateChange: (date: string) => void;
}
const preferences = [
  ['mountain', 'Núi & thiên nhiên'], ['beach', 'Biển & đảo'], ['food', 'Ẩm thực'],
  ['seafood', 'Hải sản'], ['romantic', 'Lãng mạn'], ['resort', 'Nghỉ dưỡng'], ['quick-trip', 'Chuyến đi ngắn'],
];
const groups = [['Một mình', 1], ['Cặp đôi', 2], ['Bạn bè', 3], ['Gia đình', 4]] as const;

export function TripForm({ request, onChange, onSubmit, loading, departureDate, onDateChange }: TripFormProps) {
  const toggle = (id: string) => onChange({
    ...request,
    preferences: request.preferences.includes(id) ? request.preferences.filter((item) => item !== id) : [...request.preferences, id],
  });
  const valid = request.preferences.length > 0 && request.budgetVnd >= 1000000 && Number.isFinite(request.budgetVnd);
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <form onSubmit={(event) => { event.preventDefault(); if (valid && !loading) onSubmit(); }} aria-busy={loading}>
      <fieldset disabled={loading} className="min-w-0">
        <legend className="sr-only">Thông tin chuyến đi</legend>
        <div className="travel-search-grid">
          <label className="travel-field"><span>Xuất phát từ</span>
            <select value={request.origin} onChange={(e) => onChange({ ...request, origin: e.target.value })}>
              <option value="Ho Chi Minh">TP. Hồ Chí Minh</option><option value="Ha Noi">Hà Nội</option><option value="Da Nang">Đà Nẵng</option>
            </select>
          </label>
          <label className="travel-field"><span>Ngày đi dự kiến</span><input type="date" min={minDate} value={departureDate} onChange={(e) => onDateChange(e.target.value)} aria-describedby="date-note" /></label>
          <label className="travel-field"><span>Số ngày</span><select value={request.numDays} onChange={(e) => onChange({ ...request, numDays: Number(e.target.value) })}>{[2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} ngày</option>)}</select></label>
          <label className="travel-field"><span>Số người</span><select value={request.numPeople} onChange={(e) => onChange({ ...request, numPeople: Number(e.target.value) })}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} người</option>)}</select></label>
          <label className="travel-field"><span>Ngân sách (VNĐ)</span><input type="number" inputMode="numeric" required min={1000000} max={100000000} step={500000} value={request.budgetVnd || ''} onChange={(e) => onChange({ ...request, budgetVnd: Number(e.target.value) })} /></label>
          <button type="submit" disabled={!valid || loading} className="button-primary flex items-center justify-center gap-2 px-3"><Search size={17} aria-hidden="true" />{loading ? 'Đang lập...' : 'Lập kế hoạch'}</button>
        </div>
        <p id="date-note" className="mt-3 text-xs leading-5 text-muted">Ngày đi được lưu cùng lịch trình để bạn tham khảo. Chi phí và thời tiết chưa thay đổi theo ngày chọn.</p>

        <div className="mt-6 grid gap-6 border-t border-line pt-6 lg:grid-cols-[1fr_auto]">
          <fieldset className="min-w-0">
            <legend className="mb-3 text-sm font-semibold text-ink">Bạn thích điều gì?</legend>
            <div className="flex flex-wrap gap-2">
              {preferences.map(([id, label]) => <button key={id} type="button" aria-pressed={request.preferences.includes(id)} onClick={() => toggle(id)} className={`preference-chip ${request.preferences.includes(id) ? 'is-selected' : ''}`}>{label}</button>)}
            </div>
            {!request.preferences.length && <p role="alert" className="mt-3 text-sm text-rose-700">Hãy chọn ít nhất một sở thích.</p>}
          </fieldset>
          <label className="text-sm font-semibold text-ink">Mức độ ưu tiên
            <select value={request.priority} onChange={(e) => onChange({ ...request, priority: e.target.value as PlanTripRequest['priority'] })} className="mt-3 block w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal lg:w-44">
              <option value="balanced">Cân bằng</option><option value="cheapest">Tiết kiệm chi phí</option><option value="fastest">Tiết kiệm thời gian</option><option value="comfortable">Thoải mái</option>
            </select>
          </label>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
          <span className="mr-2 font-medium text-muted">Nhóm đi · gợi ý số người:</span>
          {groups.map(([label, number]) => <button key={label} type="button" onClick={() => onChange({ ...request, numPeople: number })} className="rounded-md px-2 py-1.5 text-brand underline decoration-ocean-200 underline-offset-4 hover:bg-ocean-50">{label} ({number})</button>)}
        </div>
      </fieldset>
      {loading && <p className="mt-4 text-sm text-brand" role="status">Đang lập kế hoạch chuyến đi…</p>}
    </form>
  );
}
