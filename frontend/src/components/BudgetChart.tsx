import { BudgetBreakdownData } from '../types/trip';

export function BudgetChart({ budget }: { budget: BudgetBreakdownData }) {
  const rows = [
    { name: 'Di chuyển', value: budget.transport, color: '#287E9A' },
    { name: 'Lưu trú', value: budget.accommodation, color: '#5CB8D1' },
    { name: 'Ăn uống', value: budget.food, color: '#FFC978' },
    { name: 'Trải nghiệm', value: budget.attractions, color: '#F5A85B' },
    { name: 'Dự phòng', value: Math.max(0, budget.remainingSafetyMargin), color: '#BDE7F2' },
  ];
  const spent = budget.transport + budget.accommodation + budget.food + budget.attractions;
  const totalBudget = spent + budget.remainingSafetyMargin;
  const chartTotal = rows.reduce((total, row) => total + row.value, 0) || 1;
  const isOverBudget = budget.remainingSafetyMargin < 0;
  const money = (amount: number) => `${amount.toLocaleString('vi-VN')}đ`;

  return (
    <section className="budget-story" aria-labelledby="budget-heading">
      <div className="budget-story-head">
        <div><p className="eyebrow">Khoản chi trong tầm tay</p><h2 id="budget-heading">Ngân sách chuyến đi</h2></div>
        <div className="budget-total"><span>Dự kiến cho toàn bộ hành trình</span><strong>{money(spent)}</strong></div>
      </div>

      <div className="budget-bar" role="img" aria-label={`Chi phí dự kiến ${money(spent)}, ngân sách ${money(totalBudget)}`}>
        {rows.filter((row) => row.value > 0).map((row) => <span key={row.name} style={{ width: `${(row.value / chartTotal) * 100}%`, backgroundColor: row.color }} title={`${row.name}: ${money(row.value)}`} />)}
      </div>

      <dl className="budget-rows">
        {rows.map((row, index) => (
          <div key={row.name}>
            <dt><span style={{ backgroundColor: row.color }} aria-hidden="true" />{String(index + 1).padStart(2, '0')} · {row.name}</dt>
            <dd><strong>{money(row.value)}</strong><small>{Math.max(0, Math.round((row.value / chartTotal) * 100))}% ngân sách</small></dd>
          </div>
        ))}
      </dl>

      <div className={isOverBudget ? 'budget-note is-over' : 'budget-note'} role={isOverBudget ? 'alert' : undefined}>
        <span>{isOverBudget ? 'Cần điều chỉnh' : 'Khoảng thở còn lại'}</span>
        <p>{isOverBudget ? `Kế hoạch đang vượt ${money(Math.abs(budget.remainingSafetyMargin))}. Hãy giảm một hạng mục hoặc tăng ngân sách trước khi đặt dịch vụ.` : `${money(budget.remainingSafetyMargin)} được giữ lại cho những chi phí phát sinh trên đường.`}</p>
      </div>
    </section>
  );
}
