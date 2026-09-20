# TRAVELGO — KỊCH BẢN TRÌNH DIỄN DEMO 90 GIÂY (DEMO RUNBOOK)
## Hướng Dẫn Ban Giám Khảo & Đội Thi MLAI Hackathon 2026 (Track C: TMA)

Tài liệu này cung cấp kịch bản demo súc tích trong vòng **90 giây đến 3 phút**, giúp Ban giám khảo và người xem trải nghiệm trọn vẹn 1 luồng ra quyết định hoàn chỉnh mà không cần đăng ký tài khoản hay cài đặt phức tạp.

---

## ⏱️ KỊCH BẢN THAO TÁC 3 BƯỚC NHANH (90 GIÂY)

```
[00:00 - 00:30]                   [00:30 - 01:00]                   [01:00 - 01:30]
BƯỚC 1: KHỞI TẠO TIÊU CHÍ         BƯỚC 2: KHÁM PHÁ QUYẾT ĐỊNH       BƯỚC 3: MÔ PHỎNG WHAT-IF
Chọn Preset "Minh Tiết Kiệm"      Xem Thẻ Điểm MCDA & Pareto        Kéo thanh trượt Ngân sách
hoặc Nhấp Bản Đồ 63 Tỉnh          Xem Khuyến nghị Thời tiết Live    Xem Biên độ an toàn tài chính
```

---

### BƯỚC 1: KHỞI TẠO BÀI TOÁN RA QUYẾT ĐỊNH (00:00 – 00:30)

1. **Truy cập ứng dụng**:
   - Mở trình duyệt tại URL ứng dụng: `http://localhost:5173` (hoặc Live Demo URL).
   - Không yêu cầu đăng nhập, không cần cấp quyền vị trí.
2. **Chọn hồ sơ người dùng mẫu**:
   - Nhấp vào nút **"Lập kế hoạch"** trên thanh điều hướng.
   - Nhấp vào một trong 3 nút Preset nhanh:
     - 🎯 **Minh Tiết Kiệm**: 3.000.000đ, 3 ngày, ưu tiên chi phí thấp nhất.
     - 🚀 **Minh Khám Phá**: 4.000.000đ, 3 ngày, ưu tiên cân bằng trải nghiệm.
     - 🏖️ **Minh Nghỉ Dưỡng**: 5.000.000đ, 4 ngày, ưu tiên tiện nghi tối đa.
3. **Hoặc chọn trực tiếp trên Bản đồ Việt Nam**:
   - Chuyển sang chế độ **"🗺️ Chọn trực tiếp trên Bản đồ Việt Nam"**.
   - Nhấp vào một tỉnh thành bất kỳ (ví dụ: Đà Lạt, Nha Trang, Sa Pa, Phú Quốc) $\rightarrow$ Nhấp **"Lên kế hoạch ngay"**.

---

### BƯỚC 2: KHÁM PHÁ CÁC ĐÁNH ĐỔI ĐA MỤC TIÊU (00:30 – 01:00)

1. **Trang Điểm Đến & Xếp Hạng MCDA (`/destinations`)**:
   - Quan sát **Điểm đến Top 1** được chọn dựa trên 5 tiêu chí: *Phù hợp ngân sách, Thời tiết, Sở thích, Thời gian di chuyển, Độ độc đáo*.
   - Nhấp vào **"Xem bảng phân tích điểm số"** để thấy mức đóng góp của từng tiêu chí (minh bạch, không phải hộp đen).
   - Kiểm tra huy hiệu thời tiết: **`[Open-Meteo Live API]`** (xanh lá) hiển thị nhiệt độ thực và lượng mưa trực tiếp từ vệ tinh.
2. **Trang Tối Ưu Phương Tiện Pareto (`/transport`)**:
   - Xem biểu đồ so sánh đánh đổi đa mục tiêu giữa **Máy bay vs Tàu hỏa vs Xe khách**.
   - Thấy rõ điểm khác biệt:
     - Xe khách: Tiết kiệm chi phí nhất (khoảng 500.000đ) nhưng mất 7.5 giờ.
     - Tàu hỏa / Máy bay: Rút ngắn thời gian nhưng chi phí tăng thêm tương ứng.
     - Các phương án bị lấn át (Dominated options) đã bị loại bỏ tự động bởi thuật toán Pareto.
