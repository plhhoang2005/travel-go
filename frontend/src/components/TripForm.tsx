import React from 'react';
import { PlanTripRequest } from '../types/trip';

interface TripFormProps {
  request: PlanTripRequest;
  onChange: (req: PlanTripRequest) => void;
  onSubmit: () => void;
  onApplyPreset: (presetId: number) => void;
  loading: boolean;
}

export const TripForm: React.FC<TripFormProps> = ({
  request,
  onChange,
  onSubmit,
  onApplyPreset,
  loading,
}) => {
  const preferencesList = [
    { id: 'mountain', label: '⛰️ Núi & Đồi' },
    { id: 'beach', label: '🏖️ Biển & Đảo' },
    { id: 'food', label: '🍜 Ẩm thực' },
    { id: 'romantic', label: '🌸 Lãng mạn' },
    { id: 'resort', label: '🏨 Nghỉ dưỡng' },
  ];

  const togglePref = (id: string) => {
    const current = request.preferences;
    const updated = current.includes(id)
      ? current.filter((p) => p !== id)
      : [...current, id];
    onChange({ ...request, preferences: updated });
  };

  const isValid = request.preferences.length > 0 && request.budgetVnd > 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>⚙️</span> Thông tin Chuyến đi
        </h2>
        
        {/* Presets Quick Fill */}
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => onApplyPreset(1)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium"
          >
            📍 Demo 1: Đà Lạt
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset(2)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
          >
            📍 Demo 2: Phú Quốc
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset(3)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium"
          >
            📍 Demo 3: Vũng Tàu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-1">
        {/* Origin */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Xuất phát từ
          </label>
          <select
            value={request.origin}
            onChange={(e) => onChange({ ...request, origin: e.target.value })}
            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="Ho Chi Minh">TP. Hồ Chí Minh</option>
            <option value="Ha Noi">Hà Nội</option>
            <option value="Da Nang">Đà Nẵng</option>
          </select>
        </div>

        {/* Num Days */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Số ngày di chuyển: <span className="text-emerald-600 font-bold">{request.numDays} ngày</span>
          </label>
          <input
            type="range"
            aria-label="Số ngày đi"
            min="2"
            max="5"
            value={request.numDays}
            onChange={(e) => onChange({ ...request, numDays: Number(e.target.value) })}
            className="w-full accent-emerald-600"
          />
        </div>

        {/* Num People */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Số người đi: <span className="text-emerald-600 font-bold">{request.numPeople} người</span>
          </label>
          <input
            type="range"
            aria-label="Số người đi"
            min="1"
            max="6"
            value={request.numPeople}
            onChange={(e) => onChange({ ...request, numPeople: Number(e.target.value) })}
            className="w-full accent-emerald-600"
          />
        </div>
      </div>

      {/* Budget Slider */}
      <div className="mb-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold text-emerald-800">
            Ngân sách tổng cộng
          </label>
          <span className="text-lg font-extrabold text-emerald-600">
            {request.budgetVnd.toLocaleString('vi-VN')} VNĐ
          </span>
        </div>
        <input
          type="range"
          aria-label="Ngân sách tổng cộng"
          min="1000000"
          max="15000000"
          step="500000"
          value={request.budgetVnd}
          onChange={(e) => onChange({ ...request, budgetVnd: Number(e.target.value) })}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>1.000.000 VNĐ</span>
          <span>5.000.000 VNĐ</span>
          <span>10.000.000 VNĐ</span>
          <span>15.000.000 VNĐ</span>
        </div>
      </div>

      {/* Preferences Chips */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-500 mb-2">
          Sở thích du lịch
        </label>
        <div className="flex flex-wrap gap-2">
          {preferencesList.map((pref) => {
            const selected = request.preferences.includes(pref.id);
            return (
              <button
                key={pref.id}
                type="button"
                aria-pressed={selected}
                onClick={() => togglePref(pref.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {pref.label}
              </button>
            );
          })}
        </div>
        {!isValid && (
          <p role="alert" className="mt-2 text-sm font-medium text-rose-600">
            Hãy chọn ít nhất một sở thích để hệ thống có thể đề xuất điểm đến.
          </p>
        )}
      </div>

      <fieldset className="mb-5">
        <legend className="mb-2 text-sm font-semibold text-slate-600">Ưu tiên chuyến đi</legend>
        <div className="grid grid-cols-2 gap-2">
          {([
            ['cheapest', 'Tiết kiệm'],
            ['fastest', 'Nhanh nhất'],
            ['balanced', 'Cân bằng'],
            ['comfortable', 'Thoải mái'],
          ] as const).map(([value, label]) => (
            <label
              key={value}
              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-semibold transition-colors ${
                request.priority === value
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="priority"
                value={value}
                checked={request.priority === value}
                onChange={() => onChange({ ...request, priority: value })}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        type="button"
        disabled={loading || !isValid}
        aria-busy={loading}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <span>⏳ Đang phân tích Decision Engine...</span>
        ) : (
          <span>🚀 Phân Tích & Phân Bổ Chuyến Đi</span>
        )}
      </button>
    </div>
  );
};
