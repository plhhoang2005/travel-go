import { PlanTripRequest, PlanTripResponse, TransportOptionData } from '../types/trip';

interface TransportOptionResponse extends Omit<TransportOptionData, 'isParetoOptimal'> {
  isParetoOptimal?: boolean;
  paretoOptimal?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export interface RawDestination {
  id: string;
  name: string;
  region: string;
  coordinates: { lat: number; lon: number };
  tags: string[];
  uniqueness_score: number;
  avg_daily_cost_vnd: number;
}

export async function fetchPlanTrip(req: PlanTripRequest): Promise<PlanTripResponse> {
  const response = await fetch(`${API_BASE_URL}/plan-trip`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    throw new Error(`Máy chủ phản hồi lỗi ${response.status}.`);
  }

  const result: Omit<PlanTripResponse, 'transportOptions'> & { transportOptions: TransportOptionResponse[] } = await response.json();
  return {
    ...result,
    transportOptions: result.transportOptions.map(({ paretoOptimal, isParetoOptimal, ...option }) => ({
      ...option,
      isParetoOptimal: isParetoOptimal ?? paretoOptimal ?? false,
    })),
  };
}

export async function fetchDestinations(): Promise<RawDestination[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/destinations`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Cannot fetch live destinations from backend, using fallback list', err);
  }
  return [
    { id: 'ha-noi', name: 'Hà Nội', region: 'Miền Bắc', coordinates: { lat: 21.0285, lon: 105.8542 }, tags: ['city', 'food', 'heritage'], uniqueness_score: 9.2, avg_daily_cost_vnd: 650000 },
    { id: 'sa-pa', name: 'Sa Pa (Lào Cai)', region: 'Miền Bắc', coordinates: { lat: 22.3364, lon: 103.8438 }, tags: ['mountain', 'trekking', 'cool-weather'], uniqueness_score: 9.0, avg_daily_cost_vnd: 700000 },
    { id: 'ha-giang', name: 'Hà Giang', region: 'Miền Bắc', coordinates: { lat: 22.8233, lon: 104.9836 }, tags: ['mountain', 'adventure', 'pass'], uniqueness_score: 9.5, avg_daily_cost_vnd: 550000 },
    { id: 'ninh-binh', name: 'Ninh Bình', region: 'Miền Bắc', coordinates: { lat: 20.2506, lon: 105.9745 }, tags: ['heritage', 'nature', 'boat'], uniqueness_score: 8.9, avg_daily_cost_vnd: 600000 },
    { id: 'ha-long', name: 'Vịnh Hạ Long (Quảng Ninh)', region: 'Miền Bắc', coordinates: { lat: 20.9505, lon: 107.0734 }, tags: ['beach', 'island', 'cruise'], uniqueness_score: 9.4, avg_daily_cost_vnd: 950000 },
    { id: 'phong-nha', name: 'Phong Nha - Kẻ Bàng (Quảng Bình)', region: 'Miền Trung', coordinates: { lat: 17.5898, lon: 106.2829 }, tags: ['cave', 'adventure', 'nature'], uniqueness_score: 9.6, avg_daily_cost_vnd: 700000 },
    { id: 'hue', name: 'Cố đô Huế', region: 'Miền Trung', coordinates: { lat: 16.4637, lon: 107.5909 }, tags: ['heritage', 'culture', 'food'], uniqueness_score: 8.8, avg_daily_cost_vnd: 550000 },
    { id: 'da-nang', name: 'Đà Nẵng', region: 'Miền Trung', coordinates: { lat: 16.0544, lon: 108.2022 }, tags: ['beach', 'city', 'food'], uniqueness_score: 8.7, avg_daily_cost_vnd: 800000 },
    { id: 'hoi-an', name: 'Hội An (Quảng Nam)', region: 'Miền Trung', coordinates: { lat: 15.8801, lon: 108.338 }, tags: ['heritage', 'ancient-town', 'lantern'], uniqueness_score: 9.1, avg_daily_cost_vnd: 750000 },
    { id: 'quy-nhon', name: 'Quy Nhơn (Bình Định)', region: 'Miền Trung', coordinates: { lat: 13.782, lon: 109.2197 }, tags: ['beach', 'seafood', 'island'], uniqueness_score: 8.4, avg_daily_cost_vnd: 600000 },
    { id: 'da-lat', name: 'Đà Lạt (Lâm Đồng)', region: 'Tây Nguyên', coordinates: { lat: 11.9465, lon: 108.4419 }, tags: ['mountain', 'food', 'romantic', 'cool-weather'], uniqueness_score: 8.5, avg_daily_cost_vnd: 600000 },
    { id: 'mang-den', name: 'Măng Đen (Kon Tum)', region: 'Tây Nguyên', coordinates: { lat: 14.6, lon: 108.2833 }, tags: ['mountain', 'pine-forest', 'cool-weather'], uniqueness_score: 8.6, avg_daily_cost_vnd: 500000 },
    { id: 'ho-chi-minh', name: 'TP. Hồ Chí Minh', region: 'Miền Nam', coordinates: { lat: 10.8231, lon: 106.6297 }, tags: ['city', 'food', 'shopping'], uniqueness_score: 8.8, avg_daily_cost_vnd: 750000 },
    { id: 'vung-tau', name: 'Vũng Tàu', region: 'Miền Nam', coordinates: { lat: 10.346, lon: 107.0843 }, tags: ['beach', 'seafood', 'quick-trip'], uniqueness_score: 7.2, avg_daily_cost_vnd: 450000 },
    { id: 'can-tho', name: 'Cần Thơ (Tây Đô)', region: 'Tây Nam Bộ', coordinates: { lat: 10.0452, lon: 105.7469 }, tags: ['floating-market', 'river', 'culture'], uniqueness_score: 8.3, avg_daily_cost_vnd: 500000 },
    { id: 'phu-quoc', name: 'Đảo Ngọc Phú Quốc (Kiên Giang)', region: 'Tây Nam Bộ', coordinates: { lat: 10.2899, lon: 103.984 }, tags: ['beach', 'resort', 'luxury', 'island'], uniqueness_score: 9.0, avg_daily_cost_vnd: 1200000 },
    { id: 'con-dao', name: 'Côn Đảo (Bà Rịa - Vũng Tàu)', region: 'Miền Nam', coordinates: { lat: 8.6835, lon: 106.6067 }, tags: ['island', 'beach', 'nature'], uniqueness_score: 9.1, avg_daily_cost_vnd: 1100000 }
  ];
}

export function getFallbackResponse(): PlanTripResponse {
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
      {
        day: 2,
        title: 'Rừng thông, cà phê & những con dốc',
        activities: [
          { time: '08:00', title: 'Ăn sáng và cà phê trong khu Hòa Bình', costVnd: 90000, durationHours: 1.5 },
          { time: '10:00', title: 'Tham quan Dinh Bảo Đại', costVnd: 60000, durationHours: 2.0 },
          { time: '14:30', title: 'Dạo rừng thông và ngắm hoàng hôn ngoại ô', costVnd: 120000, durationHours: 3.0 },
          { time: '19:00', title: 'Bữa tối với món địa phương', costVnd: 220000, durationHours: 2.0 },
        ],
      },
      {
        day: 3,
        title: 'Một buổi sáng chậm trước khi về',
        activities: [
          { time: '08:00', title: 'Đi bộ quanh Hồ Xuân Hương', costVnd: 0, durationHours: 1.0 },
          { time: '09:30', title: 'Ghé chợ mua đặc sản địa phương', costVnd: 180000, durationHours: 1.5 },
          { time: '11:30', title: 'Ăn trưa và chuẩn bị hành lý', costVnd: 160000, durationHours: 1.5 },
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
      weather: 'Open-Meteo Live API',
      prices: 'TripAI Reference Dataset (Mock 09/2026)',
    },
    assumptions: ['Giá vé và phòng có thể biến động 10-15% tùy ngày đặt.'],
  };
}
