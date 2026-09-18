interface AiExplanationBoxProps { explanation: string; dataSources: Record<string, string>; assumptions: string[]; }

export function AiExplanationBox({ explanation, dataSources, assumptions }: AiExplanationBoxProps) {
  return (
    <section className="content-section">
      <div className="section-heading"><p className="eyebrow">Một đề xuất có thể giải thích</p><h2>Vì sao TravelGO đề xuất chuyến đi này?</h2></div>
      <blockquote className="max-w-4xl border-l-2 border-brand pl-6 text-lg leading-8 text-ink">{explanation}</blockquote>
      <details className="mt-8 border-t border-line pt-5"><summary className="cursor-pointer text-sm font-semibold text-ink">Nguồn dữ liệu & thông tin cần lưu ý</summary>
        <div className="mt-5 grid gap-6 text-sm text-muted md:grid-cols-2"><div><h3 className="font-semibold text-ink">Dữ liệu được xem xét</h3><ul className="mt-3 space-y-2">{Object.entries(dataSources || {}).map(([key, value]) => <li key={key} className="flex justify-between gap-4 border-b border-line pb-2"><span className="capitalize">{key}</span><span className="text-right text-ink">{value}</span></li>)}</ul></div>
          {assumptions?.length > 0 && <div><h3 className="font-semibold text-ink">Thông tin cần lưu ý</h3><ul className="mt-3 list-disc space-y-2 pl-5">{assumptions.map((item) => <li key={item}>{item}</li>)}</ul></div>}</div>
      </details>
    </section>
  );
}
