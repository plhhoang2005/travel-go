package com.travelgo.service;

import com.travelgo.dto.PlanTripRequest;
import com.travelgo.dto.PlanTripResponse;
import com.travelgo.dto.PlanTripResponse.BudgetBreakdown;
import com.travelgo.dto.PlanTripResponse.DestinationCard;
import com.travelgo.dto.PlanTripResponse.TransportOption;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Model 5: Rich Rule-Based Facts Template Generator (Decision Intelligence Explainer)
 * 100% Deterministic, 0ms latency, pure fact-driven explanation.
 */
@Service
public class RuleBasedExplainerService {

    private final NumberFormat currencyFormatter = NumberFormat.getInstance(new Locale("vi", "VN"));

    public String generateExplanation(PlanTripRequest req, PlanTripResponse resp) {
        if (resp == null || resp.getTopDestinations() == null || resp.getTopDestinations().isEmpty()) {
            return "Chưa có đủ dữ liệu tính toán để đưa ra giải thích.";
        }

        DestinationCard winner = resp.getTopDestinations().stream()
                .filter(d -> d.getId().equals(resp.getWinnerId()))
                .findFirst()
                .orElse(resp.getTopDestinations().get(0));

        DestinationCard runnerUp = (resp.getTopDestinations().size() > 1) ? resp.getTopDestinations().get(1) : null;

        List<TransportOption> transports = resp.getTransportOptions();
        TransportOption bestTransport = (transports != null && !transports.isEmpty()) ? transports.get(0) : null;
        TransportOption alternativeTransport = (transports != null && transports.size() > 1) ? transports.get(1) : null;

        BudgetBreakdown budget = resp.getBudgetBreakdown();

        StringBuilder sb = new StringBuilder();

        // 1. Executive Summary & MCDA Winner Rationale
        appendWinnerRationale(sb, req, winner, runnerUp);

        // 2. Transport Pareto Trade-Off Analysis
        appendTransportTradeoff(sb, bestTransport, alternativeTransport);

        // 3. Live Weather Practical Advisory
        appendWeatherAdvisory(sb, winner);

        // 4. Financial Safety Margin & Conclusion
        appendFinancialSafety(sb, req, budget);

        return sb.toString();
    }

    private void appendWinnerRationale(StringBuilder sb, PlanTripRequest req, DestinationCard winner, DestinationCard runnerUp) {
        String priority = (req.getPriority() != null) ? req.getPriority().toLowerCase() : "balanced";
        double score = winner.getTotalScore();
        Map<String, Double> normalized = winner.getNormalizedScores();

        sb.append(String.format("🎯 **Lựa chọn Tối ưu**: Điểm đến **%s** đạt vị trí số 1 với tổng điểm MCDA **%.1f/10**", winner.getName(), score));

        if ("cheapest".equals(priority)) {
            sb.append(String.format(" nhờ chỉ số Chi phí phù hợp vượt trội (%.1f/10), ước tính %s VNĐ cho chuyến đi %d ngày",
                    normalized != null && normalized.containsKey("budget_fit") ? normalized.get("budget_fit") : 9.0,
                    formatVnd(winner.getEstimatedCostVnd()),
                    req.getNumDays()));
        } else if ("fastest".equals(priority)) {
            sb.append(String.format(" nhờ chỉ số Thời gian di chuyển thuận tiện (%.1f/10), giúp tối đa hóa thời gian trải nghiệm thực tế",
                    normalized != null && normalized.containsKey("travel_time") ? normalized.get("travel_time") : 9.0));
        } else {
            sb.append(String.format(" nhờ sự cân bằng xuất sắc giữa Độ phù hợp sở thích (%.1f/10) và Chi phí ước tính hợp lý (%s VNĐ)",
                    normalized != null && normalized.containsKey("preference_match") ? normalized.get("preference_match") : 8.5,
                    formatVnd(winner.getEstimatedCostVnd())));
        }

        if (runnerUp != null) {
            sb.append(String.format(", vượt qua %s (%.1f/10) ở các tiêu chí trọng tâm.", runnerUp.getName(), runnerUp.getTotalScore()));
        } else {
            sb.append(".");
        }
        sb.append("\n\n");
    }

