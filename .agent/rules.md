# RULES — TRIPAI (TRAVELGO)

Tập hợp toàn bộ các quy chuẩn kỹ thuật bắt buộc tuân thủ đối với AI Coding Agent làm việc trên codebase TravelGO.

---

## 1. Core Engineering Rules (Nguyên Tắc Cốt Lõi)

### 1.1. Hiểu Trước Khi Code (Understand Before Coding)
- **Cấm viết code khi chưa hiểu bối cảnh**: Định vị chính xác vị trí của tính năng trong hệ thống (Frontend, Backend, Decision Engine, DTO, Config).
- **Nguyên tắc "Codebase First"**: Nếu một thông tin kỹ thuật (tên method, DTO fields, trọng số, endpoint) có thể tìm thấy trong codebase, Agent **phải tự đọc mã nguồn trước**, tuyệt đối không hỏi người dùng.
- **Zero Guessing**: Tuyệt đối không tự ý giả định các yêu cầu nghiệp vụ quan trọng hoặc các tham số toán học cốt lõi.

### 1.2. Tối Thiểu Hóa Thay Đổi (Minimal Viable Change)
- Chỉ sửa đúng các file và dòng code cần thiết để hoàn thành nhiệm vụ được giao (tối đa 5 file/task).
- Tuyệt đối không tự ý "tiện tay" refactor, format lại code, hoặc đổi tên biến ở các module ngoài phạm vi task.
- Bảo toàn comment, docstring và các quy ước code hiện hữu trong file được chỉnh sửa.

### 1.3. Ranh Giới Phê Duyệt (Human Gatekeeper Boundary)
- Agent không được tự ý thay đổi cấu trúc kiến trúc gốc hoặc tự ý sửa các quy định trong `AGENTS.md` và `.agent/rules.md`.
- Cấm tự ý cài đặt thêm infrastructure (cơ sở dữ liệu mới, message broker, cache layer) trừ khi có yêu cầu cụ thể từ Tech Lead.
- Mọi bài học kinh nghiệm mới (Lesson Candidate) phải qua đề xuất trong báo cáo bàn giao và chờ con người phê duyệt.

### 1.4. Chống Lạm Dụng Tool & Bypassing Gatekeeper (Anti-Tool Bypassing)
- Khi gặp yêu cầu xếp loại **🔴 LOW Confidence** (mơ hồ, ngắn < 10 từ cho tính năng lớn, chạm nợ kỹ thuật, đụng Vùng Đỏ):
  - ❌ **CẤM TUYỆT ĐỐI**: Gọi công cụ `ask_question` (modal popup làm ẩn nội dung phân tích).
  - ❌ **CẤM TUYỆT ĐỐI**: Tự ý chuyển sang Planning Mode hoặc tạo file `implementation_plan.md` trước khi người dùng xác nhận kịch bản.
  - ✅ **BẮT BUỘC**: Xuất bản báo cáo Markdown phân tích kiến trúc trực tiếp ra chat và dừng lượt (stop calling tools).

---

## 2. Five Immutable Architecture Laws (5 Luật Bất Biến)

### 🚨 Luật 1 — Tránh Bẫy Chatbot (Avoid the Chatbot Trap)
- Ứng dụng **tuyệt đối không phải là chatbot hỏi-đáp văn bản đơn thuần**.
- Trải nghiệm cốt lõi là **Interactive Dashboard**: Giao diện gồm thanh trượt (sliders), thẻ điểm số (score cards), biểu đồ đánh đổi đa mục tiêu Pareto (Recharts), biểu đồ phân bổ ngân sách và timeline lịch trình từng ngày.
- LLM chỉ đóng vai trò là tầng phụ trợ thuyết minh (Explanation Layer).

