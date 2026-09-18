import { Link } from 'react-router-dom';
import { PageIntro } from '../components/PageIntro';
const content = {
  hotel: ['Khách sạn', 'Chi phí lưu trú được tổng hợp trong ngân sách chuyến đi.', '/budget', 'Xem ngân sách lưu trú'],
  food: ['Ăn uống', 'Xem các hoạt động ăn uống trong lịch trình và khoản chi tương ứng.', '/itinerary', 'Xem lịch trình'],
  tips: ['Gợi ý du lịch', 'Đi ngày thường, dành thời gian dự phòng và kiểm tra giá trước khi đặt dịch vụ.', '/planner', 'Lập kế hoạch'],
  about: ['Về TravelGO', 'Một nơi để cân nhắc điểm đến, cách di chuyển và chi phí, trước khi bạn lên đường.', '/planner', 'Bắt đầu chuyến đi'],
} as const;

export function ServicePage({ type }: { type: keyof typeof content }) {
  const [title, copy, to, label] = content[type];
  return (
    <>
      <PageIntro eyebrow="TravelGO" title={title}>{copy}</PageIntro>
      <div className="page-shell py-12">
        {type === 'about' ? (
          <div className="about-layout">
            <div className="about-copy">
              <p className="eyebrow">Thiết kế cho quyết định thật</p>
              <h2>Từ một ý tưởng, đến một kế hoạch rõ ràng.</h2>
              <p>TravelGO đặt điểm đến, phương tiện, khoản chi và lịch trình trong cùng một hành trình. Bạn không cần mở nhiều bảng so sánh chỉ để biết lựa chọn nào hợp với mình.</p>
              <p>Mỗi đề xuất đều đi cùng tiêu chí và nguồn dữ liệu để bạn tự cân nhắc. Giá và thời tiết vẫn mang tính tham khảo; hãy kiểm tra thông tin thực tế trước khi đặt dịch vụ.</p>
              <Link to={to} className="button-primary inline-flex px-5 py-3 text-sm">{label}</Link>
            </div>
            <figure><img src="/images/ninh-binh.webp" alt="Dòng thuyền đi giữa cảnh quan xanh ở Ninh Bình" loading="lazy" /><figcaption>Đi đủ rõ ràng để còn chỗ cho những bất ngờ.</figcaption></figure>
          </div>
        ) : (
          <div className="max-w-3xl space-y-5 text-base leading-8 text-muted"><p>Thông tin phù hợp sẽ có khi bạn tạo kế hoạch. Bạn có thể xem các phần liên quan qua liên kết bên dưới.</p><Link to={to} className="button-primary inline-flex px-5 py-2.5 text-sm">{label}</Link></div>
        )}
      </div>
    </>
  );
}
