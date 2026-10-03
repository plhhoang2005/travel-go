import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';

const vite = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom' });
const { fetchBudgetSensitivity } = await vite.ssrLoadModule('/src/api/tripApi.ts');
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
