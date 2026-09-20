import React, { useState } from 'react';
import { BudgetSensitivityResultData, BudgetStepData, PlanTripRequest } from '../types/trip';

interface Props {
  request: PlanTripRequest;
  sensitivityData: BudgetSensitivityResultData | null;
  onApplyBudget?: (budgetVnd: number) => void;
}

export function BudgetSensitivityPanel({ request, sensitivityData, onApplyBudget }: Props) {
  const [customBudget, setCustomBudget] = useState<number>(request.budgetVnd);

  const steps = sensitivityData?.steps || [];

  // Find closest step or matching step
  const activeStep = steps.find((s) => s.budgetVnd === customBudget) || steps[1] || steps[0];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCustomBudget(val);
  };

  const handleApply = (budgetVnd: number) => {
    setCustomBudget(budgetVnd);
    if (onApplyBudget) {
      onApplyBudget(budgetVnd);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 font-bold text-sm">
              📊
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Mô Phỏng Ra Quyết Định Đa Kịch Bản (What-If Analysis)
            </span>
          </div>
          <h2 className="mt-1 text-xl md:text-2xl font-bold text-ink">
            Độ Nhạy Ngân Sách & Biên Độ An Toàn
          </h2>
          <p className="mt-1 text-xs md:text-sm text-muted">
            Khám phá phương án di chuyển, hạng phòng và mức độ an toàn tài chính khi điều chỉnh ngân sách chuyến đi.
          </p>
        </div>

        {/* Live Safety Badge */}
        {activeStep && (
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-2.5">
            <div className="text-right">
              <span className="text-[11px] font-semibold text-muted block">Biên độ dự phòng</span>
              <span className={`text-sm font-bold ${activeStep.remainingSafetyMarginVnd >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {activeStep.remainingSafetyMarginVnd >= 0 ? '+' : ''}{activeStep.remainingSafetyMarginVnd.toLocaleString('vi-VN')}đ
              </span>
            </div>
            <div className={`h-8 w-1 rounded-full ${activeStep.remainingSafetyMarginVnd >= 500000 ? 'bg-emerald-500' : activeStep.remainingSafetyMarginVnd >= 0 ? 'bg-amber-500' : 'bg-rose-500'}`} />
          </div>
        )}
      </div>

      {/* Interactive Slider */}
      <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="budget-slider" className="text-xs md:text-sm font-bold text-ink flex items-center gap-1.5">
            <span>🎚️ Kéo thử ngân sách:</span>
            <span className="text-brand font-extrabold text-base md:text-lg">
              {customBudget.toLocaleString('vi-VN')} VNĐ
            </span>
          </label>
          <div className="flex gap-2">
            {[3000000, 4000000, 5000000].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => handleApply(b)}
                className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition-all ${
                  customBudget === b
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-white text-muted border border-slate-200 hover:text-ink'
                }`}
              >
                {(b / 1000000).toFixed(0)} Triệu
              </button>
            ))}
          </div>
        </div>

        <input
          id="budget-slider"
          type="range"
          min={2500000}
          max={6500000}
          step={250000}
          value={customBudget}
          onChange={handleSliderChange}
          className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand"
        />

        <div className="flex justify-between text-[11px] font-semibold text-muted">
          <span>2.500.000đ (Tối thiểu)</span>
          <span>4.000.000đ (Tiêu chuẩn Minh)</span>
          <span>6.500.000đ (Tối đa)</span>
        </div>
      </div>

      {/* 3 Step Comparison Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step) => {
          const isSelected = step.budgetVnd === customBudget;
          const isHealthy = step.remainingSafetyMarginVnd >= 500000;
          const isTight = step.remainingSafetyMarginVnd >= 0 && step.remainingSafetyMarginVnd < 500000;

          return (
            <div
              key={step.budgetVnd}
              className={`relative rounded-2xl p-5 transition-all border ${
                isSelected
                  ? 'border-brand bg-brand/5 ring-2 ring-brand/30 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {isSelected && (
                <span className="absolute -top-3 left-4 rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Đang chọn
                </span>
              )}

              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-ink">{step.budgetLabel}</h3>
                  <p className="text-xs text-muted mt-0.5">
                    Ước tính: {step.estimatedTotalCostVnd.toLocaleString('vi-VN')}đ
                  </p>
                </div>
                <span
                  className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                    isHealthy
                      ? 'bg-emerald-100 text-emerald-700'
                      : isTight
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {step.feasibilityStatus}
                </span>
              </div>

              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-sm">
                    {step.recommendedTransportMode === 'may_bay'
                      ? '✈️'
                      : step.recommendedTransportMode === 'tau_lua'
                      ? '🚆'
                      : '🚗'}
                  </span>
                  <span className="truncate">{step.recommendedTransportName || 'Phương tiện tối ưu'}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-sm">🏨</span>
                  <span className="truncate">{step.recommendedHotelName || 'Lưu trú tiêu chuẩn'}</span>
                </div>

                <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between">
                  <span className="text-muted text-[11px]">Dự phòng rủi ro:</span>
                  <span
                    className={`font-bold ${
                      step.remainingSafetyMarginVnd >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {step.remainingSafetyMarginVnd.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleApply(step.budgetVnd)}
                className={`mt-4 w-full rounded-xl py-2 text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isSelected ? '✓ Đã chọn mức này' : 'Áp dụng kịch bản'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Advisory Footer */}
      <div className="rounded-2xl bg-amber-50/70 border border-amber-200/70 p-4 text-xs text-amber-900 flex items-start gap-3">
        <span className="text-base leading-none">💡</span>
        <div className="space-y-1 leading-relaxed">
          <p className="font-bold">Khuyến nghị An toàn Tài chính từ TravelGO:</p>
          <p className="text-amber-800">
            Trong mùa cao điểm du lịch hoặc dịp cuối tuần, giá vé và phòng khách sạn có thể dao động <strong>10% – 15%</strong>.
            Hệ thống khuyến nghị duy trì biên độ an toàn tối thiểu <strong>350.000đ – 500.000đ</strong> để tránh phát sinh chi phí ngoài kế hoạch.
          </p>
        </div>
      </div>
    </section>
  );
}
