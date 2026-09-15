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