### 🎯 Luật 2 — Backend Single Source of Truth cho Decision Logic
- Toàn bộ logic tính toán điểm số (MCDA), lọc phương tiện tối ưu (Pareto), sắp xếp lịch trình (Greedy), và mô phỏng độ nhạy ngân sách (Sensitivity) phải nằm 100% tại Backend (`com.travelgo.decision`).
- Frontend chỉ đóng vai trò nhận DTO từ Backend và render giao diện. Tuyệt đối không tự ý tính toán lại business logic ở tầng UI.

### 🛡️ Luật 3 — Không Silent Fallback & Minh Bạch Dữ Liệu
- Khi tích hợp dịch vụ bên ngoài (như Open-Meteo Live API):
  - Nếu API lỗi hoặc timeout, bắt ngoại lệ và trả về dữ liệu fallback dự phòng.
  - Phải gắn cờ minh bạch `isFallback: true` trong DTO trả về.
  - Frontend bắt buộc hiển thị nhãn `[FALLBACK]` hoặc `[Dữ liệu ngoại tuyến]` cho người dùng.

### ⚙️ Luật 4 — Non-Blocking LLM Explainer
- Tầng sinh lời giải thích bằng ngôn ngữ tự nhiên (LLM Explainer) hoạt động độc lập và bất đối xứng.
- Lỗi kết nối hoặc cạn kiệt quota từ nhà cung cấp LLM không bao giờ được phép làm gián đoạn hay phá vỡ phản hồi của API tính toán cốt lõi.

### 🔒 Luật 5 — Human Gatekeeper & Phân Quyền Nghiêm Ngặt
- Mọi thay đổi về cấu trúc hệ thống, thêm dependency, hoặc nới lỏng quy chuẩn kiểm thử đều bắt buộc phải có sự phê duyệt rõ ràng từ người dùng.

---

## 3. Coding Standards (Chuẩn Lập Trình)

### 3.1. Backend (Java 17/21, Spring Boot 3)
- **Kiến trúc phân lớp sạch (Clean Layering)**:
  - `controller/`: Chỉ nhận HTTP Request, validate dữ liệu (`@Valid`), và gọi Service. Không chứa business logic.
  - `service/`: Điều phối luồng nghiệp vụ, gọi Decision Engines, nạp dữ liệu, và tổng hợp DTO phản hồi.
  - `decision/`: Package chứa các thuật toán thuần túy (Pure Math/Algorithmic Engine). Không phụ thuộc vào Spring Web hay HTTP context. Phải viết được Unit Test độc lập.
  - `dto/`: Định nghĩa Request và Response có tính bao đóng, bảo vệ Domain Model nội bộ. Ưu tiên sử dụng Java Records cho DTO bất biến.
  - `external/`: Các client gọi API bên ngoài (Open-Meteo). Bắt buộc có cơ chế timeout, resilience, và fallback data rõ ràng.
- **Tránh Magic Numbers**: Mọi trọng số MCDA, ngưỡng lọc Pareto, hệ số nhân độ trượt giá phải được khai báo bằng các hằng số định danh (`public static final double DEFAULT_BUDGET_WEIGHT = 0.35;`).
- **Lombok**: Dùng `@Getter`, `@Setter`, `@Builder`, `@RequiredArgsConstructor`. Tránh lạm dụng `@Data` trên Entity có quan hệ phức tạp.
- **Xử lý Ngoại lệ**: Sử dụng `@RestControllerAdvice` để xử lý ngoại lệ toàn cục. Định dạng lỗi thống nhất: `{ timestamp, status, error, message, path }`.

### 3.2. Frontend (React 18, TypeScript, TailwindCSS)
- **Strict Typing**: Tuyệt đối không sử dụng kiểu `any`. Định nghĩa interface rõ ràng trong `src/types/`. Mọi trường nullable từ API phải được khai báo `field?: Type` hoặc `Type | null`.
- **Tập Trung Hóa API**: Không gọi `fetch()` hoặc `axios()` trực tiếp trong UI components. Mọi API call phải được định nghĩa trong `src/api/tripApi.ts` (LESSON-001).
- **Component Design**: Ưu tiên Functional Components với React Hooks. Tách bạch Smart/Container Component và Presentational Component. Sử dụng TailwindCSS responsive.

