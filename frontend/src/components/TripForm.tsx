import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
  ['mountain', 'Núi & thiên nhiên', 'Không khí mát, đường đèo và nhiều khoảng xanh'],
  ['beach', 'Biển & đảo', 'Nắng, mặt nước và những ngày đi dép'],
  ['food', 'Ẩm thực', 'Đi theo hương vị và những quán địa phương'],
  ['seafood', 'Hải sản', 'Bữa tối gần biển và đồ ăn thật tươi'],
  ['romantic', 'Lãng mạn', 'Nhịp đi chậm, cảnh đẹp và thời gian cho nhau'],
  ['resort', 'Nghỉ dưỡng', 'Ít di chuyển, nhiều thời gian để nghỉ'],
  ['quick-trip', 'Chuyến đi ngắn', 'Gọn nhẹ, thuận tiện và không quá xa'],
] as const;

const priorities: Array<[PlanTripRequest['priority'], string, string]> = [
  ['balanced', 'Cân bằng', 'Hài hòa giữa chi phí, thời gian và trải nghiệm'],
  ['cheapest', 'Tiết kiệm', 'Ưu tiên giữ tổng chi phí thấp hơn'],
  ['fastest', 'Nhanh gọn', 'Giảm thời gian di chuyển trên đường'],
  ['comfortable', 'Thoải mái', 'Ưu tiên không gian và trải nghiệm dễ chịu'],
];

const origins = [
  ['Ho Chi Minh', 'TP. Hồ Chí Minh'],
  ['Ha Noi', 'Hà Nội'],
  ['Da Nang', 'Đà Nẵng'],
] as const;

const stepLabels = ['Nơi bắt đầu', 'Nhịp chuyến đi', 'Khoản chi', 'Điều bạn thích', 'Hoàn tất'];

