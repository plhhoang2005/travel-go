import { useEffect, useState } from 'react';
import { fetchBudgetSensitivity } from '../api/tripApi';
import { BudgetChart } from '../components/BudgetChart';
import { BudgetSensitivityPanel } from '../components/BudgetSensitivityPanel';
import { EmptyTripState } from '../components/EmptyTripState';
import { PageIntro } from '../components/PageIntro';
import { TripResultNav } from '../components/TripResultNav';
import { BudgetSensitivityResultData, PlanTripRequest, PlanTripResponse } from '../types/trip';

interface Props {
  request: PlanTripRequest;
  response: PlanTripResponse | null;
  onRequestChange?: (updated: PlanTripRequest) => void;
  onRePlan?: (updated: PlanTripRequest) => void;
}

export function BudgetPage({ request, response, onRequestChange, onRePlan }: Props) {
  const [sensitivityData, setSensitivityData] = useState<BudgetSensitivityResultData | null>(null);
  const [sensitivityError, setSensitivityError] = useState<string | null>(null);
  const [sensitivityLoading, setSensitivityLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setSensitivityData(null);
    setSensitivityError(null);
    setSensitivityLoading(true);
    fetchBudgetSensitivity(request)
      .then((data) => {
        if (isMounted) {
          setSensitivityData(data);
        }
      })
      .catch((err) => {
        console.warn('Error loading sensitivity:', err);
        if (isMounted) {
          setSensitivityError('Không thể tải mô phỏng ngân sách từ máy chủ. Vui lòng thử lại sau.');
        }
      })
      .finally(() => {
        if (isMounted) setSensitivityLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [request.origin, request.numDays, request.numPeople, request.budgetVnd, request.preferences, request.priority]);

  const handleApplyBudget = (newBudget: number) => {
    const updated: PlanTripRequest = { ...request, budgetVnd: newBudget };
    if (onRequestChange) {
      onRequestChange(updated);
    }
    if (onRePlan) {
      void onRePlan(updated);
    }
  };

  return (
    <>
      <PageIntro
        eyebrow="Giữ khoản chi trong tầm tay"
        title="Phân bổ ngân sách & Mô phỏng độ nhạy"
      >
        Theo dõi cách ngân sách {request.budgetVnd.toLocaleString('vi-VN')}đ được chia cho toàn bộ chuyến đi và kiểm thử các kịch bản tài chính đa chiều.
      </PageIntro>

      {response ? (
        <div className="page-shell py-10 md:py-12 space-y-10">
          <TripResultNav />
          <BudgetChart budget={response.budgetBreakdown} />
          {sensitivityLoading && <p role="status">Đang tải mô phỏng ngân sách…</p>}
          {sensitivityError && <p role="alert" className="text-rose-700">{sensitivityError}</p>}
          {sensitivityData && (
            <BudgetSensitivityPanel
              request={request}
              sensitivityData={sensitivityData}
              onApplyBudget={handleApplyBudget}
            />
          )}
        </div>
      ) : (
        <EmptyTripState />
      )}
    </>
  );
}
