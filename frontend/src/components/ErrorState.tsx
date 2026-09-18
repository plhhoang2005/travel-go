import { RefreshCw } from 'lucide-react';

interface ErrorStateProps { message: string; onRetry: () => void; onUseDemo: () => void; }

export function ErrorState({ message, onRetry, onUseDemo }: ErrorStateProps) {
  return (
    <section role="alert" className="content-section text-center">
      <p className="text-sm font-semibold text-rose-700">Kết nối bị gián đoạn</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">Không thể kết nối với TravelGO</h2>
      <p className="mx-auto mt-3 max-w-xl text-muted">{message} Có vẻ hệ thống phân tích chuyến đi hiện chưa phản hồi.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onRetry} className="button-primary inline-flex items-center gap-2 px-5 py-3"><RefreshCw size={16} />Thử lại</button>
        <button type="button" onClick={onUseDemo} className="button-secondary px-5 py-3">Xem dữ liệu demo</button>
      </div>
    </section>
  );
}
