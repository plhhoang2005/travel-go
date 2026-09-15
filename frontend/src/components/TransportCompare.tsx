import React from 'react';
import { TransportOptionData } from '../types/trip';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TransportCompareProps {
  options: TransportOptionData[];
}

export const TransportCompare: React.FC<TransportCompareProps> = ({ options }) => {
  const chartData = options.map((opt) => ({
    name: opt.displayName.split(' ')[0] || opt.mode,
    'Chi phí (k VNĐ)': Math.round(opt.priceTotalVnd / 1000),
    'Thời gian (h)': opt.durationHours,
    'Độ thoải mái': opt.comfortScore,
  }));

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
        <span>🚆</span> So Sánh Tradeoff Phương Tiện (Pareto Optimizer)
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        Phân tích đánh đổi giữa Giá tiền vs Thời gian di chuyển vs Độ thoải mái
      </p>

      {/* Chart */}
      <div className="h-48 w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip />
            <Bar dataKey="Chi phí (k VNĐ)" fill="#059669" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Thời gian (h)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
            <tr>
              <th className="p-2">Phương tiện</th>
              <th className="p-2">Tổng chi phí</th>
              <th className="p-2">Thời gian</th>
              <th className="p-2">Thoải mái</th>
              <th className="p-2">Đánh giá Pareto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {options.map((opt) => (
              <tr key={opt.mode} className={opt.isParetoOptimal ? 'bg-emerald-50/40' : ''}>
                <td className="p-2 font-medium text-slate-700">{opt.displayName}</td>
                <td className="p-2 font-bold text-emerald-600">{opt.priceTotalVnd.toLocaleString('vi-VN')} đ</td>
                <td className="p-2">{opt.durationHours} giờ</td>
                <td className="p-2">{'⭐'.repeat(Math.min(5, Math.round(opt.comfortScore / 2)))}</td>
                <td className="p-2 text-slate-600">
                  {opt.isParetoOptimal ? (
                    <span className="inline-flex items-center text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      Pareto Optimal ({opt.tradeoffType})
                    </span>
                  ) : (
                    <span className="text-slate-400">Thường</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
