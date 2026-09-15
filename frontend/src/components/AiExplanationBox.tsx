import React from 'react';

interface AiExplanationBoxProps {
  explanation: string;
  dataSources: Record<string, string>;
  assumptions: string[];
}

export const AiExplanationBox: React.FC<AiExplanationBoxProps> = ({
  explanation,
  dataSources,
  assumptions,
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-md border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <h3 className="font-bold text-base text-emerald-400">
            Giải Thích Từ AI (LLM Explanation Layer)
          </h3>
        </div>

        {/* Data Source Badges */}
        <div className="flex gap-2">
          {Object.entries(dataSources || {}).map(([key, val]) => (
            <span
              key={key}
              className="text-[10px] bg-slate-700/80 text-emerald-300 px-2 py-0.5 rounded border border-slate-600 font-mono"
            >
              {val.includes('Live') ? '🌤️ LIVE' : 'ℹ️ MOCK'}: {val}
            </span>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-200 leading-relaxed mb-4 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
        "{explanation}"
      </p>

      {/* Assumptions */}
      {assumptions && assumptions.length > 0 && (
        <div className="text-xs text-slate-400 border-t border-slate-700/60 pt-3">
          <span className="font-semibold text-amber-400">⚠️ Giả định & Cảnh báo bất định:</span>
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            {assumptions.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
