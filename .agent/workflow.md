# WORKFLOW — TRIPAI (TRAVELGO)

Quy trình vận hành tiêu chuẩn (SOP) cho **Autonomous AI Coding Pipeline (Level 2.8)**, tích hợp **Prompt Gatekeeper**, **Workflow Budget Guard**, **Bounded Retry**, **Git Automation**, và **Final Quality Gate**.

---

## 1. Sơ Đồ Quy Trình 3 Tầng (3-Layer Autonomous Workflow)

```
[USER PROMPT]
      │
      ▼
========================= LAYER 1: AI AGENT WORKFLOW =========================
[1. PROMPT GATEKEEPER] ───────── (Confidence == LOW) ──────────┐
      │                                                        ▼
(Confidence == HIGH hoặc MEDIUM đã giải tỏa)        [Tự inspect codebase]
      │                                                        │
      ▼                                                        ▼
[2. CODEBASE & ARCHITECTURE ANALYSIS]               [Xác định điểm mơ hồ]
  - Đối chiếu 5 Luật Bất Biến & Clean Layering                 │
  - Trích xuất DTO Delta (Contract First)                      ▼
      │                                             [Đưa ra 2-3 kịch bản]
      ▼                                                        │
[3. IMPLEMENTATION PLAN]                                       ▼
  - Minimal Atomic Scope (Tối đa 5 files)           [2-3 Ready-to-Use Prompts]
  - Acceptance Criteria rõ ràng                                │
  - Chạm Permission Boundary? -> Dừng xin phép                 ▼
      │                                             [Chờ User Xác Nhận]
      ▼                                                        │
[4. MINIMAL IMPLEMENTATION] ◄──────────────────────────────────┘
  - Sửa code tối thiểu, Zero Magic Numbers
  - Tuân thủ Workflow Budget Guard (Max 25 tool calls)
      │
      ▼
[5. LOCAL VERIFICATION & BOUNDED RETRY]
  - ./mvnw test (Backend) & npm run build (Frontend)
  - Nếu fail: RCA Loop (TỐI ĐA 3 VÒNG) -> Fix tận gốc
  - Nếu sau 3 vòng vẫn fail: Tự động Rollback & Dừng khẩn cấp
      │
      ▼
[6. FINAL QUALITY GATE]
  - Kiểm tra 6 chiều: Requirement, 5 Laws, Backend, Frontend, Git, Safety
      │
      ▼
========================= LAYER 2: GIT AUTOMATION ============================
[7. SAFE GIT EXECUTION]
  - Tạo feature branch: feat/<module>-<name> hoặc fix/<module>-<name>
  - Selective Staging: Chỉ git add các file trong task (CẤM git add .)
  - Conventional Commit: feat(scope): message
  - Pre-Push Gate: Branch != main, không có secret, không uncommitted files
  - Push feature branch lên GitHub remote
      │
      ▼
========================= LAYER 3: GITHUB AUTOMATION =========================
[8. PULL REQUEST & CI VERIFICATION]
  - Tự động tạo PR (gh pr create) điền sẵn Handover Report
  - GitHub Actions CI kích hoạt trên Runner sạch
  - Nếu CI fail: Agent đọc CI log -> Sửa trên branch -> Push lại
  - Nếu CI pass: Bàn giao PR xanh hoàn chỉnh cho Human Tech Lead
      │
      ▼
[9. HUMAN MERGE GATE]
  - Human Tech Lead review lần cuối trên GitHub và bấm Merge vào main!
```

---

## 2. Đặc Tả: Anti-Vague Prompt Gatekeeper

### 2.1. Thang Đo Requirement Confidence & Điều Kiện Phân Loại
- 🟢 **HIGH**: Phạm vi (scope) rõ ràng, hành vi (behavior) xác định, tiêu chí kiểm thử rõ $\rightarrow$ **Bỏ qua Gatekeeper**, tiến hành chu trình tự động.
- 🟡 **MEDIUM**: Mục tiêu rõ nhưng thiếu vài thông số kỹ thuật (tên biến, endpoint, DTO field) $\rightarrow$ **Áp dụng nguyên tắc "Codebase First"**: Tự đọc code để tìm lời giải, tuyệt đối không hỏi người dùng. Khi đã giải tỏa giả định $\rightarrow$ nâng lên **HIGH** và tiếp tục.
- 🔴 **LOW**: Kích hoạt khi rơi vào bất kỳ trường hợp nào sau đây:
  1. Yêu cầu mơ hồ, chung chung (*"làm mượt hơn"*, *"tối ưu thuật toán"*).
  2. Prompt ngắn gọn (< 10 từ) yêu cầu một tính năng lớn hoặc module mới (*"làm chức năng đăng nhập, đăng ký"*).
  3. Yêu cầu chạm vào nợ kỹ thuật đã chấp nhận trong `knowledge.md` (ví dụ `ISSUE-003: Chưa có Auth`).
  4. Yêu cầu chạm Permission Boundary (Vùng Đỏ: thêm dependency `pom.xml`, cài DB mới, sửa 5 Laws).
  5. Có từ 2 hướng rẽ nhánh kiến trúc lớn cần quyết định.
  $\rightarrow$ **KÍCH HOẠT PROMPT GATEKEEPER**: Dừng lại ngay lập tức, không code, không tạo plan.

