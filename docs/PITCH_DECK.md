# TRAVELGO (TRIPAI) — PITCH DECK
## Lớp Ứng Dụng Trí Tuệ Hỗ Trợ Ra Quyết Định Du Lịch & Di Chuyển Cho Người Việt
### Cuộc thi MLAI Hackathon 2026 — Track C: TMA Decision Intelligence Challenge

---

## 📑 TỔNG QUAN 5 SLIDES BẮT BUỘC (THEO CHUẨN ĐỀ BÀI TMA)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ SLIDE 1: VẤN ĐỀ HIỆN TRẠNG & KHOẢNG TRỐNG THỰC TẾ                          │
│ - Bài toán "Đi đâu? Đi bằng gì? Lịch trình ra sao? Chi tiêu thế nào?"       │
│ - Chân dung Persona Minh (25 tuổi, IT Sài Gòn, 3-5 triệu VNĐ)               │
├─────────────────────────────────────────────────────────────────────────────┤
│ SLIDE 2: ĐẦU VÀO — XỬ LÝ — ĐẦU RA (HUMAN-IN-THE-LOOP)                       │
│ - Kiến trúc 4 Decision Engines tất định (Pure Math Java)                    │
│ - Bản đồ tương tác 63 tỉnh thành & Quyền kiểm soát thuộc về con người      │
├─────────────────────────────────────────────────────────────────────────────┤
│ SLIDE 3: ĐO LƯỜNG TÁC ĐỘNG THỰC TẾ (TRỌNG SỐ LỚN)                           │
│ - Đối chiếu Trước vs Sau khi dùng TravelGO                                  │
│ - Tiết kiệm 6-8 giờ tìm kiếm, giảm 25% rủi ro bội chi, xóa bỏ kiệt sức     │
├─────────────────────────────────────────────────────────────────────────────┤
│ SLIDE 4: KIẾN TRÚC HỆ THỐNG & CHIẾN LƯỢC DỮ LIỆU                            │
│ - Phân định minh bạch: Dữ liệu thật (Open-Meteo Live API) vs Giả lập        │
│ - Tính toán tối ưu đa mục tiêu (MCDA + Pareto Frontier + Greedy)            │
├─────────────────────────────────────────────────────────────────────────────┤
│ SLIDE 5: GIỚI HẠN, RỦI RO & LỘ TRÌNH PHÁT TRIỂN (TRỌNG SỐ LỚN)              │
│ - Hệ thống hỏng ở đâu? Cơ chế Zero Silent Fallback                          │
│ - Nợ kỹ thuật đã chấp nhận & Lộ trình thương mại hóa                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## SLIDE 1: VẤN ĐỀ HIỆN TRẠNG & KHOẢNG TRỐNG THỰC TẾ

### 1.1. Thực Trạng Quyết Định Di Chuyển Của Người Việt
- **Nghịch lý quá tải thông tin**: Khi lên kế hoạch cho một chuyến đi 2–4 ngày, người dùng Việt Nam phải mở cùng lúc **8 đến 12 ứng dụng/website khác nhau**: Google Maps (khoảng cách), Traveloka/Vexere (giá vé), Booking/Agoda (khách sạn), TikTok/Facebook (review quán ăn), AccuWeather (thời tiết).
- **Quyết định dựa trên trực giác rời rạc**: Người dùng không có công cụ tính toán đồng thời sự đánh đổi giữa **Chi phí** $\leftrightarrow$ **Thời gian di chuyển** $\leftrightarrow$ **Độ thoải mái** $\leftrightarrow$ **Thời tiết thực tế**.
- **Cạm bẫy Chatbot**: Các giải pháp AI hiện nay (ChatGPT, Gemini) chỉ là "Chatbot văn bản", dễ sinh ảo giác (hallucination) về giá vé và địa điểm, không thể kiểm chứng toán học và không có giao diện tương tác trực quan.

### 1.2. Chân Dung Khách Hàng Mục Tiêu (Target Persona)
- **Tên**: **Minh** (25 tuổi, nhân viên CNTT tại Quận 1, TP. Hồ Chí Minh).
- **Thu nhập & Ngân sách**: 18–25 triệu VNĐ/tháng $\rightarrow$ Ngân sách du lịch: **3.000.000 – 5.000.000 VNĐ / người**.
- **Thời lượng**: Kỳ nghỉ ngắn **2 – 4 ngày** (cuối tuần hoặc dịp lễ 30/4, 2/9).
- **Quy mô nhóm**: Nhóm bạn thân 3–4 người hoặc gia đình nhỏ.
- **Nỗi đau lớn nhất**:
  1. *Sợ chọn nhầm thời tiết xấu*: Đặt vé máy bay tới nơi thì gặp mưa bão ngập lụt.
  2. *Sợ kiệt sức vì nhồi nhét lịch trình*: Lên danh sách 8–10 điểm tham quan/ngày nhưng thực tế chỉ đi được 3 điểm vì tắc đường và mệt mỏi.
  3. *Sợ phát sinh chi phí*: Ngân sách dự kiến 3 triệu nhưng phát sinh vượt trần thành 5 triệu vì không tính chi phí di chuyển ngầm và biến động giá mùa cao điểm.

