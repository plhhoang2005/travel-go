# AGENTS.md — TripAI (TravelGO) Autonomous Agent Constitution & Guidelines

## 1. Project Context & Vision
- **Project Name**: TripAI / TravelGO (Smart Travel & Mobility Decision Intelligence System)
- **Scope**: Long-Term Sustainable Production Software System (Hệ thống phần mềm bền vững dài hạn).
- **Core Value Proposition**: Giải quyết bài toán "Đi đâu? Đi bằng gì? Lịch trình thế nào? Phân bổ ngân sách ra sao?" thông qua các mô hình toán học tất định (Deterministic Decision Intelligence) kết hợp tầng trực quan hóa Dashboard tương tác cao và tầng thuyết minh AI minh bạch.
- **Target Persona**: Minh (25 tuổi, nhân viên CNTT tại TP.HCM, ngân sách 3-5 triệu VNĐ/người, chuyến đi 2-4 ngày với nhóm bạn/gia đình).

---

## 2. Five Immutable Architecture Laws (5 Luật Bất Biến)

### 🚨 Law 1 — Avoid the Chatbot Trap (Tránh Bẫy Chatbot)
- Ứng dụng **tuyệt đối không phải là chatbot hỏi-đáp văn bản đơn thuần**.
- Trải nghiệm cốt lõi là **Interactive Dashboard**: Giao diện gồm thanh trượt (sliders), thẻ điểm số (score cards), biểu đồ đánh đổi đa mục tiêu Pareto (Recharts), biểu đồ phân bổ ngân sách và timeline lịch trình từng ngày.
- LLM chỉ đóng vai trò là tầng phụ trợ thuyết minh (Explanation Layer).

### 🎯 Law 2 — Backend Single Source of Truth for Decision Logic
- Toàn bộ logic tính toán điểm số (MCDA), lọc phương tiện tối ưu (Pareto), sắp xếp lịch trình (Greedy), và mô phỏng độ nhạy ngân sách (Sensitivity) phải nằm 100% tại Backend (`com.travelgo.decision`).
- Frontend chỉ đóng vai trò nhận DTO từ Backend và render giao diện. Tuyệt đối không tự ý tính toán lại business logic ở tầng UI.

### 🛡️ Law 3 — Zero Silent Fallbacks & Data Transparency
- Khi tích hợp dịch vụ bên ngoài (như Open-Meteo Live API):
  - Nếu API lỗi hoặc timeout, bắt ngoại lệ và trả về dữ liệu fallback dự phòng.
  - Phải gắn cờ minh bạch `isFallback: true` trong DTO trả về.
  - Frontend bắt buộc hiển thị nhãn `[FALLBACK]` hoặc `[Dữ liệu ngoại tuyến]` cho người dùng.

### ⚙️ Law 4 — Non-Blocking & Independent LLM Explainer
- Tầng sinh lời giải thích bằng ngôn ngữ tự nhiên (LLM Explainer) hoạt động độc lập và bất đối xứng.
- Lỗi kết nối hoặc cạn kiệt quota từ nhà cung cấp LLM không bao giờ được phép làm gián đoạn hay phá vỡ phản hồi của API tính toán cốt lõi.

### 🔒 Law 5 — Strict Permission & Human-in-the-Loop Gatekeeper
- Agent không được phép tự ý thay đổi cấu trúc kiến trúc gốc, sửa các permanent rules, hoặc tự ý biến các bài học mới thành luật vĩnh viễn nếu chưa có sự phê duyệt rõ ràng từ người dùng / Tech Lead.

---

## 3. Context Router (Bản Đồ Điều Hướng Ngữ Cảnh Nhanh)

Hệ thống tài liệu dự án được tổ chức tinh gọn thành 3 tệp tri thức trung tâm trong [.agent/](file:///.agent/):

| Lĩnh vực | Tài liệu bắt buộc phải đọc | Nội dung chính |
| :--- | :--- | :--- |
| **Quy chuẩn kỹ thuật & Luật** | [.agent/rules.md](file:///.agent/rules.md) | Core Rules, 5 Luật Bất Biến, Clean Layering, Java/TS standards, Git Safety, Testing SOP |
| **Tri thức dự án & Bộ nhớ** | [.agent/knowledge.md](file:///.agent/knowledge.md) | Chân dung Persona Minh, 4 ADRs, Nợ kỹ thuật đã chấp nhận, Lessons Learned |
| **Quy trình & Autonomous Pipeline** | [.agent/workflow.md](file:///.agent/workflow.md) | Level 2.8 SOP, Anti-Vague Gatekeeper, Budget Guard, RCA Loop, Git Protocol, PR Gate |

---

## 4. Anti-Vague Prompt Gatekeeper (Quy Tắc Chống Yêu Cầu Mơ Hồ)

Trước khi lập kế hoạch hoặc viết code, Agent bắt buộc phải đánh giá **Requirement Confidence**:
1. 🟢 **HIGH**: Yêu cầu rõ ràng, scope rõ $\rightarrow$ Tiến hành chu trình tự động hóa (Autonomous Execution).
2. 🟡 **MEDIUM**: Thiếu chi tiết kỹ thuật nhỏ $\rightarrow$ **Áp dụng nguyên tắc "Codebase First"**: Tự đọc code để tìm lời giải, không hỏi người dùng.
3. 🔴 **LOW**: Yêu cầu mơ hồ, scope mông lung, có từ 2 hướng rẽ nhánh $\rightarrow$ **DỪNG LẠI, KÍCH HOẠT PROMPT GATEKEEPER**:
   - Inspect nhanh codebase liên quan.
   - Chỉ rõ điểm mơ hồ.
   - Đưa ra 2–3 kịch bản kèm ưu/nhược điểm.
   - Cung cấp 2–3 Ready-to-Use Prompts để người dùng chọn copy-paste.

---

## 5. Workflow Budget Guard & Git Safety

- **Budget Guard**: Tối đa 25 tool calls/task, tối đa 3 vòng thử sửa lỗi (RCA loop), tối đa 5 file/task. Nếu chạm ngưỡng $\rightarrow$ Graceful Stop, lưu Checkpoint và chờ người dùng.
- **Git Safety (Model B)**: Tự động tạo feature branch (`feat/*`, `fix/*`), selective staging (chỉ add file task), conventional commits. **CẤM TUYỆT ĐỐI PUSH TRỰC TIẾP VÀO MAIN**.
- **Human Merge Gate**: Mọi thay đổi đưa vào `main` phải thông qua Pull Request do Human Tech Lead review và bấm Merge.

---

## 6. Mandatory Handover Report Format (Hợp Đồng Bàn Giao Cuối Task)

Mỗi khi hoàn thành một nhiệm vụ, Agent bắt buộc phải xuất báo cáo theo đúng 5 mục:
1. **Changed**: Danh sách file đã sửa / tạo mới kèm vai trò.
2. **Why**: Căn cứ kỹ thuật và lý do chọn giải pháp này.
3. **Testing**: Kết quả kiểm thử tự động hoặc lệnh đã chạy để kiểm chứng (`mvn test`, `npm run build`).
4. **Problems**: Khó khăn kỹ thuật, rủi ro tiềm ẩn hoặc nợ kỹ thuật phát sinh.
5. **Lesson Candidate**: Đề xuất bài học kinh nghiệm mới theo cấu trúc: *Problem $\rightarrow$ Root Cause $\rightarrow$ Actionable Rule*.