### 2.2. Quy Tắc Bất Biến Khi Kích Hoạt Gatekeeper (Anti-Tool Bypassing Invariants)
1. ❌ **CẤM TUYỆT ĐỐI**: Không gọi công cụ `ask_question`. Việc hiển thị modal hỏi-đáp làm ẩn đi toàn bộ nội dung phân tích kiến trúc cần thiết cho người dùng.
2. ❌ **CẤM TUYỆT ĐỐI**: Không tạo file `implementation_plan.md` hay tự ý chuyển sang Planning Mode trước khi người dùng xác nhận kịch bản.
3. ❌ **CẤM TUYỆT ĐỐI**: Không thực hiện bất kỳ lệnh ghi/sửa code nào.
4. ✅ **BẮT BUỘC**: Chỉ sử dụng các read tools (`find_by_name`, `view_file`, `grep_search`) để thẩm định codebase.
5. ✅ **BẮT BUỘC**: Xuất trực tiếp báo cáo Markdown vào khung chat theo đúng mẫu chuẩn dưới đây và dừng lượt gọi công cụ (stop calling tools):

```markdown
### ⚠️ Anti-Vague Prompt Gatekeeper Triggered

#### 1. Hiện trạng Codebase liên quan
- Tôi đã kiểm tra mã nguồn tại: `[Đường dẫn file/component liên quan]`
- Hiện tại hệ thống đang xử lý: `[Mô tả ngắn hành vi hiện tại & đối chiếu 5 Laws / Nợ kỹ thuật]`

#### 2. Điểm còn thiếu / chưa rõ ràng
- Yêu cầu của bạn đang chưa xác định rõ: `[Mô tả cụ thể điểm mơ hồ, rủi ro Vùng Đỏ]`

#### 3. Các kịch bản khả thi (Possible Scenarios)
- **Kịch bản A**: `[Mô tả hướng A]` -> Ưu/Nhược điểm.
- **Kịch bản B**: `[Mô tả hướng B]` -> Ưu/Nhược điểm.

#### 4. Ready-to-Use Prompts (Chọn một prompt bên dưới để tiếp tục)
> **Prompt 1 (Kịch bản A)**: "[Nội dung prompt hoàn chỉnh]"
> **Prompt 2 (Kịch bản B)**: "[Nội dung prompt hoàn chỉnh]"
```

---

## 3. Workflow Budget Guard & Kiểm Soát Tài Nguyên

Vì nền tảng Antigravity **không expose thông tin quota (5-hour/weekly limit) cho Agent**, việc kiểm soát tài nguyên được thực thi cứng thông qua các giới hạn phần mềm:

### 3.1. Bảng Giới Hạn Cứng (Workflow Budget Guard)
| Chỉ Số Kiểm Soát | Ngưỡng Trần Tối Đa (Hard Limit) | Hành Động Khi Vượt Ngưỡng |
| :--- | :---: | :--- |
| **Max Planning Retries** | **2 lần** | Dừng lại, hỏi ý kiến Tech Lead. |
| **Max File Touches per Task** | **5 files** | Ngăn chặn refactor lan man, scope creep. |
| **Max Test-Fix Retries (RCA)** | **3 lần** | Ngắt mạch (Circuit Breaker), rollback code gốc. |
| **Max Tool Calls per Task** | **25 calls** | Chuyển sang trạng thái Graceful Stop. |
| **Max Command Timeout** | **60 giây** | Ngắt tiến trình bị treo (`manage_task kill`). |
| **Max Slice Window khi đọc file** | **150 dòng** | Cấm dump toàn bộ file để bảo vệ token context. |

### 3.2. Chính Sách Khi Chạm Ngưỡng (Quota Exhaustion & Resource Limit)
Khi nhận mã lỗi cạn kiệt tài nguyên (429 Rate Limit / Resource Exhausted) hoặc chạm trần Budget Guard:
1. **DỪNG NGAY LẬP TỨC**: Không cố gắng thử lại, không tìm kiếm API key khác trong môi trường.
2. **LƯU CHECKPOINT**: Ghi nhận tiến độ hiện tại theo định dạng mục 4.
3. **GRACEFUL STOP & BÁO CÁO**: Xuất báo cáo ngắn gọn việc đã xong, việc còn dở và **DỪNG LẠI CHỜ NGƯỜI DÙNG**.