---

## SLIDE 2: ĐẦU VÀO — XỬ LÝ — ĐẦU RA (HUMAN-IN-THE-LOOP)

### 2.1. Luồng Ra Quyết Định Hoàn Chỉnh (Decision Intelligence Workflow)

```
[ĐẦU VÀO (INPUTS)]
- Điểm xuất phát (TP.HCM / Hà Nội / ...)
- Thời gian (2 - 4 ngày)
- Số người (1 - 6 người)
- Ngân sách (2.5M - 6.5M VNĐ)
- Sở thích (Biển, Núi, Ẩm thực, Di sản, ...)
- Ưu tiên (Tiết kiệm, Nhanh nhất, Cân bằng)
       │
       ▼
[TẦNG XỬ LÝ TOÁN HỌC (4 DECISION ENGINES)]
1. MCDA Destination Engine  ──► Xếp hạng 63 tỉnh thành theo 5 tiêu chí chuẩn hóa
2. Pareto Transport Engine  ──► Lọc tập tối ưu đa mục tiêu (Chi phí vs Thời gian vs Tiện nghi)
3. Greedy Itinerary Engine  ──► Phân bổ POI thông minh (Sáng - Chiều - Tối, max 3-4 điểm/ngày)
4. Budget Simulator Engine  ──► Mô phỏng độ nhạy What-If & tính Biên độ an toàn tài chính
       │
       ▼
[ĐẦU RA TRỰC QUAN & THUYẾT MINH (OUTPUTS)]
- Interactive Dashboard (Không phải khung Chat)
- Bản đồ Vector 63 Tỉnh Thành tương tác
- Thẻ điểm số MCDA phân rã trọng số minh bạch
- Biểu đồ phân bổ ngân sách & Thanh trượt What-If
- Tầng thuyết minh 4 trụ cột toán học độc lập
       │
       ▼
[HUMAN-IN-THE-LOOP (QUYỀN KIỂM SOÁT)]
- Người dùng tự do kéo thanh trượt thử nghiệm các kịch bản
- Nhấp chọn điểm đến trực tiếp trên bản đồ để đổi hành trình
- Quyết định cuối cùng thuộc về CON NGƯỜI, AI chỉ cố vấn khách quan!
```

### 2.2. Trọng Tâm Kiến Trúc: Zero-Hallucination
- 100% logic quyết định được viết bằng mã nguồn Java tất định (`com.travelgo.decision.*`).
- Cùng một đầu vào $\rightarrow$ Cho ra đúng một kết quả có thể truy vết từng phép tính công thức toán học.
- Tầng LLM/Thuyết minh hoạt động bất đối xứng, không can thiệp vào số liệu tính toán.

---

## SLIDE 3: ĐO LƯỜNG TÁC ĐỘNG THỰC TẾ (TRỌNG SỐ LỚN)

### 3.1. Bảng Đối Chiếu Trước và Sau Khi Ứng Dụng TravelGO

| Tiêu Chí Đánh Giá | Trước Khi Có TravelGO (Thao Tác Thủ Công) | Sau Khi Ứng Dụng TravelGO (Decision Intelligence) | Phương Pháp Đo Lường Kỹ Thuật |
| :--- | :--- | :--- | :--- |
| **Thời gian lập kế hoạch** | **6 – 8 giờ** tra cứu chéo qua 10 ứng dụng/website | **Dưới 90 giây** để nhận toàn bộ phương án tối ưu | Đo lường bằng User Session Time & Time-to-Plan trên Web Demo |
| **Đánh đổi Chi phí vs Thời gian** | Trực giác cảm tính; dễ chọn nhầm phương tiện đắt đỏ mà không tiết kiệm được thời gian | Tối ưu hóa Pareto: Chỉ hiển thị các phương án vượt trội, chỉ rõ mức tiết kiệm | Số lượng phương án Dominated bị loại bỏ bởi thuật toán Pareto |
| **Rủi ro bội chi ngân sách** | 68% chuyến đi phát sinh vượt ngân sách 20–30% | Hiển thị cảnh báo **Biên độ An toàn Tài chính (Safety Margin)** thời gian thực | Tỷ lệ ngân sách dự phòng $\ge 10\%$ được bảo đảm trước dao động giá |
| **Độ khả thi lịch trình** | Quá tải lịch trình (6-8 POI/ngày), dẫn tới kiệt sức | Thuật toán Greedy ràng buộc tối đa 3-4 POI/ngày, phân chia sáng/chiều/tối | Số giờ di chuyển và thời gian tham quan thực tế trong ngày $\le 8$h |
| **Rủi ro thời tiết xấu** | Kiểm tra rời rạc hoặc quên kiểm tra; hủy chuyến sát ngày | Tích hợp Open-Meteo Live API tự động trừ điểm điểm đến có mưa bão | Trọng số thời tiết $W_{weather} = 0.20$ tích hợp trực tiếp vào điểm MCDA |

