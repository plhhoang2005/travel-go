import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { fetchPlanTrip, getFallbackResponse } from './api/tripApi';
import { DemoBanner } from './components/DemoBanner';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ItineraryPage } from './pages/ItineraryPage';
import { PlannerPage } from './pages/PlannerPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { TransportPage } from './pages/TransportPage';
import { ServicePage } from './pages/ServicePage';
import { PlanTripRequest, PlanTripResponse } from './types/trip';

const BudgetPage = lazy(() => import('./pages/BudgetPage').then((module) => ({ default: module.BudgetPage })));
const initialRequest: PlanTripRequest = {
  origin: 'Ho Chi Minh', numDays: 3, numPeople: 2, budgetVnd: 4000000,
  preferences: ['mountain', 'food', 'romantic'], priority: 'balanced',
};
const pageTitles: Record<string, string> = {
  '/': 'Khám phá Việt Nam theo cách của bạn', '/planner': 'Lập kế hoạch', '/destinations': 'Khám phá Việt Nam',
  '/transport': 'Phương tiện', '/budget': 'Ngân sách', '/itinerary': 'Lịch trình', '/about': 'Giới thiệu',
};

export default function App() {
  const location = useLocation();
  const { pathname } = location;
  const [displayLocation, setDisplayLocation] = useState(location);
  const [pageExiting, setPageExiting] = useState(false);
  const [request, setRequest] = useState(initialRequest);
  const [plannedRequest, setPlannedRequest] = useState(initialRequest);
  const [departureDate, setDepartureDate] = useState('');
  const [plannedDate, setPlannedDate] = useState('');
  const [response, setResponse] = useState<PlanTripResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoData, setIsDemoData] = useState(false);
  const pending = useRef(false);

  useEffect(() => {
    document.title = `${pageTitles[pathname] || 'Khám phá'} | TravelGO`;
  }, [pathname]);

  useEffect(() => {
    if (location.key === displayLocation.key) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setDisplayLocation(location);
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    setPageExiting(true);
    const timer = window.setTimeout(() => {
      setDisplayLocation(location);
      setPageExiting(false);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 180);
    return () => window.clearTimeout(timer);
  }, [location, displayLocation.key]);

  const submitPlan = async (nextRequest: PlanTripRequest = request) => {
    if (pending.current) return;
    pending.current = true;
    setLoading(true);
    setError(null);
    const snapshot = { ...nextRequest, preferences: [...nextRequest.preferences] };
    try {
      const result = await fetchPlanTrip(snapshot);
      setResponse(result);
      setPlannedRequest(snapshot);
      setPlannedDate(departureDate);
      setIsDemoData(false);
    } catch {
      setError('Không thể tạo kế hoạch chuyến đi. Vui lòng kiểm tra kết nối và thử lại.');
    } finally {
      pending.current = false;
      setLoading(false);
    }
  };

  const useDemoData = () => {
    const demo = getFallbackResponse();
    setResponse(demo);
    setPlannedRequest({ ...initialRequest, preferences: [...initialRequest.preferences] });
    setPlannedDate('');
    setIsDemoData(true);
    setError(null);
  };
  const shared = { request: plannedRequest, response };
  const plannerProps = {
    request, onChange: setRequest, onSubmit: submitPlan, loading, error, onUseDemo: useDemoData,
    response, plannedRequest, departureDate, onDateChange: setDepartureDate, plannedDate,
  };

  return (
    <div id="top" className="flex min-h-screen flex-col bg-canvas text-ink">
      <Header />
      <main id="main-content" className="min-w-0 flex-1">
        {isDemoData && displayLocation.pathname !== '/' && <DemoBanner />}
        <Suspense fallback={<p className="page-shell py-16 text-muted" role="status">Đang mở trang…</p>}>
          <div key={displayLocation.key} className={`page-stage ${pageExiting ? 'is-exiting' : ''}`}>
            <Routes location={displayLocation}>
            <Route path="/" element={<HomePage />} />
            <Route path="/planner" element={<PlannerPage {...plannerProps} />} />
            <Route path="/destinations" element={<DestinationsPage {...shared} />} />
            <Route path="/transport" element={<TransportPage {...shared} />} />
            <Route path="/budget" element={<BudgetPage {...shared} />} />
            <Route path="/itinerary" element={<ItineraryPage {...shared} departureDate={plannedDate} />} />
            <Route path="/hotels" element={<ServicePage type="hotel" />} />
            <Route path="/food" element={<ServicePage type="food" />} />
            <Route path="/tips" element={<ServicePage type="tips" />} />
            <Route path="/about" element={<ServicePage type="about" />} />
            <Route path="/lap-ke-hoach" element={<Navigate to="/planner" replace />} />
            <Route path="/ket-qua" element={<Navigate to="/destinations" replace />} />
            <Route path="/di-chuyen" element={<Navigate to="/transport" replace />} />
            <Route path="/ngan-sach" element={<Navigate to="/budget" replace />} />
            <Route path="/lich-trinh" element={<Navigate to="/itinerary" replace />} />
            <Route path="/khach-san" element={<Navigate to="/hotels" replace />} />
            <Route path="/an-uong" element={<Navigate to="/food" replace />} />
            <Route path="/goi-y" element={<Navigate to="/tips" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
