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
    <div className="trip-presets">
      <p>Gợi ý nhanh</p>
      <div>
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={loading}
            onClick={() => onApplyPreset(preset.id)}
            className="preset-button"
          >
            <span>{preset.destination}</span><i> · </i><small>{preset.details}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