export function TripForm({ request, onChange, onSubmit, loading, departureDate, onDateChange }: TripFormProps) {
  const [step, setStep] = useState(0);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const lastStep = stepLabels.length - 1;
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    if (step > 0) questionRef.current?.focus({ preventScroll: true });
  }, [step]);

  const togglePreference = (id: string) => onChange({
    ...request,
    preferences: request.preferences.includes(id)
      ? request.preferences.filter((item) => item !== id)
      : [...request.preferences, id],
  });

  const stepIsValid = [
    Boolean(request.origin),
    request.numDays >= 2 && request.numPeople >= 1,
    Number.isFinite(request.budgetVnd) && request.budgetVnd >= 1000000,
    request.preferences.length > 0,
    true,
  ][step];

  const goForward = () => {
    if (!stepIsValid) return;
    setStep((current) => Math.min(lastStep, current + 1));
  };

  const selectedPreferenceLabels = preferences
    .filter(([id]) => request.preferences.includes(id))
    .map(([, label]) => label)
    .join(' · ');

  return (
    <form
      className="guided-planner"
      onSubmit={(event) => {
        event.preventDefault();
        if (step < lastStep) goForward();
        else if (!loading) onSubmit();
      }}
      aria-busy={loading}
    >
      <div className="planner-progress" aria-label={`Bước ${step + 1} trên ${stepLabels.length}: ${stepLabels[step]}`}>
        <div className="planner-progress-copy">
          <span>Câu hỏi {String(step + 1).padStart(2, '0')}</span>
          <strong>{stepLabels[step]}</strong>
          <span>{step + 1} / {stepLabels.length}</span>
        </div>
        <div className="planner-progress-track" aria-hidden="true"><span style={{ width: `${((step + 1) / stepLabels.length) * 100}%` }} /></div>
      </div>

      <fieldset disabled={loading} className="planner-question" key={step}>
        <legend className="sr-only">{stepLabels[step]}</legend>

        {step === 0 && (
          <div>
            <p className="planner-question-kicker">Bắt đầu từ điểm quen thuộc</p>
            <h2 ref={questionRef} tabIndex={-1}>Bạn sẽ khởi hành từ đâu?</h2>
            <p className="planner-question-help">Chọn thành phố xuất phát và thêm ngày đi nếu bạn đã có dự định.</p>
            <div className="planner-choice-grid planner-choice-grid-three">
              {origins.map(([value, label]) => (
                <button key={value} type="button" className={request.origin === value ? 'planner-choice is-selected' : 'planner-choice'} onClick={() => onChange({ ...request, origin: value })} aria-pressed={request.origin === value}>
                  <span>{label}</span><small>Khởi hành từ đây</small>
                </button>
              ))}
            </div>
            <label className="planner-date-field">
              <span>Ngày đi dự kiến <small>(không bắt buộc)</small></span>
              <input type="date" min={minDate} value={departureDate} onChange={(event) => onDateChange(event.target.value)} />
              <small>Ngày đi được lưu cùng lịch trình; giá và thời tiết hiện chưa thay đổi theo ngày đã chọn.</small>
            </label>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="planner-question-kicker">Thời gian quyết định nhịp đi</p>
            <h2 ref={questionRef} tabIndex={-1}>Bạn có bao nhiêu ngày, và đi cùng ai?</h2>
            <p className="planner-question-help">Một chuyến đi vừa sức thường bắt đầu từ lịch thực tế của bạn.</p>
            <div className="planner-split-choice">
              <div>
                <span className="planner-field-label">Số ngày</span>
                <div className="planner-number-row">
                  {[2, 3, 4, 5].map((number) => <button key={number} type="button" aria-pressed={request.numDays === number} onClick={() => onChange({ ...request, numDays: number })} className={request.numDays === number ? 'is-selected' : ''}><strong>{number}</strong><small>ngày</small></button>)}
                </div>
              </div>
              <div>
                <span className="planner-field-label">Nhóm đi</span>
                <div className="planner-number-row planner-people-row">
                  {[[1, 'Một mình'], [2, 'Cặp đôi'], [3, 'Ba người'], [4, 'Gia đình'], [5, 'Nhóm 5'], [6, 'Nhóm 6']] .map(([number, label]) => <button key={number} type="button" aria-pressed={request.numPeople === number} onClick={() => onChange({ ...request, numPeople: Number(number) })} className={request.numPeople === number ? 'is-selected' : ''}><strong>{number}</strong><small>{label}</small></button>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="planner-question-kicker">Một khoảng chi tiêu dễ chịu</p>
            <h2 ref={questionRef} tabIndex={-1}>Bạn dự kiến dành bao nhiêu cho chuyến đi?</h2>
            <p className="planner-question-help">Tổng ngân sách cho cả nhóm, gồm di chuyển, lưu trú, ăn uống và trải nghiệm.</p>
            <div className="budget-quick-picks">
              {[1500000, 4000000, 8000000, 12000000].map((amount) => (
                <button key={amount} type="button" aria-pressed={request.budgetVnd === amount} onClick={() => onChange({ ...request, budgetVnd: amount })} className={request.budgetVnd === amount ? 'is-selected' : ''}>
                  <strong>{amount >= 1000000 ? `${amount / 1000000} triệu` : amount.toLocaleString('vi-VN')}</strong>
                  <small>{amount <= 2000000 ? 'Gọn nhẹ' : amount <= 5000000 ? 'Vừa đủ' : amount <= 9000000 ? 'Thoải mái' : 'Rộng rãi'}</small>
                </button>
              ))}
            </div>
            <label className="planner-budget-field">
              <span>Hoặc nhập khoản chi của bạn</span>
              <span className="planner-money-input"><input type="number" inputMode="numeric" min={1000000} max={100000000} step={500000} value={request.budgetVnd || ''} onChange={(event) => onChange({ ...request, budgetVnd: Number(event.target.value) })} /><i>VNĐ</i></span>
            </label>
            {!stepIsValid && <p className="planner-error" role="alert">Ngân sách tối thiểu là 1.000.000đ để hệ thống có thể tạo phương án phù hợp.</p>}
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="planner-question-kicker">Không có một kiểu du lịch đúng cho tất cả</p>
            <h2 ref={questionRef} tabIndex={-1}>Điều gì khiến bạn muốn lên đường?</h2>
            <p className="planner-question-help">Chọn một hoặc vài cảm hứng. TravelGO sẽ dùng chúng để xếp hạng điểm đến.</p>
            <div className="preference-list">
              {preferences.map(([id, label, description], index) => (
                <button key={id} type="button" aria-pressed={request.preferences.includes(id)} onClick={() => togglePreference(id)} className={request.preferences.includes(id) ? 'is-selected' : ''}>
                  <span>{String(index + 1).padStart(2, '0')}</span><strong>{label}</strong><small>{description}</small>
                </button>
              ))}
            </div>
            {!stepIsValid && <p className="planner-error" role="alert">Hãy chọn ít nhất một điều bạn muốn trải nghiệm.</p>}
          </div>
        )}

        {step === 4 && (
          <div>
            <p className="planner-question-kicker">Chỉ còn một lựa chọn nhỏ</p>
            <h2 ref={questionRef} tabIndex={-1}>Bạn muốn ưu tiên điều gì nhất?</h2>
            <p className="planner-question-help">Lựa chọn này giúp TravelGO cân nhắc các phương án di chuyển phù hợp hơn.</p>
            <div className="priority-list">
              {priorities.map(([value, label, description]) => (
                <button key={value} type="button" aria-pressed={request.priority === value} onClick={() => onChange({ ...request, priority: value })} className={request.priority === value ? 'is-selected' : ''}>
                  <span aria-hidden="true" /><strong>{label}</strong><small>{description}</small>
                </button>
              ))}
            </div>
            <div className="planner-review">
              <p>Tóm tắt chuyến đi</p>
              <dl>
                <div><dt>Xuất phát</dt><dd>{origins.find(([value]) => value === request.origin)?.[1] || request.origin}</dd></div>
                <div><dt>Thời gian</dt><dd>{request.numDays} ngày · {request.numPeople} người</dd></div>
                <div><dt>Ngân sách</dt><dd>{request.budgetVnd.toLocaleString('vi-VN')}đ</dd></div>
                <div><dt>Cảm hứng</dt><dd>{selectedPreferenceLabels}</dd></div>
              </dl>
            </div>
          </div>
        )}
      </fieldset>

      <div className="planner-actions">
        <button type="button" className="planner-back" disabled={step === 0 || loading} onClick={() => setStep((current) => Math.max(0, current - 1))}>
          <ArrowLeft size={16} aria-hidden="true" /> Quay lại
        </button>
        <button type="submit" className="button-primary inline-flex items-center justify-center gap-2 px-5 py-3" disabled={!stepIsValid || loading}>
          {step === lastStep ? (loading ? 'Đang chuẩn bị hành trình…' : 'Tạo hành trình của tôi') : 'Tiếp tục'}
          {!loading && <ArrowRight size={16} aria-hidden="true" />}
        </button>
      </div>
    </form>
  );
}