3. **Trang Lịch Trình Greedy (`/itinerary`)**:
   - Xem lịch trình từng ngày được sắp xếp hợp lý theo 3 khung giờ: Sáng – Chiều – Tối.
   - Không bị nhồi nhét: tối đa 3-4 điểm/ngày, tránh kiệt sức cho người đi.

---

### BƯỚC 3: MÔ PHỎNG WHAT-IF & BIÊN ĐỘ AN TOÀN TÀI CHÍNH (01:00 – 01:30)

1. **Trang Ngân Sách (`/budget`)**:
   - Quan sát biểu đồ tròn phân bổ ngân sách: Di chuyển, Lưu trú, Ăn uống, Vé tham quan, Dự phòng rủi ro.
2. **Tương tác với thanh trượt What-If**:
   - Kéo thanh trượt **"Kéo thử ngân sách"** từ 3.000.000đ lên 4.000.000đ và 5.000.000đ:
     - Ở mức **3.000.000đ**: Hệ thống tự động đề xuất **Xe khách** + **Homestay** (Dự phòng 350.000đ).
     - Ở mức **4.000.000đ**: Hệ thống tự động nâng lên **Tàu hỏa** + **Khách sạn 3 sao** (Dự phòng 600.000đ).
     - Ở mức **5.000.000đ**: Hệ thống tự động nâng lên **Máy bay khứ hồi** + **Resort 4 sao** (Dự phòng 550.000đ).
3. **Kiểm tra Thước Đo An Toàn (Safety Margin Gauge)**:
   - Thấy rõ hệ thống luôn bảo đảm khoản dự phòng 10–15% để bảo vệ người dùng trước rủi ro biến động giá mùa cao điểm.
4. **Đọc Hộp Thuyết Minh Quyết Định (Decision Explainer Box)**:
   - Đọc 4 thẻ thuyết minh rõ ràng tương ứng 4 trụ cột toán học: *Lựa chọn Tối ưu, Tối ưu Phương tiện, Khuyến nghị Thời tiết, Biên độ An toàn*.

---

## 🧪 3 KỊCH BẢN THỬ NGHIỆM CHUYÊN SÂU DÀNH CHO GIÁM KHẢO

### Kịch Bản A: Thử Thách Thời Tiết Xấu (Resilience & Fallback Test)
- **Hành động**: Thử ngắt kết nối mạng internet hoặc gọi API đến một vùng xa.
- **Quan sát**: Hệ thống không bao giờ bị crash hay trả về lỗi 500. Thay vào đó, hệ thống bắt ngoại lệ sau 3 giây, tự kích hoạt dữ liệu fallback và hiển thị nhãn cam minh bạch: `[Dữ liệu ngoại tuyến / FALLBACK]`.

### Kịch Bản B: Thử Thách Khoảng Cách Động 63 Tỉnh Thành
- **Hành động**: Chọn xuất phát từ **Hà Nội** đi **Phú Quốc** (đảo xa > 1.200km).
- **Quan sát**:
  - Thuật toán Haversine tự động tính khoảng cách > 1.200km.
  - Hệ thống tự động nhận diện đây là đảo (`isIsland = true`), đề xuất **Máy bay khứ hồi** hoặc **Tàu cao tốc/Phà biển**, loại bỏ tùy chọn tàu hỏa chạy thẳng.

### Kịch Bản C: Thử Thách Ngân Sách Hạn Hẹp
- **Hành động**: Kéo ngân sách xuống mức thấp nhất (2.500.000đ).
- **Quan sát**: Hệ thống hiển thị trạng thái `CẦN TỐI ƯU CHI PHÍ`, cảnh báo biên độ an toàn mỏng và gợi ý phương án tiết kiệm nhất để không bị bội chi.

---

## 📋 DANH MỤC KIỂM TRA ĐẦY ĐỦ (CHECKLIST BÀN GIAO)

- [x] Web Demo chạy không cần cài đặt hoặc đăng nhập.
- [x] Đầy đủ 1 luồng ra quyết định hoàn chỉnh (Input $\rightarrow$ MCDA $\rightarrow$ Pareto $\rightarrow$ Greedy $\rightarrow$ Output $\rightarrow$ What-If).
- [x] 100% logic quyết định nằm tại Backend (không gian lận ở UI).
- [x] Thời gian phản hồi tính toán < 50ms.
- [x] Minh bạch dữ liệu: cờ `isFallback`, cờ `Open-Meteo Live API`.
- [x] Kiểm thử tự động: 15/15 unit tests pass, TypeScript compile 0 lỗi.
