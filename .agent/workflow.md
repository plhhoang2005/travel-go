# WORKFLOW — TRIPAI (TRAVELGO)

Quy trình vận hành tiêu chuẩn (SOP) tích hợp cơ chế **Anti-Vague Prompt Gatekeeper** và bảo chứng chất lượng mã nguồn từ đầu đến cuối cho AI Coding Agent.

---

## 1. Sơ Đồ Quy Trình Tổng Thể (End-to-End Workflow)

```
[USER REQUEST]
      │
      ▼
[1. PROMPT GATEKEEPER] ───────── (Confidence == LOW) ──────────┐
      │                                                        ▼
(Confidence == HIGH hoặc MEDIUM đã giải tỏa)        [Tự inspect codebase]
      │                                                        │
      ▼                                                        ▼
[2. CODEBASE & CONTRACT ANALYSIS]                   [Xác định điểm mơ hồ]
  - Xác định file & DTO ảnh hưởng                              │
  - Đối chiếu 5 Luật Bất Biến                                  ▼
      │                                             [Đưa ra 2-3 kịch bản]
      ▼                                                        │
[3. IMPLEMENTATION PLAN]                                       ▼
  - Danh sách file tối thiểu                        [2-3 Ready-to-Use Prompts]
  - Acceptance criteria                                        │
  - Chờ User duyệt (nếu task lớn)                              ▼
      │                                             [Chờ User Xác Nhận]
      ▼                                                        │
[4. MINIMAL IMPLEMENTATION] ◄──────────────────────────────────┘
  - Sửa code tối thiểu
  - Zero magic numbers
      │
      ▼
[5. VERIFICATION LOOP]
  - ./mvnw test (Backend)
  - npm run build (Frontend)
  - Nếu fail: Debug RCA -> Fix -> Re-verify
      │
      ▼
[6. SELF-REVIEW & HANDOVER]
  - Rà soát Checklist chất lượng
  - Xuất Báo cáo Bàn giao 5 mục bắt buộc
```

---

## 2. Đặc Tả Chi Tiết: Anti-Vague Prompt Gatekeeper

### 2.1. Thang Đo Requirement Confidence

| Mức Độ | Dấu Hiệu Nhận Biết | Hành Động Bắt Buộc Của Agent |
| :--- | :--- | :--- |
| 🟢 **HIGH** | - Phạm vi (scope) rõ ràng (file, class, API cụ thể).<br>- Hành vi mong đợi (expected behavior) xác định.<br>- Có tiêu chí kiểm thử rõ ràng. | **Bỏ qua Gatekeeper**. Tiến hành phân tích kỹ thuật và lập kế hoạch triển khai. |
| 🟡 **MEDIUM** | - Mục tiêu rõ nhưng thiếu vài thông số kỹ thuật nhỏ (ví dụ: tên biến, endpoint path, trọng số mặc định).<br>- Không ảnh hưởng đến kiến trúc tổng thể. | **Áp dụng nguyên tắc "Codebase First"**: Tự mở mã nguồn đọc để tìm lời giải. Tuyệt đối không hỏi người dùng. Khi đã giải tỏa giả định $\rightarrow$ Nâng lên **HIGH** và tiếp tục. |
| 🔴 **LOW** | - Yêu cầu mơ hồ, chung chung (ví dụ: *"tối ưu hệ thống"*, *"làm giao diện đẹp hơn"*).<br>- Có từ 2 hướng giải quyết khác biệt lớn về mặt kỹ thuật hoặc nghiệp vụ.<br>- Phạm vi quá rộng, dễ làm Agent suy diễn sai lệch. | **KÍCH HOẠT PROMPT GATEKEEPER**. Cấm lập plan, cấm sửa code. Thực hiện phản hồi theo mẫu chuẩn mục 2.3. |

### 2.2. Nguyên Tắc "Codebase First" vs "Hỏi Người Dùng"
- **Agent BẮT BUỘC TỰ ĐỌC CODE khi**: Thiếu thông tin về cấu trúc file, DTO fields, class name, logic hiện tại của thuật toán, hoặc cấu hình Spring/Vite.
- **Agent BẮT BUỘC HỎI NGƯỜI DÙNG khi**:
  1. Ý đồ nghiệp vụ hoặc hướng rẽ tính năng chưa được xác định.
  2. Có sự đánh đổi lớn (ví dụ: ưu tiên tốc độ tính toán vs độ chính xác thuật toán).
  3. Phạm vi thay đổi (scope boundary) mông lung.

### 2.3. Mẫu Phản Hồi Chuẩn Khi Kích Hoạt Gatekeeper (LOW Confidence)
Khi yêu cầu ở mức LOW, Agent bắt buộc trả lời theo đúng cấu trúc 4 phần sau:

