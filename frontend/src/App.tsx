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
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { TripPage } from './pages/TripPage';
import { TransportPage } from './pages/TransportPage';
import { ServicePage } from './pages/ServicePage';
import { PlanTripRequest, PlanTripResponse } from './types/trip';

const BudgetPage = lazy(() => import('./pages/BudgetPage').then((module) => ({ default: module.BudgetPage })));
const initialRequest: PlanTripRequest = {
  origin: 'Ho Chi Minh', numDays: 3, numPeople: 2, budgetVnd: 4000000,
  preferences: ['mountain', 'food', 'romantic'], priority: 'balanced',
};
const storedTripKey = 'travelgo:current-trip';
type StoredTrip = { request: PlanTripRequest; departureDate: string; response: PlanTripResponse; isDemoData: boolean };

function readStoredTrip(): StoredTrip | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.sessionStorage.getItem(storedTripKey);
    if (!value) return null;
    const parsed = JSON.parse(value) as StoredTrip;
    if (!parsed?.request || !Array.isArray(parsed.response?.topDestinations) || !Array.isArray(parsed.response?.itineraryDays)) return null;
    return parsed;
  } catch {
    return null;
  }
}

const pageTitles: Record<string, string> = {
  '/': 'Khám phá Việt Nam theo cách của bạn', '/planner': 'Lập kế hoạch', '/destinations': 'Khám phá Việt Nam',
  '/transport': 'Phương tiện', '/budget': 'Ngân sách', '/itinerary': 'Lịch trình', '/hotels': 'Lưu trú',
  '/food': 'Ăn uống', '/tips': 'Gợi ý du lịch', '/about': 'Giới thiệu', '/trip/current': 'Hành trình của tôi',
};

export default function App() {
  const restoredTrip = useRef(readStoredTrip()).current;
  const location = useLocation();
  const { pathname } = location;
  const [displayLocation, setDisplayLocation] = useState(location);
  const [pageExiting, setPageExiting] = useState(false);
  const [request, setRequest] = useState(restoredTrip?.request ?? initialRequest);
  const [plannedRequest, setPlannedRequest] = useState(restoredTrip?.request ?? initialRequest);
  const [departureDate, setDepartureDate] = useState(restoredTrip?.departureDate ?? '');
  const [plannedDate, setPlannedDate] = useState(restoredTrip?.departureDate ?? '');
  const [response, setResponse] = useState<PlanTripResponse | null>(restoredTrip?.response ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoData, setIsDemoData] = useState(restoredTrip?.isDemoData ?? false);
  const pending = useRef(false);
  const initialLocationKey = useRef(location.key);
  const pageStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const title = pathname.startsWith('/destination/') ? 'Cẩm nang điểm đến' : pathname.startsWith('/trip/') ? 'Hành trình của tôi' : pageTitles[pathname] || 'Khám phá';
    document.title = `${title} | TravelGO`;
  }, [pathname]);

  useEffect(() => {
    if (!response) {
      window.sessionStorage.removeItem(storedTripKey);
      return;
    }
    window.sessionStorage.setItem(storedTripKey, JSON.stringify({ request: plannedRequest, departureDate: plannedDate, response, isDemoData } satisfies StoredTrip));
  }, [response, plannedRequest, plannedDate, isDemoData]);

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
    }, 240);
    return () => window.clearTimeout(timer);
  }, [location, displayLocation.key]);

  useEffect(() => {
    if (displayLocation.key === initialLocationKey.current) return;
    const frame = window.requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>('#main-content h1');
      if (!heading) return;
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [displayLocation.key]);

  useEffect(() => {
    pageStageRef.current?.toggleAttribute('inert', pageExiting);
  }, [pageExiting]);

  const submitPlan = async (nextRequest: PlanTripRequest = request) => {
    if (pending.current) return;
    pending.current = true;
    setLoading(true);
    setError(null);
    setResponse(null);
    setIsDemoData(false);
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
          <div
            ref={pageStageRef}
            key={displayLocation.key}
            className={`page-stage ${pageExiting ? 'is-exiting' : ''}`}
            data-route={displayLocation.pathname}
            aria-hidden={pageExiting || undefined}
          >
            <Routes location={displayLocation}>
            <Route path="/" element={<HomePage />} />
            <Route path="/planner" element={<PlannerPage {...plannerProps} />} />
            <Route path="/destinations" element={<DestinationsPage {...shared} />} />
            <Route path="/destination/:slug" element={<DestinationDetailPage />} />
            <Route path="/trip/:id" element={<TripPage {...shared} departureDate={plannedDate} />} />
            <Route path="/transport" element={<TransportPage {...shared} />} />
            <Route path="/budget" element={<BudgetPage {...shared} />} />
            <Route path="/itinerary" element={<ItineraryPage {...shared} departureDate={plannedDate} />} />
            <Route path="/hotels" element={<ServicePage type="hotel" />} />
            <Route path="/food" element={<ServicePage type="food" />} />
            <Route path="/tips" element={<ServicePage type="tips" />} />
            <Route path="/about" element={<ServicePage type="about" />} />
            <Route path="/explore" element={<Navigate to="/destinations" replace />} />
            <Route path="/plan-trip" element={<Navigate to="/planner" replace />} />
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
