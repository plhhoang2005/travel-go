# TravelGO — Zero-Conflict Team Collaboration Plan

## Team Member Assignments & Directory Boundaries

### 👨‍💻 Developer 1: Backend Lead
- **Directory Scope**: `backend/src/main/java/com/travelgo/decision/` & `controller/`
- **Git Branch**: `feature/backend-engine`
- **Primary Responsibilities**:
  - Implement MCDA Scoring (`DestinationScorer.java`).
  - Implement Transport Pareto Tradeoff (`TransportOptimizer.java`).
  - Implement Greedy Constraint Scheduler (`ItineraryBuilder.java`).
  - Ensure REST Endpoint `POST /api/v1/plan-trip` returns full DTO schema with `score_contributions`.

### 🎨 Developer 2: Frontend Lead
- **Directory Scope**: `frontend/src/components/` & `frontend/src/pages/`
- **Git Branch**: `feature/frontend-dashboard`
- **Primary Responsibilities**:
  - Implement TripForm sliders (budget, days, people, preferences, priority).
  - Implement Recharts visual components (Transport BarChart, Budget PieChart, Score Contribution Progress Bars).
  - Implement Itinerary Accordion & Top 3 Destination Cards.

### 📊 Developer 3: Data & External API Specialist
- **Directory Scope**: `backend/src/main/resources/data/` & `external/`
- **Git Branch**: `feature/data-weather`
- **Primary Responsibilities**:
  - Populate 5 JSON mock datasets: `destinations.json`, `transport.json`, `hotels.json`, `pois.json`, `pricing.json`.
  - Implement Open-Meteo Weather API WebClient with Fallback indicator.
  - Implement 3 Quick-Fill Preset buttons on UI.