### 3.3. Đồng Bộ DTO (Backend ↔ Frontend Symmetry)
- Khi thêm, sửa hoặc xóa bất kỳ trường nào trong Request/Response DTO của Backend, Agent phải cập nhật ngay lập tức interface tương ứng ở Frontend trong cùng một task.
- Thống nhất định dạng casing: **camelCase** cho JSON payload (chuẩn Jackson ObjectMapper).
- Phía React luôn dùng default value an toàn cho các danh sách có thể null: `(items || []).map(...)` (LESSON-002).

---

## 4. Testing & Verification Rules (Quy Chuẩn Kiểm Thử)

### 4.1. Quy Định "No Test, No Merge"
- Các class toán học trong `com.travelgo.decision.*` (MCDA, Pareto, Greedy) bắt buộc phải có Unit Test độc lập bằng JUnit 5.
- Kiểm thử tính tất định: Với cùng một input cố định, kết quả score và rank phải chính xác tuyệt đối.
- Kiểm thử biên: Ngân sách tối thiểu (0 VNĐ, số âm), số ngày đi = 0, danh sách POI rỗng.
- Khi sửa bug: Bắt buộc viết test case tái hiện lỗi trước khi sửa mã nguồn.

### 4.2. Tính Bất Biến Của Kiểm Thử (Test Integrity)
- ❌ Cấm Agent sửa, xóa hoặc làm yếu các câu lệnh assertion trong `src/test/` để làm test pass giả tạo.
- ❌ Cấm bọc khối `catch (Exception e) {}` rỗng để giấu lỗi.
- ❌ Cấm hard-code kết quả chỉ để vượt qua một test case đơn lẻ.

### 4.3. Lệnh Kiểm Chứng Bắt Buộc Trước Bàn Giao
Trước khi xuất báo cáo hoặc tạo commit, Agent bắt buộc phải chạy và kiểm chứng:
- **Backend**: `./mvnw test` (hoặc `mvn test-compile`).
- **Frontend**: `npm run build` (hoặc `npx tsc --noEmit`).
- Không bao giờ tuyên bố hoàn thành nếu chưa có kết quả đầu ra thực tế (Observation) thành công từ các lệnh trên.

---

## 5. Git Safety & Version Control Rules (Quy Chuẩn An Toàn Git)

### 5.1. Khóa Cứng Nhánh Chính (Branch Protection Rule)
- ❌ **CẤM TUYỆT ĐỐI**: Commit hoặc Push trực tiếp vào nhánh `main` hoặc `develop`.
- Mọi phát triển phải diễn ra trên nhánh feature riêng biệt: `feat/<module>-<tên>` hoặc `fix/<module>-<tên>`.
- Quyền merge vào `main` thuộc về Human Tech Lead sau khi PR được tạo và CI kiểm định thành công.

### 5.2. Selective Staging (Stage Chọn Lọc Bắt Buộc)
- ❌ **CẤM TUYỆT ĐỐI**: `git add .`, `git add -A`, `git commit -a`.
- Agent bắt buộc chỉ stage đích danh các file nằm trong phạm vi task: `git add <file1> <file2>`.
- Kiểm tra `git diff --cached` để đảm bảo không lọt file `.env`, file cấu hình máy (`.vscode`, `.idea`), hoặc thư mục build (`target/`, `dist/`).

### 5.3. Quy Chuẩn Conventional Commits
- Commit message bắt buộc theo định dạng: `<type>(<scope>): <mô tả ngắn>`
- Các type hợp lệ: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`.
- Ví dụ: `feat(engine): add TOPSIS distance calculation matrix`

### 5.4. Cấm Các Thao Tác Phá Hủy (Destructive Operations)
- ❌ Cấm `git push --force`.
- ❌ Cấm `git reset --hard` trên các commit đã push.
- ❌ Cấm xóa nhánh từ xa (remote branch) nếu chưa có sự phê duyệt của Tech Lead.
