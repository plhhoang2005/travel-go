import React from 'react';

interface AiExplanationBoxProps {
  explanation: string;
  dataSources: Record<string, string>;
  assumptions: string[];
}

export function AiExplanationBox({ explanation, dataSources, assumptions }: AiExplanationBoxProps) {
  // Parse paragraphs separated by double linebreaks
  const paragraphs = (explanation || '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const isLiveWeather = Object.values(dataSources || {}).some(
    (v) => typeof v === 'string' && v.toLowerCase().includes('live')
  );

  const renderFormattedText = (text: string) => {
    // Basic bold markdown renderer: **text** -> <strong>text</strong>
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-bold text-ink">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  const getPillarBadge = (text: string) => {
    if (text.includes('🎯') || text.includes('Lựa chọn Tối ưu')) {
      return {
        label: 'Mô hình MCDA (TOPSIS)',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        cardClass: 'border-amber-200 bg-amber-50/40',
      };
    }
    if (text.includes('🚗') || text.includes('Pareto')) {
      return {
        label: 'Tối ưu Pareto (Đa mục tiêu)',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
        cardClass: 'border-blue-200 bg-blue-50/40',
      };
    }
    if (text.includes('🌤️') || text.includes('Thời tiết')) {
      return {
        label: 'Open-Meteo Thời Gian Thực',
        badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
        cardClass: 'border-sky-200 bg-sky-50/40',
      };
    }
    if (text.includes('💰') || text.includes('Tài chính') || text.includes('An toàn')) {
      return {
        label: 'Mô phỏng Độ nhạy Ngân sách',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        cardClass: 'border-emerald-200 bg-emerald-50/40',
      };
    }
    return {
      label: 'Phân tích Ra Quyết Định',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
      cardClass: 'border-slate-200 bg-slate-50/40',
    };
  };

  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-sm space-y-6">
      {/* Header & Transparency Flags */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-brand/10 text-brand font-bold text-sm">
              🧠
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-brand">
              Decision Intelligence Explanation Layer
            </span>
          </div>
          <h2 className="mt-1 text-xl md:text-2xl font-bold text-ink">
            Vì Sao TravelGO Đề Xuất Chuyến Đi Này?
          </h2>
          <p className="mt-1 text-xs md:text-sm text-muted">
            Thuyết minh minh bạch dựa trên 4 trụ cột toán học và dữ liệu kiểm chứng được (không bị ảo giác/hallucination).
          </p>
        </div>

        {/* System Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${
              isLiveWeather
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isLiveWeather ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {isLiveWeather ? 'Open-Meteo Live API' : 'Dữ liệu thời tiết [FALLBACK]'}
          </span>

          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
            ⚡ Độ trễ: &lt; 50ms
          </span>
        </div>
      </div>

      {/* Structured Explanation Cards */}
      <div className="grid gap-3.5 md:grid-cols-2">
        {paragraphs.map((p, idx) => {
          const config = getPillarBadge(p);
          return (
            <div
              key={idx}
              className={`rounded-2xl border p-4 transition-all ${config.cardClass}`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${config.badgeClass}`}>
                  {config.label}
                </span>
                <span className="text-xs text-muted font-mono">Trụ cột #{idx + 1}</span>
              </div>
              <p className="text-xs md:text-sm leading-relaxed text-slate-800">
                {renderFormattedText(p)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Data Sources and Assumptions (Collapsible) */}
      <details className="group rounded-2xl bg-slate-50 border border-slate-100 p-4 transition-all">
        <summary className="flex cursor-pointer items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-ink">
          <span>🔍 Xem nguồn dữ liệu, trọng số toán học & giả định mô hình</span>
          <span className="transition-transform group-open:rotate-180">▾</span>
        </summary>

        <div className="mt-4 grid gap-6 border-t border-slate-200 pt-4 text-xs text-muted md:grid-cols-2">
          <div>
            <h4 className="font-bold text-ink mb-2">Dữ liệu & Nguồn gốc</h4>
            <ul className="space-y-1.5">
              {Object.entries(dataSources || {}).map(([key, value]) => (
                <li key={key} className="flex justify-between gap-4 border-b border-slate-200/60 pb-1">
                  <span className="capitalize font-semibold text-slate-700">{key}</span>
                  <span className="text-right text-ink font-mono">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          {assumptions && assumptions.length > 0 && (
            <div>
              <h4 className="font-bold text-ink mb-2">Giả định & Lưu ý vận hành</h4>
              <ul className="list-disc space-y-1.5 pl-4 text-slate-700">
                {assumptions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </details>
    </section>
  );
}