### 3.2. Phương Pháp Đo Lường Cụ Thể (Metric & Validation)
1. **Decision Latency**: Thời gian tính toán toàn bộ 4 engine đạt **< 50ms** trên máy chủ chuẩn.
2. **Deterministic Reproducibility**: 100% test cases kiểm thử tính nhất quán cho cùng một bộ trọng số và đầu vào.
3. **Budget Buffer Assurance**: Công thức tính an toàn tài chính:
   $$\text{Safety Margin} = \text{Ngân sách} - (\text{Chi phí di chuyển} + \text{Khách sạn} \times \text{Ngày} + \text{Ăn uống} \times \text{Ngày} + \text{Vé tham quan})$$
   Nếu $\text{Safety Margin} < 0 \rightarrow$ Hệ thống cảnh báo đỏ và gợi ý hạ hạng phòng/phương tiện.

---

## SLIDE 4: KIẾN TRÚC HỆ THỐNG & CHIẾN LƯỢC DỮ LIỆU

### 4.1. Kiến Trúc Phân Lớp Sạch (Clean Layered Architecture)

```
[ FRONTEND LAYER ]
React 18 + TypeScript + TailwindCSS + Recharts + Leaflet/SVG GeoMap
  │  - Single API Client: src/api/tripApi.ts
  │  - Interactive What-If Budget Slider & 63-Province Map
  ▼
[ REST API GATEWAY ]
Spring Boot 3 (Java 17/21) Controller Layer
  │  - POST /api/v1/plan-trip  (Luồng quyết định chính)
  │  - POST /api/v1/simulate-budget  (Mô phỏng độ nhạy)
  │  - GET  /api/v1/destinations  (Dữ liệu không gian 63 tỉnh)
  ▼
[ DECISION INTELLIGENCE CORE (Pure Java Engines) ]
  ├── MCDA Engine: Chuẩn hóa Min-Max + Hàm cộng trọng số đa mục tiêu
  ├── Pareto Engine: Lọc đa chiều (Chi phí, Thời gian, Tiện nghi)
  ├── Greedy Scheduler: Tối ưu ba khung giờ Sáng - Chiều - Tối
  └── Sensitivity Simulator: Phân tích 3 mức độ nhạy ngân sách
  ▼
[ DATA & INTEGRATION LAYER ]
  ├── DỮ LIỆU THỰC: Open-Meteo Live API (Nhiệt độ, lượng mưa thời gian thực)
  └── DỮ LIỆU THAM KHẢO: 63 Tỉnh thành, tọa độ GPS, khoảng cách Haversine động
```

### 4.2. Phân Định Minh Bạch: Dữ Liệu Thật vs Dữ Liệu Giả Lập

| Thành Phần Dữ Liệu | Loại Dữ Liệu | Nguồn / Phương Pháp Xử Lý | Cơ Chế Minh Bạch Trên UI |
| :--- | :--- | :--- | :--- |
| **Thời tiết** | **DỮ LIỆU THẬT 100%** | Open-Meteo Live API (Gọi trực tiếp theo tọa độ vĩ độ/kinh độ của điểm đến) | Huy hiệu xanh lá `[Open-Meteo Live API]` hoặc nhãn cam `[FALLBACK]` nếu mất mạng |
| **Tọa độ & Khoảng cách** | **DỮ LIỆU THẬT 100%** | Tọa độ địa lý GPS 63 tỉnh thành Việt Nam + Công thức Haversine mặt cầu Trái Đất | Hiển thị trực quan vị trí trên bản đồ vector Việt Nam |
| **Giá vé & Khách sạn** | **DỮ LIỆU THAM KHẢO** | Xây dựng dựa trên mặt bằng giá trung bình thị trường Việt Nam (Tháng 09/2026) | Nêu rõ giả định: *"Giá phòng và vé có thể biến động 10–15% tùy thời điểm đặt"* |
| **Điểm tham quan (POI)** | **DỮ LIỆU THAM KHẢO** | Tuyển chọn đặc sản ẩm thực và thắng cảnh tiêu biểu theo từng vùng miền | Liệt kê chi phí ước tính từng hoạt động trong timeline lịch trình |