---

## 4. Checkpoint & Explicit Resume (Cơ Chế Cứu Hộ & Tiếp Tục)

### 4.1. Định Dạng Checkpoint
Khi task bị gián đoạn, Agent lưu lại trạng thái theo mẫu:
```markdown
### ⏸️ TASK INTERRUPTED — CHECKPOINT RECORDED
- **Task**: [Tên nhiệm vụ ngắn gọn]
- **Reason**: [Nguyên nhân dừng: BUDGET_EXCEEDED / QUOTA_LIMIT / MANUAL_STOP]
- **Git Branch**: `feat/<module>-<tên>` (Working tree an toàn)

#### Đã Hoàn Thành:
- [x] Phân tích yêu cầu & DTO Delta
- [x] Sửa mã nguồn (`file1.java`, `file2.tsx`)

#### Chưa Hoàn Thành:
- [ ] Chạy `./mvnw test` và `npm run build`
- [ ] Commit và Push feature branch
- [ ] Mở Pull Request

#### Kế Hoạch Tiếp Tục (Next Actions):
1. Chạy lệnh kiểm thử để lấy Observation.
2. Nếu test pass -> Tiến hành stage và commit.
3. Push nhánh và mở PR.
```

### 4.2. Nguyên Tắc Explicit Resume
- **Tuyệt đối không tự động resume** khi mở phiên chat mới.
- Chỉ kích hoạt khi người dùng gõ: *"Tiếp tục task trước"*.
- Agent đọc Checkpoint $\rightarrow$ kiểm tra `git status` và `git diff` để xác nhận mã nguồn còn nguyên vẹn $\rightarrow$ thực hiện tiếp từ bước dở dang, **không chạy lại từ đầu**.

---

## 5. Bounded Retry & RCA Framework (Tự Sửa Lỗi Có Kiểm Soát)

Khi kiểm thử thất bại (`mvn test` hoặc `npm run build` ném lỗi):
1. **Thu thập Observation**: Trích xuất chính xác dòng lỗi, file và thông điệp ngoại lệ từ log.
2. **Root Cause Analysis (RCA bắt buộc)**:
   - Nguyên nhân kỹ thuật sâu xa là gì?
   - Có vi phạm 5 Luật Bất Biến hoặc lệch DTO không?
   - Kế hoạch sửa đổi tối thiểu (Minimal Fix) là gì?
3. **Sửa Tận Gốc**: Chỉ sửa đúng dòng code gây lỗi.
4. **Quy tắc chống gian lận kiểm thử (Anti-Cheating Invariants)**:
   - ❌ Cấm sửa, xóa hoặc nới lỏng assertions trong file test (`src/test/`).
   - ❌ Cấm bọc khối `catch (Exception e) {}` rỗng để giấu lỗi.
   - ❌ Cấm sửa code ngẫu nhiên kiểu "thử vận may".
5. **Cơ chế Circuit Breaker**:
   - Nếu sau 3 vòng lặp mà test vẫn fail $\rightarrow$ **Tự động chạy `git restore .` để hoàn nguyên mã nguồn**, dừng lại và báo cáo RCA cho Tech Lead.

---

## 6. Git Automation Protocol (Quy Chuẩn Tự Động Hóa Git An Toàn - Model B)

### 6.1. Quy Tắc Phân Nhánh
- **Tuyệt đối cấm commit hoặc push trực tiếp vào `main` hoặc `develop`**.
- Mọi thay đổi phải nằm trên nhánh feature riêng biệt:
  - Tính năng mới: `git checkout -b feat/<module>-<tên-ngắn>`
  - Sửa lỗi: `git checkout -b fix/<module>-<tên-ngắn>`

### 6.2. Selective Staging (Stage Chọn Lọc)
- Trước khi commit, Agent chạy `git status --porcelain` đối chiếu danh sách file.
- Chỉ stage đích danh: `git add <file1> <file2>`.
- **CẤM TUYỆT ĐỐI**: `git add .`, `git add -A`, `git commit -a`.

### 6.3. Chuẩn Conventional Commits
- Cấu trúc: `<type>(<scope>): <mô tả ngắn bằng tiếng Anh/Việt>`
  - `feat(engine): add TOPSIS ideal solution calculation`
  - `fix(weather): handle open-meteo connection timeout with fallback flag`
  - `docs(agent): update workflow budget guard specification`

