import { useState } from 'react';
import { Printer, Copy, Check, Calendar, Users, Wallet, Compass, Car, ShieldCheck } from 'lucide-react';
import { EmptyTripState } from '../components/EmptyTripState';
import { ItineraryTimeline } from '../components/ItineraryTimeline';
import { PageIntro } from '../components/PageIntro';
import { TripResultNav } from '../components/TripResultNav';
import { PlanTripRequest, PlanTripResponse, ItineraryDayData } from '../types/trip';

export function ItineraryPage({
  request,
  response,
  departureDate,
}: {
  request: PlanTripRequest;
  response: PlanTripResponse | null;
  departureDate?: string;
}) {
  const [viewMode, setViewMode] = useState<'tabs' | 'all'>('tabs');
  const [copied, setCopied] = useState(false);
  // Support local customization: keep local days state initialized from response
  const [localDays, setLocalDays] = useState<ItineraryDayData[] | null>(null);

  const days = localDays || response?.itineraryDays || [];

  const winner = response?.topDestinations?.find((d) => d.id === response.winnerId) || response?.topDestinations?.[0];
  const bestTransport = response?.transportOptions?.find((t) => t.isParetoOptimal) || response?.transportOptions?.[0];

  const handleDeleteActivity = (dayNum: number, activityIndex: number) => {
    const updated = (days.length ? [...days] : response?.itineraryDays || []).map((day) => {
      if (day.day === dayNum) {
        const nextActivities = [...day.activities];
        nextActivities.splice(activityIndex, 1);
        return { ...day, activities: nextActivities };
      }
      return day;
    });
    setLocalDays(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = async () => {
    if (!response || !winner) return;

    let text = `✈️ KẾ HOẠCH DU LỊCH: ${winner.name.toUpperCase()}\n`;
    text += `📅 Thời lượng: ${request.numDays} ngày · ${request.numPeople} người\n`;
    if (departureDate) {
      text += `🗓️ Khởi hành: ${new Date(departureDate + 'T00:00:00').toLocaleDateString('vi-VN')}\n`;
    }
    text += `💰 Ngân sách: ${request.budgetVnd.toLocaleString('vi-VN')}đ\n`;
    if (bestTransport) {
      text += `🚗 Di chuyển: ${bestTransport.displayName} (${bestTransport.durationHours}h - ${bestTransport.priceTotalVnd.toLocaleString('vi-VN')}đ)\n`;
    }
    text += `\n📋 LỊCH TRÌNH TỪNG NGÀY:\n`;

    days.forEach((day) => {
      text += `\n[Ngày ${day.day}]: ${day.title}\n`;
      day.activities.forEach((act) => {
        text += `  • ${act.time} - ${act.title} (${act.durationHours}h${act.costVnd > 0 ? ` - ${act.costVnd.toLocaleString('vi-VN')}đ` : ' - Miễn phí'})\n`;
      });
    });

    if (response.budgetBreakdown) {
      text += `\n💵 DỰ TOÁN CHI PHÍ:\n`;
      text += `  • Di chuyển: ${response.budgetBreakdown.transport.toLocaleString('vi-VN')}đ\n`;
      text += `  • Lưu trú: ${response.budgetBreakdown.accommodation.toLocaleString('vi-VN')}đ\n`;
      text += `  • Ăn uống: ${response.budgetBreakdown.food.toLocaleString('vi-VN')}đ\n`;
      text += `  • Vé tham quan: ${response.budgetBreakdown.attractions.toLocaleString('vi-VN')}đ\n`;
      text += `  • Quỹ dự phòng: ${response.budgetBreakdown.remainingSafetyMargin.toLocaleString('vi-VN')}đ\n`;
    }

    text += `\n— Lập bởi TravelGO Decision Intelligence System —`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <>
      <PageIntro eyebrow="Mỗi ngày một trải nghiệm" title="Lịch trình của bạn">
        {response
          ? `Lịch trình được tối ưu theo thời gian và ngân sách cho ${request.numPeople} người trong ${days.length} ngày.`
          : 'Một hành trình rõ ràng, để bạn tận hưởng chuyến đi trọn vẹn.'}
        {departureDate && ` Khởi hành dự kiến: ${new Date(departureDate + 'T00:00:00').toLocaleDateString('vi-VN')}.`}
      </PageIntro>

      {response ? (
        <div className="page-shell space-y-8 py-8 md:py-10">
          <TripResultNav />

          {/* Action Toolbar (Hidden in Print) */}
          <div className="no-print flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-line shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Chế độ xem:</span>
              <div className="inline-flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('tabs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    viewMode === 'tabs' ? 'bg-white text-ocean-800 shadow-sm' : 'text-slate-600 hover:text-ink'
                  }`}
                >
                  Từng ngày (Tab)
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    viewMode === 'all' ? 'bg-white text-ocean-800 shadow-sm' : 'text-slate-600 hover:text-ink'
                  }`}
                >
                  Xem toàn bộ
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopySummary}
                className="button-secondary flex items-center gap-1.5 px-3.5 py-2 text-xs"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                {copied ? 'Đã sao chép!' : 'Sao chép tóm tắt'}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="button-primary flex items-center gap-1.5 px-4 py-2 text-xs"
              >
                <Printer size={14} />
                In / Lưu PDF
              </button>
            </div>
          </div>

          {/* Printable Trip Summary Header Card */}
          <div className="print-card rounded-2xl border border-line bg-gradient-to-r from-ocean-50/70 via-white to-ocean-50/40 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line/80">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ocean-700">Tổng quan chuyến đi</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-ink mt-1">{winner?.name || 'Kế hoạch du lịch'}</h2>
                <p className="text-sm text-muted mt-1">
                  Xuất phát từ {request.origin} · {request.numDays} ngày {request.numDays - 1} đêm · {request.numPeople} người
                  {departureDate && ` · Khởi hành ${new Date(departureDate + 'T00:00:00').toLocaleDateString('vi-VN')}`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-xl bg-white border border-line px-4 py-2.5 shadow-sm text-left md:text-right">
                  <span className="text-[11px] text-muted block">Tổng ngân sách</span>
                  <span className="text-lg font-bold text-brand">{request.budgetVnd.toLocaleString('vi-VN')}đ</span>
                </div>
                {response.budgetBreakdown && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200/80 px-4 py-2.5 shadow-sm text-left md:text-right">
                    <span className="text-[11px] text-emerald-800 block flex items-center gap-1">
                      <ShieldCheck size={12} /> Quỹ dự phòng an toàn
                    </span>
                    <span className="text-lg font-bold text-emerald-700">
                      {response.budgetBreakdown.remainingSafetyMargin.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-100">
                <Compass size={16} className="text-ocean-600 shrink-0" />
                <div>
                  <span className="text-slate-500 block text-[10px]">Điểm phù hợp AI</span>
                  <span className="font-semibold text-ink">{Math.round((winner?.totalScore || 8.5) * 10)} / 100</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-100">
                <Car size={16} className="text-ocean-600 shrink-0" />
                <div className="truncate">
                  <span className="text-slate-500 block text-[10px]">Phương tiện</span>
                  <span className="font-semibold text-ink truncate block" title={bestTransport?.displayName}>
                    {bestTransport?.displayName || 'Vận tải tối ưu'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-100">
                <Calendar size={16} className="text-ocean-600 shrink-0" />
                <div>
                  <span className="text-slate-500 block text-[10px]">Tổng hoạt động</span>
                  <span className="font-semibold text-ink">
                    {days.reduce((acc, d) => acc + d.activities.length, 0)} điểm tham quan
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-100">
                <Users size={16} className="text-ocean-600 shrink-0" />
                <div>
                  <span className="text-slate-500 block text-[10px]">Quy mô nhóm</span>
                  <span className="font-semibold text-ink">{request.numPeople} người</span>
                </div>
              </div>
            </div>
          </div>

          {/* Day by Day Itinerary */}
          <ItineraryTimeline
            days={days}
            viewMode={viewMode}
            onDeleteActivity={handleDeleteActivity}
          />
        </div>
      ) : (
        <EmptyTripState />
      )}
    </>
  );
}
