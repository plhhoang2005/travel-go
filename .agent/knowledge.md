# KNOWLEDGE BASE & MEMORY — TRIPAI (TRAVELGO)

Cơ sở tri thức toàn diện, các quyết định kiến trúc bất biến (ADRs), nợ kỹ thuật được chấp nhận và bộ nhớ bài học kinh nghiệm (Episodic Memory).

---

## 1. Project Context & Target Persona

### 1.1. Tầm Nhìn Sản Phẩm
TravelGO (TripAI) là nền tảng **Trí tuệ Nhân tạo Hỗ trợ Ra Quyết định (Decision Intelligence)** trong du lịch và di chuyển thông minh cho người Việt.
- **Bài toán cốt lõi**: "Với ngân sách X triệu đồng, xuất phát từ Y trong Z ngày, đi cùng gia đình/bạn bè thì nên đi đâu, đi bằng phương tiện gì để tối ưu chi phí vs thời gian, và lịch trình sắp xếp ra sao?"
- **Triết lý cốt lõi**: Tránh bẫy Chatbot văn bản. Thay vào đó là **Interactive Dashboard** với thanh trượt tương tác thời gian thực, biểu đồ Recharts và thẻ điểm số minh bạch có thể kiểm chứng toán học.

### 1.2. Chân Dung Khách Hàng Mục Tiêu (Target Persona)
- **Tên**: Minh (25 tuổi, kỹ sư CNTT tại TP. Hồ Chí Minh).
- **Ngân sách**: 3.000.000 – 5.000.000 VNĐ / người.
- **Thời lượng**: Chuyến đi 2 – 4 ngày (cuối tuần hoặc nghỉ lễ ngắn).
- **Quy mô nhóm**: Nhóm bạn thân 3-4 người hoặc gia đình nhỏ.
- **Mối quan tâm hàng đầu**: Cân nhắc phương tiện tối ưu (xe khách/tàu hỏa tiết kiệm vs máy bay nhanh), điểm đến có thời tiết thuận lợi và lịch trình cân đối (tối đa 3-4 điểm tham quan/ngày, không bị quá tải).

---

## 2. Architecture Decisions Records (ADRs)

### ADR-001: Monorepo Architecture cho Frontend và Backend
- **Trạng thái**: Accepted
- **Bối cảnh**: Hệ thống bao gồm Backend Spring Boot và Frontend React TypeScript. Cần đảm bảo hợp đồng dữ liệu (API Contract) luôn đồng bộ.
- **Quyết định**: Quản lý `frontend/` và `backend/` trong cùng một Git repository.
- **Hệ quả**: Cho phép thực hiện các commit nguyên tử (atomic commits) cập nhật cả DTO Java và Type TypeScript trong cùng một task.

### ADR-002: Lõi Thuật Toán Quyết Định Tất Định (Pure Java Engines)
- **Trạng thái**: Accepted
- **Bối cảnh**: Các mô hình tính toán điểm số (MCDA), lọc phương tiện (Pareto), và lập lịch (Greedy) cần tính toán siêu nhanh (< 50ms), kiểm chứng được toán học và không bị biến thiên ngẫu nhiên (hallucination).
- **Quyết định**: Viết các thuật toán bằng Java thuần túy trong package `com.travelgo.decision.*`, không phụ thuộc vào LLM hay framework bên thứ ba.
- **Hệ quả**: Đảm bảo tính minh bạch giải thích được và dễ dàng viết Unit Test độc lập.

### ADR-003: LLM là Tầng Thuyết Minh Bất Đối Xứng (Non-Blocking AI Explainer)
- **Trạng thái**: Accepted
- **Bối cảnh**: Gọi LLM bên ngoài có thể gặp độ trễ cao hoặc cạn hạn ngạch (quota).
- **Quyết định**: Tầng giải thích bằng văn bản (`RuleBasedExplainerService` / `LLMExplainerService`) hoạt động độc lập. Nếu LLM lỗi hoặc timeout, API vẫn trả về đầy đủ kết quả tính toán toán học kèm thông điệp giải thích mặc định.
- **Hệ quả**: Đảm bảo độ sẵn sàng 99.9% cho ứng dụng.