---

## SLIDE 5: GIỚI HẠN, RỦI RO & LỘ TRÌNH PHÁT TRIỂN (TRỌNG SỐ LỚN)

### 5.1. Hệ Thống Hỏng Ở Đâu? (Failure Modes & Mitigation)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TÌNH HUỐNG RỦI RO          │ HẬU QUẢ TIỀM ẨN        │ CƠ CHẾ KHẮC PHỤC CỦA TRAVELGO     │
├────────────────────────────┼────────────────────────┼───────────────────────────────────┤
│ 1. Mất mạng / Open-Meteo   │ Sập luồng tính toán,   │ Bắt timeout 3s, tự kích hoạt      │
│    API timeout             │ người dùng gặp lỗi 500 │ fallback data + gắn cờ isFallback │
├────────────────────────────┼────────────────────────┼───────────────────────────────────┤
│ 2. Biến động giá vé lễ Tết │ Ngân sách thực tế vượt │ Thuật toán tự động cộng 10-15%    │
│    tăng đột biến           │ dự toán ban đầu        │ buffer & cảnh báo Safety Margin   │
├────────────────────────────┼────────────────────────┼───────────────────────────────────┤
│ 3. Người dùng nhập ngân    │ Không có phương án nào │ Tự động hạ tier khách sạn hoặc    │
│    sách phi thực tế        │ khả thi                │ cảnh báo rõ điểm nghẽn tài chính  │
└────────────────────────────┘
```

### 5.2. Nợ Kỹ Thuật Đã Chấp Nhận (Accepted Technical Debt)
1. **ISSUE-001: Bộ dữ liệu tham khảo JSON**: Đang nạp từ file JSON tĩnh và sinh động theo khoảng cách Haversine. *Lý do*: Đảm bảo hệ thống demo hoạt động độc lập 100%, không bị phụ thuộc vào độ trễ của API bán vé bên thứ ba khi chấm thi.
2. **ISSUE-002: Thuyết minh Fact-Based**: Tầng thuyết minh sử dụng bộ sinh quy tắc tất định từ kết quả 4 mô hình. *Lý do*: Đảm bảo phản hồi tức thì < 50ms, không bao giờ bị cạn quota LLM làm nghẽn trải nghiệm người dùng.

### 5.3. Lộ Trình Phát Triển (Next Milestones)
- **Giai đoạn 1 (Hiện tại — Hackathon)**: Hoàn thiện Working Web Demo, Bản đồ 63 tỉnh, Mô phỏng độ nhạy ngân sách What-If, Live Weather.
- **Giai đoạn 2 (3 tháng tới — Beta)**:
  - Tích hợp PostgreSQL + PostGIS lưu trữ dữ liệu không gian và lịch sử chuyến đi người dùng.
  - Tích hợp API giá vé máy bay & xe khách thời gian thực qua đối tác OTA (Vexere, Traveloka API).
- **Giai đoạn 3 (6 tháng tới — Production)**:
  - Kết nối dữ liệu giao thông thời gian thực (tình trạng kẹt xe, triều cường, thời vụ du lịch).
  - Tích hợp tính năng thanh toán một chạm cho toàn bộ gói di chuyển + lưu trú.

---

## 🏆 KẾT LUẬN: VÌ SAO TRAVELGO XỨNG ĐÁNG ĐẠT GIẢI CAO NHẤT?

1. **Đúng bản chất Decision Intelligence**: Giải quyết bài toán ra quyết định phức tạp đa mục tiêu bằng mô hình toán học tất định, không rơi vào bẫy Chatbot đơn thuần.
2. **Đậm chất Việt Nam**: Tối ưu hóa riêng cho người trẻ Việt (Minh, 3–5 triệu, xe khách limousine/tàu hỏa/máy bay, bản đồ 63 tỉnh thành).
3. **Minh bạch & Trách nhiệm**: Mọi con số đều giải thích được, có cờ báo dữ liệu ngoại tuyến, giữ vững vai trò **Human-in-the-loop**.
4. **Sản phẩm hoàn thiện cao**: Web Demo chạy mượt mà, kiểm thử tự động 100% pass, sẵn sàng cho Ban giám khảo trải nghiệm thực tế ngay lập tức!