```markdown
### ⚠️ Anti-Vague Prompt Gatekeeper Triggered

#### 1. Hiện trạng Codebase liên quan
- Tôi đã kiểm tra mã nguồn tại: `[Đường dẫn file/component liên quan]`
- Hiện tại hệ thống đang xử lý: `[Mô tả ngắn hành vi hiện tại]`

#### 2. Điểm còn thiếu / chưa rõ ràng
- Yêu cầu của bạn đang chưa xác định rõ: `[Mô tả cụ thể điểm mơ hồ]`

#### 3. Các kịch bản khả thi (Possible Scenarios)
- **Kịch bản A**: `[Mô tả hướng giải quyết A]` -> Ưu/Nhược điểm.
- **Kịch bản B**: `[Mô tả hướng giải quyết B]` -> Ưu/Nhược điểm.
- **Kịch bản C** (nếu có): `[Mô tả hướng giải quyết C]` -> Ưu/Nhược điểm.

#### 4. Ready-to-Use Prompts (Chọn một prompt bên dưới để tiếp tục)
Bạn có thể copy-paste trực tiếp một trong các prompt sau:
> **Prompt 1 (Kịch bản A)**: "[Nội dung prompt hoàn chỉnh]"
> **Prompt 2 (Kịch bản B)**: "[Nội dung prompt hoàn chỉnh]"
```

---

## 3. Quy Trình Kỹ Thuật Chi Tiết (Implementation & Debugging)

### 3.1. Phân Tích & Thiết Kế Hợp Đồng (Contract First)
1. Xác định thay đổi ở Request / Response DTO tại `backend/src/main/java/com/travelgo/dto/`.
2. Đồng bộ hóa ngay lập tức sang interface TypeScript tại `frontend/src/types/trip.ts`.
3. Kiểm tra tính tương thích camelCase và xử lý nullable fields.

### 3.2. Triển Khai Mã Nguồn Tối Thiểu (Minimal Implementation)
- Chỉ sửa các file thuộc phạm vi task đã xác định.
- Không magic numbers: Mọi trọng số toán học phải khai báo `public static final`.
- Bảo toàn Clean Layering: Toán học 100% ở Backend, Frontend chỉ nhận DTO và render.

### 3.3. Khung 4 Bước Cô Lập Lỗi (Debugging RCA Framework)
Khi gặp lỗi hoặc test fail:
1. **Reproduce**: Xác định payload và kịch bản kích hoạt lỗi.
2. **Locate**: Xác định lỗi thuộc tầng nào (Network/CORS, DTO Casing, Logic Engine, External Timeout).
3. **Fix Root Cause**: Sửa tận gốc nguyên nhân, không dùng try-catch rỗng để che giấu lỗi.
4. **Prevent Regression**: Chạy lại test đảm bảo pass và kiểm tra xem có đáng tạo `Lesson Candidate`.

---

## 4. Kiểm Thử & Tự Đánh Giá (Verification & Self-Review)

### 4.1. Lệnh Kiểm Thử Bắt Buộc
- Backend: Chạy `./mvnw test` hoặc `mvn test-compile`.
- Frontend: Chạy `npm run build` hoặc `npx tsc --noEmit`.

### 4.2. Bảng Kiểm Tra Tự Đánh Giá (Self-Review Checklist)
- [ ] Tuân thủ đầy đủ 5 Luật Bất Biến trong `AGENTS.md`.
- [ ] Không có "Magic Numbers" trong các class tính toán.
- [ ] Không sử dụng kiểu `any` trong TypeScript.
- [ ] API client được gọi tập trung qua `src/api/tripApi.ts`.
- [ ] Tích hợp API bên ngoài có fallback và cờ `isFallback: true`.
- [ ] Build Backend và Frontend đều thành công 100%.

---

## 5. Báo Cáo Bàn Giao Bắt Buộc (Mandatory Handover Protocol)

Mỗi khi hoàn thành nhiệm vụ, Agent bắt buộc phải xuất báo cáo theo đúng 5 mục:
1. **Changed**: Danh sách các file đã sửa hoặc tạo mới kèm vai trò kỹ thuật ngắn gọn.
2. **Why**: Căn cứ kỹ thuật và lý do lựa chọn giải pháp này (liên hệ tới ADR nếu có).
3. **Testing**: Kết quả kiểm thử thực tế và lệnh đã chạy (`mvn test`, `npm run build`).
4. **Problems**: Khó khăn kỹ thuật, rủi ro tiềm ẩn hoặc nợ kỹ thuật phát sinh.
5. **Lesson Candidate**: Đề xuất bài học kinh nghiệm mới (nếu phát hiện cạm bẫy đặc thù) theo cấu trúc: *Problem $\rightarrow$ Root Cause $\rightarrow$ Actionable Rule*.
