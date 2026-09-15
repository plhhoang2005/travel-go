import { PlanTripRequest, PlanTripResponse } from '../types/trip';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export async function fetchPlanTrip(req: PlanTripRequest): Promise<PlanTripResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/plan-trip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('API call failed, returning fallback mock response:', error);
    // Client-side fallback if backend is offline
    return getFallbackResponse();
  }
}

function getFallbackResponse(): PlanTripResponse {
  return {
    winnerId: 'da-lat',
    topDestinations: [
      {
        id: 'da-lat',
        name: 'Đà Lạt',
        totalScore: 8.76,
        normalizedScores: { budget_fit: 9.0, weather: 8.5, preference_match: 9.5, travel_time: 7.5, uniqueness: 8.5 },
        scoreContributions: { budget_fit: 2.70, weather: 1.70, preference_match: 2.38, travel_time: 1.13, uniqueness: 0.85 },
        estimatedCostVnd: 3800000,
      },
      {
        id: 'nha-trang',
        name: 'Nha Trang',
        totalScore: 7.95,
        normalizedScores: { budget_fit: 8.0, weather: 8.0, preference_match: 7.0, travel_time: 8.5, uniqueness: 8.0 },
        scoreContributions: { budget_fit: 2.40, weather: 1.60, preference_match: 1.75, travel_time: 1.28, uniqueness: 0.80 },
        estimatedCostVnd: 4200000,
      },
    ],
    transportOptions: [
      {
        mode: 'tau_lua',
        displayName: 'Tàu hỏa (Ghế ngồi mềm)',
        priceTotalVnd: 700000,
        durationHours: 6.0,
        comfortScore: 8,
        isParetoOptimal: true,
        tradeoffType: 'balanced',
        recommendationReason: 'Cân bằng tốt nhất giữa giá vé và sự thoải mái.',
      },
      {
        mode: 'xe_khach',
        displayName: 'Xe khách giường nằm',
        priceTotalVnd: 500000,
        durationHours: 7.5,
        comfortScore: 7,
        isParetoOptimal: true,
        tradeoffType: 'cheapest',
        recommendationReason: 'Tiết kiệm chi phí di chuyển nhất.',
      },
    ],
    itineraryDays: [
      {
        day: 1,
        title: 'Khám phá phố núi & Chợ Đêm',
        activities: [
          { time: '08:00', title: 'Ăn sáng Bánh mì xíu mại Hoàng Diệu', costVnd: 40000, durationHours: 1.0 },
          { time: '09:30', title: 'Dạo quanh Hồ Xuân Hương', costVnd: 0, durationHours: 1.5 },
          { time: '18:30', title: 'Khám phá Chợ Đêm Đà Lạt & Lẩu gà lá é', costVnd: 180000, durationHours: 2.5 },
        ],
      },
    ],
    budgetBreakdown: {
      transport: 700000,
      accommodation: 1200000,
      food: 1100000,
      attractions: 400000,
      remainingSafetyMargin: 600000,
    },
    aiExplanation: 'Đà Lạt được hệ thống TravelGO đề xuất nhờ điểm Preference Match xuất sắc (9.5/10) và ngân sách cực kỳ hợp lý.',
    dataSources: {
      weather: 'Client mock weather (backend offline)',
      prices: 'TripAI Reference Dataset (Mock 09/2026)',
    },
    assumptions: ['Giá vé và phòng có thể biến động 10-15% tùy ngày đặt.'],
  };
}
