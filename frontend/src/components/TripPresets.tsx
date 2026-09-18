interface TripPresetsProps {
  onApplyPreset: (presetId: number) => void;
  loading: boolean;
}

const presets = [
  { id: 1, destination: 'Đà Lạt', details: '3 ngày · 2 người · 4 triệu' },
  { id: 2, destination: 'Phú Quốc', details: '4 ngày · 3 người · 8 triệu' },
  { id: 3, destination: 'Vũng Tàu', details: '2 ngày · 2 người · 1,5 triệu' },
];

export function TripPresets({ onApplyPreset, loading }: TripPresetsProps) {
  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center">
      <p className="shrink-0 text-sm font-semibold text-slate-700">Gợi ý nhanh:</p>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={loading}
            onClick={() => onApplyPreset(preset.id)}
            className="preset-button"
          >
            <span className="font-semibold text-slate-800">{preset.destination}</span><span className="text-slate-400"> · </span>
            <span className="text-xs text-slate-500">{preset.details}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