### ADR-004: Lộ Trình Tiến Hóa Dữ Liệu: Mock JSON Sang PostgreSQL + JPA
- **Trạng thái**: Accepted
- **Bối cảnh**: Hiện tại hệ thống dùng 5 file JSON tĩnh để khởi động nhanh trong giai đoạn thử nghiệm.
- **Quyết định**: Duy trì DataLoader từ JSON làm seed data. Khi chuyển sang giai đoạn sản xuất lâu dài, từng bước bổ sung PostgreSQL kết hợp Spring Data JPA và Flyway migration (`V1__init_schema.sql`).

---

## 3. Accepted Technical Debt (Nợ Kỹ Thuật Đã Chấp Nhận)

> **Cảnh báo cho AI Agent**: Tuyệt đối **KHÔNG ĐƯỢC** tự ý refactor hoặc "sửa" các vấn đề dưới đây trừ khi task có yêu cầu chỉ định rõ ràng:

### ISSUE-001: Bộ Dữ Liệu 5 File Mock JSON Tĩnh
- **Hiện trạng**: Toàn bộ điểm đến, khách sạn, giá vé và POI nạp từ `backend/src/main/resources/data/*.json`.
- **Lý do chấp nhận**: Đảm bảo hệ thống khởi chạy độc lập và ổn định khi chấm thi / demo hackathon.

### ISSUE-002: LLM Explainer Đang Dùng Mock / Rule-Based Template
- **Hiện trạng**: Tầng thuyết minh đang dùng template nội suy chuỗi từ kết quả tính toán toán học (`RuleBasedExplainerService.java`).
- **Lý do chấp nhận**: Ưu tiên tính ổn định tuyệt đối và tốc độ phản hồi < 50ms cho Decision Engine cốt lõi.

### ISSUE-003: Chưa Tích Hợp Xác Thực Người Dùng (Authentication)
- **Hiện trạng**: API `/api/v1/plan-trip` là public endpoint, chưa có JWT hay Spring Security.
- **Lý do chấp nhận**: Tập trung tối đa vào bài toán Trí tuệ Ra quyết định (Decision Intelligence).

---

## 4. Episodic Memory & Lessons Learned (Bài Học Kinh Nghiệm Đã Duyệt)

### [ACTIVE] LESSON-001: Tập Trung Hóa API Service ở Frontend
- **Lĩnh vực**: Frontend Architecture
- **Vấn đề**: Gọi `fetch()` hoặc `axios()` rải rác trong component UI gây lặp lại header, base URL và khó xử lý lỗi.
- **Giải pháp**: Mọi lệnh gọi API phải định nghĩa trong `frontend/src/api/tripApi.ts`.
- **Quy tắc cho Agent**: Cấm gọi HTTP client trực tiếp trong các React components.

### [ACTIVE] LESSON-002: Đồng Bộ Nullable Fields Giữa Java và TypeScript
- **Lĩnh vực**: DTO & Type Safety
- **Vấn đề**: Frontend bị crash lỗi runtime `TypeError: Cannot read properties of undefined` khi Backend trả về danh sách phụ rỗng hoặc `null`.
- **Giải pháp**: Luôn khai báo trường phụ ở TypeScript là optional (`field?: Type[]`), và phía React luôn bọc default value an toàn: `(items || []).map(...)`.
- **Quy tắc cho Agent**: Khi sửa DTO ở Backend, kiểm tra và cập nhật ngay interface tương ứng ở Frontend.

### [ACTIVE] LESSON-003: Xử Lý Ngoại Tuyến Khi Gọi Open-Meteo Weather API
- **Lĩnh vực**: External Service Resilience
- **Vấn đề**: Khi mất kết nối internet hoặc API thời tiết lỗi rate-limit, backend ném ngoại lệ 500 làm hỏng toàn bộ luồng tính toán.
- **Giải pháp**: Bọc lệnh gọi WebClient trong `try-catch`, trả về mock weather fallback kèm cờ minh bạch `isFallback = true`.
- **Quy tắc cho Agent**: Mọi tích hợp API ngoài bắt buộc có cơ chế fallback an toàn, không bao giờ để sập luồng chính.
