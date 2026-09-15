import { useState, useEffect } from 'react';
import { PlanTripRequest, PlanTripResponse } from './types/trip';
import { fetchPlanTrip } from './api/tripApi';
import { TripForm } from './components/TripForm';
import { DestinationCard } from './components/DestinationCard';
import { TransportCompare } from './components/TransportCompare';
import { BudgetChart } from './components/BudgetChart';
import { ItineraryTimeline } from './components/ItineraryTimeline';
import { AiExplanationBox } from './components/AiExplanationBox';

export default function App() {
  const [request, setRequest] = useState<PlanTripRequest>({
    origin: 'Ho Chi Minh',
    numDays: 3,
    numPeople: 2,
    budgetVnd: 4000000,
    preferences: ['mountain', 'food', 'romantic'],
    priority: 'balanced',
  });

  const [response, setResponse] = useState<PlanTripResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetchPlanTrip(request);
      setResponse(res);
    } catch (e) {
      console.error('Error fetching plan:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  const handleApplyPreset = (presetId: number) => {
    if (presetId === 1) {
      // Đà Lạt
      const p1: PlanTripRequest = {
        origin: 'Ho Chi Minh',
        numDays: 3,
        numPeople: 2,
        budgetVnd: 4000000,
        preferences: ['mountain', 'food', 'romantic'],
        priority: 'balanced',
      };
      setRequest(p1);
    } else if (presetId === 2) {
      // Phú Quốc
      const p2: PlanTripRequest = {
        origin: 'Ho Chi Minh',
        numDays: 4,
        numPeople: 3,
        budgetVnd: 8000000,
        preferences: ['beach', 'resort', 'seafood'],
        priority: 'comfortable',
      };
      setRequest(p2);
    } else if (presetId === 3) {
      // Vũng Tàu
      const p3: PlanTripRequest = {
        origin: 'Ho Chi Minh',
        numDays: 2,
        numPeople: 2,
        budgetVnd: 1500000,
        preferences: ['beach', 'food', 'quick-trip'],
        priority: 'cheapest',
      };
      setRequest(p3);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* Header */}
      <header className="bg-slate-900 text-white py-4 px-6 shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-xl font-black text-white shadow-lg">
              TG
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                TravelGO <span className="text-xs bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/30">v1.0 MVP</span>
              </h1>
              <p className="text-xs text-slate-400">
                Smart Travel & Mobility Decision Intelligence — MLAI Hackathon 2026 (Track C)
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-4 space-y-6">
          <TripForm
            request={request}
            onChange={setRequest}
            onSubmit={handleSubmit}
            onApplyPreset={handleApplyPreset}
            loading={loading}
          />
        </div>

        {/* Right Column: Output Dashboard */}
        <div className="lg:col-span-8 space-y-6">
          {response ? (
            <>
              {/* Top 3 Destination Cards */}
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <span>🎯</span> Xếp Hạng Điểm Đến Tối Ưu (MCDA Engine)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {response.topDestinations.map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      isWinner={dest.id === response.winnerId}
                    />
                  ))}
                </div>
              </div>

              {/* Grid 2 Columns: Transport & Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TransportCompare options={response.transportOptions} />
                <BudgetChart budget={response.budgetBreakdown} />
              </div>

              {/* Itinerary Timeline */}
              <ItineraryTimeline days={response.itineraryDays} />

              {/* AI Explanation Box */}
              <AiExplanationBox
                explanation={response.aiExplanation}
                dataSources={response.dataSources}
                assumptions={response.assumptions}
              />
            </>
          ) : (
            <div className="bg-white p-12 rounded-2xl shadow-sm border text-center text-slate-400">
              ⏳ Đang tải dữ liệu Decision Intelligence...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
