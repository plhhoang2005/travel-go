export interface PlanTripRequest {
  origin: string;
  numDays: number;
  numPeople: number;
  budgetVnd: number;
  preferences: string[];
  priority: 'cheapest' | 'fastest' | 'balanced' | 'comfortable';
}

export interface DestinationCardData {
  id: string;
  name: string;
  totalScore: number;
  normalizedScores: Record<string, number>;
  scoreContributions: Record<string, number>;
  estimatedCostVnd: number;
  weatherSource?: string;
  avgTempMax?: number;
  avgPrecipitation?: number;
  latitude?: number;
  longitude?: number;
  region?: string;
}

export interface TransportOptionData {
  mode: string;
  displayName: string;
  priceTotalVnd: number;
  durationHours: number;
  comfortScore: number;
  isParetoOptimal: boolean;
  tradeoffType: string;
  recommendationReason: string;
}

export interface ActivityData {
  time: string;
  title: string;
  costVnd: number;
  durationHours: number;
}

export interface ItineraryDayData {
  day: number;
  title: string;
  activities: ActivityData[];
}

export interface BudgetBreakdownData {
  transport: number;
  accommodation: number;
  food: number;
  attractions: number;
  remainingSafetyMargin: number;
}

export interface PlanTripResponse {
  winnerId: string;
  topDestinations: DestinationCardData[];
  transportOptions: TransportOptionData[];
  itineraryDays: ItineraryDayData[];
  budgetBreakdown: BudgetBreakdownData;
  aiExplanation: string;
  dataSources: Record<string, string>;
  assumptions: string[];
}

export interface BudgetStepData {
  budgetVnd: number;
  budgetLabel: string;
  winningDestinationId: string;
  winningDestinationName: string;
  destinationScore: number;
  recommendedTransportMode?: string;
  recommendedTransportName?: string;
  recommendedHotelTier?: string;
  recommendedHotelName?: string;
  estimatedTotalCostVnd: number;
  remainingSafetyMarginVnd: number;
  isFeasible?: boolean;
  feasible?: boolean;
  feasibilityStatus: string;
  budgetBreakdown?: BudgetBreakdownData;
}

export interface BudgetSensitivityResultData {
  steps: BudgetStepData[];
}

