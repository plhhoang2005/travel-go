# HƯỚNG DẪN TRIỂN KHAI HỆ THỐNG TRAVELGO (DEPLOYMENT GUIDE)
## MLAI Hackathon 2026 — Track C: TMA Decision Intelligence

Tài liệu này hướng dẫn cách chạy hệ thống TravelGO bằng Docker Compose cục bộ chỉ với 1 câu lệnh và các bước triển khai trực tiếp lên đám mây (Live URL) phục vụ chấm thi.

---

## 1. KHỞI CHẠY NHANH CỤC BỘ BẰNG DOCKER COMPOSE (1-CLICK RUN)

### Yêu cầu tiên quyết:
- Máy đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/) (hỗ trợ Windows, macOS, Linux).

### Câu lệnh khởi chạy:
Từ thư mục gốc `travel-go/`, mở terminal và chạy:

```bash
docker compose up --build -d
```

### Kiểm tra trạng thái:
- **Frontend Dashboard**: Truy cập `http://localhost` (hoặc `http://localhost:3000`).
- **Backend API**: Truy cập `http://localhost:8080/api/v1/destinations` để kiểm tra danh sách 63 tỉnh thành.
- **Xem logs**: `docker compose logs -f`
- **Dừng hệ thống**: `docker compose down`

---

## 2. HƯỚNG DẪN TRIỂN KHAI ĐÁM MÂY (LIVE DEMO URL MIỄN PHÍ)

### Phương án A: Triển khai trên Render.com (Khuyến nghị)
1. **Backend**:
   - Tạo **Web Service** mới trên Render, liên kết với GitHub repository `plhhoang2005/travel-go`.
   - Root Directory: `backend`
   - Runtime: `Docker`
   - Port: `8080`
   - Render sẽ tự động build từ `backend/Dockerfile`.
2. **Frontend**:
   - Tạo **Static Site** mới trên Render.
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment Variable: `VITE_API_URL=https://<your-backend-service>.onrender.com/api/v1`

### Phương án B: Triển khai trên Vercel (Frontend) + Railway (Backend)
- **Frontend**: Kết nối repository với Vercel, chọn framework Vite, root `frontend`.
- **Backend**: Kết nối với Railway, Railway tự động nhận diện `backend/Dockerfile` và sinh Live URL có HTTPS.

---

## 3. CHECKLIST SẴN SÀNG CHẤM THI CHO BAN GIÁM KHẢO

| Hạng mục kiểm tra | Trạng thái | Ghi chú |
| :--- | :---: | :--- |
| Không cần tạo tài khoản | ✅ Đạt | Truy cập trực tiếp vào là sử dụng được ngay |
| Phản hồi nhanh < 50ms | ✅ Đạt | Thuật toán tối ưu hóa viết bằng pure Java |
| Khả năng chịu lỗi (Resilience) | ✅ Đạt | Có fallback data khi mất kết nối mạng Open-Meteo |
| Bản đồ tương tác 63 tỉnh | ✅ Đạt | Bản đồ Vector SVG nhẹ, mượt mà trên mọi thiết bị |
| Mô phỏng độ nhạy ngân sách | ✅ Đạt | Thanh trượt What-If thời gian thực trên `/budget` |
