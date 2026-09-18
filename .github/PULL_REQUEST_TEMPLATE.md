## 📌 PR Summary & Handover Report

> Mọi Pull Request (bao gồm code do Human hoặc AI Agent tạo) đều phải tuân thủ chuẩn bàn giao quy định tại `AGENTS.md` và `.agent/workflow.md`.

### 1. 📝 Changed (Danh Sách Thay Đổi)
- [Liệt kê các file đã tạo mới / chỉnh sửa kèm vai trò]

### 2. 💡 Why (Lý Do & Căn Cứ Kỹ Thuật)
- [Giải thích lý do lựa chọn giải pháp này, liên hệ tới ADR nếu có trong .agent/knowledge.md]

### 3. 🧪 Testing (Bằng Chứng Kiểm Thử)
- [ ] Backend tests passing (`mvn test`)
- [ ] Frontend build passing (`npm run build`)
- [Ghi chú lệnh đã chạy hoặc dán log kết quả kiểm thử]

### 4. ⚠️ Problems (Khó Khăn & Nợ Kỹ Thuật Phát Sinh)
- [Ghi rõ rủi ro tiềm ẩn hoặc technical debt cần theo dõi]

### 5. 🎓 Lesson Candidate (Đề Xuất Bài Học Mới — Nếu có)
- **Problem**: 
- **Root Cause**: 
- **Solution / Actionable Rule**: 

---

## 🛡️ 5 Immutable Architecture Laws Checklist
- [ ] **Law 1**: Tránh bẫy Chatbot — Giao diện duy trì Interactive Dashboard trực quan.
- [ ] **Law 2**: Backend là Single Source of Truth cho toàn bộ Decision Logic (MCDA, Pareto, Greedy).
- [ ] **Law 3**: Không Silent Fallback — Dữ liệu thời tiết lỗi có cờ `isFallback: true` và badge cảnh báo.
- [ ] **Law 4**: Non-Blocking LLM Explainer — Sự cố tầng AI không làm gián đoạn API tính toán toán học.
- [ ] **Law 5**: Human Gatekeeper — Không tự ý phá vỡ cấu trúc kiến trúc cốt lõi.

---

## 🔍 Code Quality Checklist
- [ ] Không có "Magic Numbers" — Mọi trọng số đã khai báo hằng số rõ ràng (`.agent/rules.md`).
- [ ] Không sử dụng kiểu `any` trong TypeScript.
- [ ] DTO phía Backend và Interface phía Frontend đồng bộ tuyệt đối (camelCase).
- [ ] Đã tra cứu `.agent/knowledge.md` trước khi code.