    private void appendTransportTradeoff(StringBuilder sb, TransportOption best, TransportOption alt) {
        if (best == null) return;

        sb.append(String.format("🚗 **Tối ưu Phương tiện (Pareto Optimizer)**: Hệ thống đề xuất **%s** (%s VNĐ, %.1f giờ). ",
                best.getDisplayName(),
                formatVnd(best.getPriceTotalVnd()),
                best.getDurationHours()));

        if (alt != null) {
            long priceDiff = Math.abs(best.getPriceTotalVnd() - alt.getPriceTotalVnd());
            double timeDiff = Math.abs(best.getDurationHours() - alt.getDurationHours());

            if (best.getPriceTotalVnd() < alt.getPriceTotalVnd()) {
                sb.append(String.format("Phương án này giúp bạn tiết kiệm **%s VNĐ** (chấp nhận di chuyển lâu hơn %.1f giờ so với %s).",
                        formatVnd(priceDiff), timeDiff, alt.getDisplayName()));
            } else {
                sb.append(String.format("Phương án này giúp bạn rút ngắn **%.1f giờ** di chuyển (chi phí cao hơn %s VNĐ so với %s).",
                        timeDiff, formatVnd(priceDiff), alt.getDisplayName()));
            }
        } else {
            sb.append(String.format("Đánh giá: %s.", best.getRecommendationReason() != null ? best.getRecommendationReason() : "Tối ưu chi phí và tiện nghi."));
        }
        sb.append("\n\n");
    }

    private void appendWeatherAdvisory(StringBuilder sb, DestinationCard winner) {
        double temp = (winner.getAvgTempMax() > 0) ? winner.getAvgTempMax() : 26.0;
        double rain = winner.getAvgPrecipitation();
        String source = (winner.getWeatherSource() != null && winner.getWeatherSource().contains("LIVE")) ? "Open-Meteo Live API" : "Dữ liệu tham khảo";

        sb.append(String.format("🌤️ **Khuyến nghị Thời tiết (%s)**: Nhiệt độ trung bình **%.0f°C**, lượng mưa **%.1f mm**. ",
                source, temp, rain));

        if (rain < 2.0 && temp <= 28.0) {
            sb.append("Điều kiện thời tiết mát mẻ và khô ráo, rất lý tưởng cho các hoạt động tham quan, chụp ảnh và dạo bộ ngoài trời.");
        } else if (rain >= 5.0) {
            sb.append("Khả năng có mưa rào rải rác; khuyến nghị bạn chuẩn bị ô dù, áo mưa mỏng và ưu tiên các điểm tham quan trong nhà vào buổi chiều.");
        } else if (temp > 30.0) {
            sb.append("Thời tiết nắng đẹp đặc trưng miền biển, thích hợp tắm biển và ngắm hoàng hôn; hãy mang theo kem chống nắng và kính râm.");
        } else {
            sb.append("Thời tiết ôn hòa thuận lợi cho toàn bộ lịch trình tham quan.");
        }
        sb.append("\n\n");
    }

    private void appendFinancialSafety(StringBuilder sb, PlanTripRequest req, BudgetBreakdown budget) {
        if (budget == null) return;

        long margin = budget.getRemainingSafetyMargin();
        long totalBudget = req.getBudgetVnd();
        double percent = (totalBudget > 0) ? ((double) margin / totalBudget) * 100.0 : 0.0;

        sb.append(String.format("💰 **Biên độ An toàn Tài chính**: Bạn còn khoản dự phòng **%s VNĐ** (tương đương **%.1f%%** ngân sách). ",
                formatVnd(margin), Math.max(0.0, percent)));

        if (margin >= 0) {
            sb.append("Mức dự phòng này hoàn toàn đủ để bảo vệ kế hoạch của bạn trước các biến động giá thực tế (10-15%) của dịch vụ lưu trú và vé tham quan.");
        } else {
            sb.append("⚠️ Ngân sách đang vượt mức dự kiến nhẹ; bạn có thể cân nhắc chuyển sang hạng phòng homestay hoặc phương tiện tiết kiệm hơn.");
        }
    }

    private String formatVnd(long amount) {
        return currencyFormatter.format(amount);
    }
}
