import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

const vite = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom' });
const { fetchBudgetSensitivity, fetchPlanTrip } = await vite.ssrLoadModule('/src/api/tripApi.ts');
after(() => vite.close());

const request = {
  origin: 'Ho Chi Minh', numDays: 3, numPeople: 2, budgetVnd: 4000000,
  preferences: ['mountain'], priority: 'balanced',
};

test('budget sensitivity calls the backend route and returns its result', async () => {
  const originalFetch = globalThis.fetch;
  const expected = { steps: [{ budgetVnd: 4000000, winningDestinationId: 'hue' }] };
  let calledUrl;
  globalThis.fetch = async (url) => {
    calledUrl = url;
    return { ok: true, json: async () => expected };
  };

  try {
    assert.deepEqual(await fetchBudgetSensitivity(request), expected);
    assert.equal(calledUrl, '/api/v1/simulate-sensitivity');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('budget sensitivity reports an HTTP failure instead of returning made-up scenarios', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, status: 503 });

  try {
    await assert.rejects(fetchBudgetSensitivity(request), /503/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('budget sensitivity reports a connection failure instead of returning made-up scenarios', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('Network unavailable'); };

  try {
    await assert.rejects(fetchBudgetSensitivity(request), /Network unavailable/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('new web request sends only per-person budget to both planning APIs', async () => {
  const originalFetch = globalThis.fetch;
  const bodies = [];
  globalThis.fetch = async (_url, options) => {
    bodies.push(JSON.parse(options.body));
    return { ok: true, json: async () => bodies.length === 1 ? { transportOptions: [] } : { steps: [] } };
  };

  try {
    const perPersonRequest = { ...request, budgetVnd: 0, budgetPerPersonVnd: 4000000 };
    await fetchPlanTrip(perPersonRequest);
    await fetchBudgetSensitivity(perPersonRequest);
    for (const body of bodies) {
      assert.equal(body.budgetPerPersonVnd, 4000000);
      assert.equal(body.numPeople, 2);
      assert.equal('budgetVnd' in body, false);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});
test('planning form and preset describe the entered amount per person', async () => {
  const { TripForm } = await vite.ssrLoadModule('/src/components/TripForm.tsx');
  const { TripPresets } = await vite.ssrLoadModule('/src/components/TripPresets.tsx');
  const form = renderToStaticMarkup(React.createElement(TripForm, {
    request: { ...request, budgetVnd: 0, budgetPerPersonVnd: 4000000 },
    onChange: () => {},
    onSubmit: () => {},
    loading: false,
    departureDate: '',
    onDateChange: () => {},
  }));
  const presets = renderToStaticMarkup(React.createElement(TripPresets, {
    onApplyPreset: () => {},
    loading: false,
  }));
  assert.match(form, /Ngân sách \(VNĐ\/người\)/);
  assert.match(form, /value="4000000"/);
  assert.match(presets, /4 triệu\/người/);
});
test('uncomputed slider amount does not show a different scenario margin', async () => {
  const { BudgetSensitivityPanel } = await vite.ssrLoadModule('/src/components/BudgetSensitivityPanel.tsx');
  const html = renderToStaticMarkup(React.createElement(BudgetSensitivityPanel, {
    request: { ...request, budgetVnd: 0, budgetPerPersonVnd: 4250000 },
    sensitivityData: {
      steps: [{
        budgetVnd: 8000000,
        budgetPerPersonVnd: 4000000,
        budgetLabel: '4,000,000 VNĐ/người',
        remainingSafetyMarginVnd: 1200000,
        estimatedTotalCostVnd: 6800000,
        feasibilityStatus: 'KHẢ THI',
      }],
    },
    onApplyBudget: () => {},
  }));
  assert.match(html, /4\.250\.000 VNĐ\/người/);
  assert.match(html, /Chưa tính/);
  assert.doesNotMatch(html, /Biên độ dự phòng/);
});
test('planner summary keeps the submitted group budget while the form changes', async () => {
  const { PlannerPage } = await vite.ssrLoadModule('/src/pages/PlannerPage.tsx');
  const submitted = { ...request, budgetVnd: 0, budgetPerPersonVnd: 4000000 };
  const editing = { ...submitted, budgetPerPersonVnd: 5000000 };
  const response = {
    winnerId: 'da-lat',
    topDestinations: [{ id: 'da-lat', name: 'Đà Lạt', totalScore: 8.5 }],
    transportOptions: [],
    itineraryDays: [],
    budgetBreakdown: { transport: 0, accommodation: 0, food: 0, attractions: 0, remainingSafetyMargin: 0 },
    budgetContext: { inputBasis: 'PER_PERSON', budgetPerPersonVnd: 4000000, totalBudgetVnd: 8000000, numPeople: 2 },
    aiExplanation: '',
    dataSources: {},
    assumptions: [],
  };
  const originalError = console.error;
  const ssrWarnings = [];
  console.error = (message) => { ssrWarnings.push(String(message)); };
  let html;
  try {
    html = renderToStaticMarkup(React.createElement(MemoryRouter, null,
    React.createElement(PlannerPage, {
      request: editing,
      onChange: () => {},
      onSubmit: async () => {},
      loading: false,
      error: null,
      onUseDemo: () => {},
      response,
      plannedRequest: submitted,
      departureDate: '',
      onDateChange: () => {},
      plannedDate: '',
    })));
  } finally {
    console.error = originalError;
  }
  assert.ok(ssrWarnings.every((message) => message.includes("useLayoutEffect does nothing on the server")));
  assert.match(html, /Ngân sách nhóm 8\.000\.000đ/);
  assert.doesNotMatch(html, /Ngân sách nhóm 10\.000\.000đ/);
});