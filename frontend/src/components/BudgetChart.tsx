import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { BudgetBreakdownData } from '../types/trip';

export function BudgetChart({ budget }: { budget: BudgetBreakdownData }) {
  const rows = [
    { name: 'Di chuyển', value: budget.transport, color: '#4DA8DA' },
    { name: 'Khách sạn', value: budget.accommodation, color: '#8ACCE8' },
    { name: 'Ăn uống', value: budget.food, color: '#F6C98B' },
    { name: 'Tham quan', value: budget.attractions, color: '#F9E7A8' },
    { name: 'Dự phòng', value: Math.max(0, budget.remainingSafetyMargin), color: '#BDDDE3' },
  ];
  const spent = budget.transport + budget.accommodation + budget.food + budget.attractions;
  const totalBudget = spent + budget.remainingSafetyMargin;
  const isOverBudget = budget.remainingSafetyMargin < 0;
  const visibleRows = rows.filter((row) => row.value > 0);
  const money = (amount: number) => `${amount.toLocaleString('vi-VN')}đ`;

  return (
    <section className="content-section">
      <div className="section-heading"><p className="eyebrow">Chi tiêu rõ ràng</p><h2>Phân bổ ngân sách</h2><p>Các khoản chi và phần dự phòng cho toàn bộ kế hoạch.</p></div>
      <div className="grid items-center gap-8 md:grid-cols-[0.85fr_1.15fr]">
        <div className="relative mx-auto h-64 w-full max-w-xs" aria-label="Biểu đồ phân bổ chi phí; số liệu chi tiết nằm trong danh sách bên cạnh.">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart><Pie data={visibleRows} dataKey="value" nameKey="name" innerRadius={76} outerRadius={106} paddingAngle={3} stroke="none" isAnimationActive={false}>
              {visibleRows.map((row) => <Cell key={row.name} fill={row.color} />)}
            </Pie><Tooltip formatter={(value: number) => money(value)} /></PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center"><span className="text-xs text-muted">Chi phí dự kiến</span><strong className="mt-1 text-lg">{money(spent)}</strong></div>
        </div>
        <div>
          <dl className="divide-y divide-line">{rows.map((row) => <div key={row.name} className="flex items-center justify-between gap-3 py-3 text-sm"><dt className="flex items-center gap-3 text-muted"><span className="h-3 w-3 rounded-sm" style={{ background: row.color }} aria-hidden="true" />{row.name}</dt><dd className="font-semibold">{money(row.value)}</dd></div>)}</dl>
          <p role={isOverBudget ? 'alert' : undefined} className={`mt-4 rounded-lg border px-4 py-3 text-sm leading-6 ${isOverBudget ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-line bg-ocean-50 text-ocean-800'}`}>
            {isOverBudget ? `Kế hoạch vượt ngân sách ${money(Math.abs(budget.remainingSafetyMargin))}. Bạn có thể điều chỉnh tại trang Lập kế hoạch.` : `Bạn còn ${money(budget.remainingSafetyMargin)} để dự phòng cho chi phí phát sinh.`}
          </p>
        </div>
      </div>
      <dl className="mt-8 grid gap-5 border-t border-line pt-6 sm:grid-cols-3">
        {[
          ['Ngân sách', money(totalBudget)],
          ['Chi phí dự kiến', money(spent)],
          [isOverBudget ? 'Vượt ngân sách' : 'Còn lại', money(Math.abs(budget.remainingSafetyMargin))],
        ].map(([label, value]) => <div key={label}><dt className="text-xs text-muted">{label}</dt><dd className="mt-2 text-lg font-semibold">{value}</dd></div>)}
      </dl>
    </section>
  );
}
