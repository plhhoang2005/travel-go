# TravelGO — Hợp đồng ngân sách theo người (đề xuất W1)

**Trạng thái:** Dự thảo để Tech Lead duyệt; chưa đổi API hay công thức.

**Mục tiêu:** Người dùng nhập 4.000.000 VNĐ/người cho nhóm 2 người trong 3 ngày và nhận một kế hoạch có tổng ngân sách nhóm 8.000.000 VNĐ. Mọi con số chi tiêu phải ghi rõ theo người hay theo cả nhóm.

## 1. Hiện trạng cần sửa

- `PlanTripRequest.budgetVnd` hiện được trừ trực tiếp cho `BudgetBreakdown.remainingSafetyMargin`; UI lại có preset 3 ngày, 2 người, 4 triệu mà không nêu rõ đơn vị. `numPeople` chưa được dùng trong phép tính breakdown của `TripPlanningService` và `BudgetSimulator`.
- Kế hoạch chính dùng 300.000 VNĐ/ngày cho ăn uống, sensitivity dùng 250.000 VNĐ/ngày, còn `pricing.json` ghi mức standard 350.000 VNĐ/ngày. Kế hoạch chính tính phòng bằng `numDays` đêm; chuyến 3 ngày thông thường là 2 đêm.
- `transport.json` và `pois.json` không lưu đơn vị giá; `Destination.estimatedCostVnd` là một ước tính thô từ chi phí trung bình/ngày và tuyến đầu tiên, không phải tổng của breakdown. `BudgetSensitivityPanel` có thanh trượt ngoài ba mốc backend đang tính.

## 2. Quy ước đề xuất

