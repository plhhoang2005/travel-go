import React from 'react';
import { BudgetBreakdownData } from '../types/trip';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface BudgetChartProps {
  budget: BudgetBreakdownData;
}

export const BudgetChart: React.FC<BudgetChartProps> = ({ budget }) => {
  const data = [
    { name: 'Di chuyển', value: budget.transport, color: '#059669' },
    { name: 'Lưu trú', value: budget.accommodation, color: '#0284c7' },
    { name: 'Ăn uống', value: budget.food, color: '#f59e0b' },
    { name: 'Tham quan', value: budget.attractions, color: '#8b5cf6' },
    { name: 'Dự phòng an toàn', value: budget.remainingSafetyMargin, color: '#10b981' },
  ].filter((item) => item.value > 0);

  const totalSpent = budget.transport + budget.accommodation + budget.food + budget.attractions;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
        <span>💰</span> Phân Bổ Ngân Sách Dự Kiến
      </h3>
      <p className="text-xs text-slate-500 mb-3">
        Tổng chi phí dự tính: <span className="font-bold text-emerald-600">{totalSpent.toLocaleString('vi-VN')} VNĐ</span>
      </p>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value.toLocaleString('vi-VN')} VNĐ`} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-[11px] bg-slate-50 p-2.5 rounded-xl text-slate-600 border border-slate-100">
        🛡️ <span className="font-semibold">Dự phòng rủi ro:</span> Còn dư{' '}
        <span className="font-bold text-emerald-600">
          {budget.remainingSafetyMargin.toLocaleString('vi-VN')} VNĐ
        </span>{' '}
        cho các chi phí phát sinh bất ngờ.
      </div>
    </div>
  );
};