### 6.4. Pre-Push Hard Gate
Trước khi gọi `git push`, Agent bắt buộc kiểm tra:
1. Nhánh hiện tại KHÔNG PHẢI là `main` hoặc `develop`.
2. Lệnh `./mvnw test` và `npm run build` đã trả về exit code 0.
3. Không có file `.env`, API key, credentials, hoặc generated binaries trong diff.
4. Lệnh push hợp lệ: `git push -u origin feat/<tên-nhánh>`.

---

## 7. Final Quality Gate (Ma Trận Kiểm Định 6 Chiều Trước Commit/Push)

| Chiều Đánh Giá | Tiêu Chuẩn Bắt Buộc (Must Pass) |
| :--- | :--- |
| **1. Requirement** | Khớp 100% yêu cầu prompt gốc; đủ acceptance criteria; không tự ý bỏ sót. |
| **2. Architecture** | Bảo toàn 5 Luật Bất Biến: 100% toán học ở Backend, UI là Interactive Dashboard, không silent fallback, non-blocking LLM, không tự ý sửa luật. |
| **3. Backend Quality** | Clean Layering; Java 17 records; Zero Magic Numbers (`public static final`); Unit test JUnit 5 pass 100%. |
| **4. Frontend Quality** | React 18 strict typing; CẤM KIỂU `any`; API gọi tập trung qua `src/api/tripApi.ts`; `npm run build` pass không warning. |
| **5. Git Hygiene** | Selective staging sạch sẽ; không commit file `.env`, logs, `target/`, `dist/`; commit message đúng chuẩn. |
| **6. Safety & Auth** | Không force push; không thao tác trên nhánh `main`; chỉ mở PR chờ Human duyệt. |

---

## 8. Permission Boundary (Ranh Giới Phân Quyền Bất Biến)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  VÙNG XANH (AI ĐƯỢC TỰ ĐỘNG THỰC THI — NO PERMISSION NEEDED)               │
│  ✓ Đọc mã nguồn, cấu hình, Git history và tài liệu                          │
│  ✓ Tự đánh giá confidence và tự inspect code giải tỏa giả định              │
│  ✓ Lập implementation plan cho task tính năng thông thường                  │
│  ✓ Chỉnh sửa mã nguồn trong phạm vi task (tối đa 5 file)                    │
│  ✓ Chạy unit test, compile check và build frontend                          │
│  ✓ Tự phân tích RCA và thử nghiệm vá lỗi (tối đa 3 vòng)                   │
│  ✓ Tạo feature branch mới (`feat/*`, `fix/*`) từ main                       │
│  ✓ Tạo Conventional Commit trên feature branch                              │
│  ✓ Push feature branch lên GitHub remote                                    │
│  ✓ Mở Pull Request ở trạng thái chờ review                                  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼ VƯỢT RANH GIỚI
┌─────────────────────────────────────────────────────────────────────────────┐
│  VÙNG ĐỎ (ĐIỂM DỪNG BẮT BUỘC — HUMAN APPROVAL REQUIRED)                     │
│  ⛔ Sửa đổi 5 Luật Bất Biến trong AGENTS.md                                │
│  ⛔ Thêm thư viện hoặc dependency mới vào pom.xml / package.json            │
│  ⛔ Thay đổi cấu trúc cơ sở dữ liệu hoặc nợ kỹ thuật trong known-issues.md │
│  ⛔ Thay đổi công thức toán học cốt lõi của Decision Engine                 │
│  ⛔ Commit hoặc Push trực tiếp vào nhánh `main` hoặc `develop`              │
│  ⛔ Thực hiện các lệnh Git phá hủy: force push, hard reset, xóa branch      │
│  ⛔ Merge Pull Request vào nhánh `main` (CHỈ CON NGƯỜI ĐƯỢC BẤM MERGE)      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Báo Cáo Bàn Giao Bắt Buộc (Mandatory Handover Protocol)

Mỗi khi hoàn thành nhiệm vụ, Agent bắt buộc phải xuất báo cáo theo đúng 5 mục:
1. **Changed**: Danh sách các file đã sửa hoặc tạo mới kèm vai trò kỹ thuật.
2. **Why**: Căn cứ kỹ thuật và lý do lựa chọn giải pháp này (liên hệ tới ADR nếu có).
3. **Testing**: Kết quả kiểm thử thực tế và lệnh đã chạy (`mvn test`, `npm run build`).
4. **Problems**: Khó khăn kỹ thuật, rủi ro tiềm ẩn hoặc nợ kỹ thuật phát sinh.
5. **Lesson Candidate**: Đề xuất bài học kinh nghiệm mới (nếu phát hiện cạm bẫy đặc thù) theo cấu trúc: *Problem $\rightarrow$ Root Cause $\rightarrow$ Actionable Rule*.