| Khái niệm | Đơn vị và quy tắc | Nguồn/cách dùng |
| --- | --- | --- |
| `numPeople` | Số người nguyên dương | Ảnh hưởng ngân sách nhóm, vé, ăn uống và vé tham quan. |
| `numDays` | Số ngày nguyên dương; `nights = max(0, numDays - 1)` | Không mặc định 3 ngày là 3 đêm. |
| `budgetPerPersonVnd` | VNĐ/người cho toàn chuyến | Trường request mới dùng cho web. Không bao gồm phép nhân ở frontend. |
| `budgetVnd` trong request v1 | VNĐ cho **cả nhóm**; chỉ dùng khi không có `budgetPerPersonVnd` | Giữ ý nghĩa input cũ cho client hiện có. |
| `totalBudgetVnd` | VNĐ cho cả nhóm | Backend tính `budgetPerPersonVnd × numPeople`, hoặc lấy `budgetVnd` legacy. |
| Giá tuyến `price_total_vnd` trong JSON | **Giả định cần duyệt:** VNĐ/người cho hành trình khứ hồi | Dữ liệu tham khảo, không phải giá đặt chỗ. Tuyến tổng nhóm = giá này × số người. |
| Giá phòng `avg_nightly_vnd` | **Giả định cần duyệt:** VNĐ/phòng/đêm; sức chứa 2 người/phòng | Số phòng = `ceil(numPeople / 2)`; chi phí = giá × số phòng × số đêm. |
| Giá ăn uống | VNĐ/người/ngày; đề xuất dùng mức `standard` 350.000 trong `pricing.json` | Chi phí nhóm = giá × số người × số ngày. Thay đổi mức này phải được duyệt cùng công thức. |
| `PoiItem.costVnd` và `Activity.costVnd` | **Giả định cần duyệt:** VNĐ/người/lượt | POI `food`/`cafe` được ghi trong lịch trình nhưng nằm trong khoản ăn uống, không cộng lần hai vào tham quan. POI còn lại × số người. |
| `DestinationCard.estimatedCostVnd` | Giữ là **ước tính thô VNĐ/người** để tương thích DTO hiện tại | Bổ sung `estimatedGroupCostVnd` do backend tính. Gắn nhãn “ước tính so sánh”, không gọi là breakdown. |
| `TransportOption.priceTotalVnd` | Giữ là **giá tuyến tham khảo VNĐ/người** trong response cũ | Bổ sung `groupPriceTotalVnd`; UI ghi rõ đơn vị của từng số. |
| `BudgetBreakdown` | Mọi khoản `transport`, `accommodation`, `food`, `attractions`, `remainingSafetyMargin` đều là VNĐ/**cả nhóm** | `spent = transport + accommodation + food + attractions`; `remainingSafetyMargin = totalBudgetVnd - spent`, có thể âm. |
| `Activity.costVnd` | VNĐ/người/lượt | UI ghi “/người”; nếu cần tổng nhóm, backend bổ sung `groupCostVnd`, UI không tự nhân. |
| `avg_daily_cost_vnd` của điểm đến | **Giả định cần duyệt:** VNĐ/người/ngày; có thể đã gồm ăn/phòng | Chỉ dùng cho ước tính thô và chấm độ hợp ngân sách, không cộng thêm vào breakdown chi tiết. |

**Không đánh đồng hai ước tính:** `estimatedCostVnd` của thẻ điểm đến là chỉ báo thô `avg_daily_cost_vnd × numDays + giá tuyến tham chiếu/người`; `BudgetBreakdown` là dự toán chi tiết của phương án đã chọn. Hai số không bắt buộc bằng nhau. Điểm `budget_fit` phải so các giá trị cùng đơn vị: chi phí ước tính nhóm (`estimatedCostVnd × numPeople`) với ngân sách nhóm. Không đổi trọng số MCDA.

## 3. Hợp đồng API v1 đề xuất

### Request

- `POST /api/v1/plan-trip` và `POST /api/v1/simulate-sensitivity` nhận **đúng một** trong `budgetPerPersonVnd` hoặc `budgetVnd` legacy. Trường còn lại phải vắng mặt hoặc bằng 0 để hỗ trợ DTO cũ có `long` mặc định 0; giá trị âm luôn không hợp lệ. Nếu cả hai dương, cả hai thiếu/không dương, `numPeople <= 0`, `numDays <= 0`, hoặc phép nhân vượt `long`, trả HTTP 400 với thông điệp chỉ ra trường sai. Không âm thầm chọn một giá trị.
- Với request mới, `budgetPerPersonVnd` là VNĐ/người; backend là nơi duy nhất tính `totalBudgetVnd`. Với request cũ chỉ có `budgetVnd`, ý nghĩa vẫn là tổng nhóm. Kết quả có thể đổi vì sửa lỗi tính chi phí theo nhóm; tương thích ở đây là **đơn vị và khả năng đọc request**, không hứa giữ nguyên kết quả sai trước đây.
- DTO phản hồi thêm `budgetContext: { inputBasis: "PER_PERSON" | "TOTAL_LEGACY", budgetPerPersonVnd?: number, totalBudgetVnd: number, numPeople: number }`. Trường `budgetPerPersonVnd` luôn vắng mặt ở legacy, vì ngân sách tổng nhóm không khẳng định ý định chi đều theo người.

### Kế hoạch chính

- `budgetBreakdown` luôn là tổng nhóm. Không làm tròn giữa các phép cộng; chỉ định dạng VNĐ khi hiển thị.
- Nếu `remainingSafetyMargin < 0`, API vẫn trả kết quả có cảnh báo vượt ngân sách; không biến số âm thành 0, không mô tả là “khả thi”.
- `DestinationCard.estimatedCostVnd` và `TransportOption.priceTotalVnd` giữ nguyên trường cũ nhưng UI phải gắn nhãn “/người”; các trường nhóm mới do backend trả. Khi thiếu giá/nguồn, đánh dấu là ước tính hoặc fallback theo chính sách dữ liệu, không gắn nhãn giá thực.

### Sensitivity

- Với input mới theo người, ba mốc là **3/4/5 triệu VNĐ/người**. Mỗi `BudgetStep` có `budgetPerPersonVnd` tương ứng và `budgetVnd` là **tổng nhóm** (`mốc × numPeople`) để giữ đơn vị của trường legacy. `budgetLabel` ghi rõ “/người”; mọi khoản chi và dự phòng trong step là tổng nhóm.
- Với request legacy chỉ có `budgetVnd`, ba mốc cũ **3/4/5 triệu VNĐ tổng nhóm** được giữ để tránh đổi nghĩa luồng cũ; `budgetPerPersonVnd` không có. UI mới dùng trường theo người, không dựa vào chuỗi label để tính toán.
- Sensitivity có thể chọn điểm đến, phương tiện hoặc hạng phòng khác kế hoạch chính. Nếu lựa chọn khác, UI gọi đó là “kịch bản khác”, không trình bày hai breakdown như cùng một phương án. Nếu cùng phương án và cùng giả định chi phí, tổng chi phải khớp.
- Thanh trượt UI chỉ được gắn biên độ dự phòng với mốc backend thực sự trả. Với mức tùy chỉnh, gọi lại backend hoặc hiển thị “chưa tính”, không mượn kết quả mốc gần nhất.

## 4. Ví dụ số học để review

Ví dụ **minh họa hợp đồng**, không phải báo giá hay kết quả xếp hạng thật: vé khứ hồi 500.000 VNĐ/người; phòng 650.000 VNĐ/phòng/đêm, 2 người/phòng; ăn uống 350.000 VNĐ/người/ngày; một vé tham quan không thuộc ăn uống 250.000 VNĐ/người. Mọi ví dụ nhập 4.000.000 VNĐ/người.

| Người | Ngày/đêm | Ngân sách nhóm | Di chuyển | Phòng | Ăn uống | Tham quan | Tổng chi | Dự phòng |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 3/2 | 4.000.000 | 500.000 | 1.300.000 | 1.050.000 | 250.000 | 3.100.000 | 900.000 |
| 2 | 3/2 | 8.000.000 | 1.000.000 | 1.300.000 | 2.100.000 | 500.000 | 4.900.000 | 3.100.000 |
| 4 | 3/2 | 16.000.000 | 2.000.000 | 2.600.000 | 4.200.000 | 1.000.000 | 9.800.000 | 6.200.000 |
| 2 | 4/3 | 8.000.000 | 1.000.000 | 1.950.000 | 2.800.000 | 500.000 | 6.250.000 | 1.750.000 |
| 2 | 5/4 | 8.000.000 | 1.000.000 | 2.600.000 | 3.500.000 | 500.000 | 7.600.000 | 400.000 |

**Không đủ tiền:** Nếu 2 người đi 5 ngày với 3.000.000 VNĐ/người, ngân sách nhóm là 6.000.000 VNĐ. Với cùng giả định tổng chi 7.600.000 VNĐ, `remainingSafetyMargin = -1.600.000 VNĐ`; API/UI phải báo vượt ngân sách 1.600.000 VNĐ.

## 5. Điều kiện nghiệm thu W1 và cổng quyết định

1. Tech Lead xác nhận hoặc sửa các giả định chưa có metadata: vé khứ hồi/người, phòng/đêm/sức chứa 2, POI/người/lượt, chi phí trung bình điểm đến/người/ngày; xác nhận mức ăn uống chuẩn và quy tắc tránh đếm hai lần.
2. Tech Lead duyệt việc giữ `budgetVnd` là tổng nhóm cho legacy và thêm `budgetPerPersonVnd` cho web, cùng ý nghĩa các trường response mới và mốc sensitivity.
3. W2 chỉ bắt đầu sau khi quyết định trên được ghi rõ. Nếu dữ liệu gốc không đủ để xác nhận đơn vị giá, W2 phải ghi nguồn ước tính và tách việc chuẩn hóa dataset thành task riêng; không tự khẳng định giá thật.
4. Không sửa 5 luật kiến trúc, trọng số MCDA, DB hay dependency trong W1. Mọi phép tính ngân sách nhóm ở backend; frontend chỉ gửi input và hiển thị DTO.
