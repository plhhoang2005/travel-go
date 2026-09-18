const steps = ['Đang so sánh điểm đến', 'Đang kiểm tra ngân sách', 'Đang so sánh phương tiện', 'Đang xây dựng lịch trình'];

export function LoadingState() {
  return (
    <section role="status" aria-live="polite" className="content-section">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-brand">TravelGO đang chuẩn bị hành trình</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">Đang tìm chuyến đi phù hợp với bạn...</h2>
        <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
          {steps.map((step) => <div key={step} className="loading-row"><span className="loading-dot" />{step}</div>)}
        </div>
      </div>
    </section>
  );
}
