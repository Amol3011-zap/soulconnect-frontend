// ─────────────────────────────────────────────────────────────────────────────
// Tiny Wins date/reset logic — local calendar day, not UTC.
//
// Regression coverage for the Phase 1 audit finding: checkAndRefresh() used to
// compare `new Date().toISOString().split('T')[0]`, which reads the UTC day.
// For a user in India (UTC+5:30) that means "today" flipped at 5:30am local
// time instead of local midnight. See src/store/tinyWins.js for the fix.
//
// selectDailyWins() is mocked here — its own selection logic (which
// challenges get picked) is out of scope; this file only exercises *when*
// checkAndRefresh() decides a new day has started.
// ─────────────────────────────────────────────────────────────────────────────
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../engine/tinyWinsEngine', () => ({
  selectDailyWins: vi.fn(() => [
    { id: 'mock-1', title: 'Mock win 1', category: 'Mind' },
    { id: 'mock-2', title: 'Mock win 2', category: 'Body' },
    { id: 'mock-3', title: 'Mock win 3', category: 'Nature' },
  ]),
  getRandomReflection: vi.fn(() => 'Nice work.'),
}));

import { todayString, useTinyWinsStore } from './tinyWins';

/** Reset the store (including persisted daily state) to a clean slate between tests. */
function resetStore() {
  useTinyWinsStore.setState({
    dailyWins: [],
    dailyDate: null,
    completedToday: [],
    skippedToday: [],
    completionHistory: [],
    totalWins: 0,
  });
}

describe('todayString — local calendar day', () => {
  it('formats a date as local YYYY-MM-DD', () => {
    // 2026-09-21, 14:30 local, whatever timezone the test runner is in.
    const d = new Date(2026, 8, 21, 14, 30, 0);
    expect(todayString(d)).toBe('2026-09-21');
  });

  it('does not roll over to the next UTC day near local midnight (India, UTC+5:30, 23:59 local)', () => {
    // 23:59 IST on Sep 21 is 18:29 UTC on Sep 21 — still the same UTC day here,
    // but the bug this test guards against is the reverse case below (just
    // after midnight IST, which IS a different UTC day). Included for
    // completeness of the boundary.
    const d = new Date(2026, 8, 21, 23, 59, 0);
    expect(todayString(d)).toBe('2026-09-21');
  });

  it('reads as the new local day just after local midnight, even though UTC has not rolled over yet (the exact bug scenario)', () => {
    // 00:30 IST on Sep 22 is 19:00 UTC on Sep 21 — the OLD buggy
    // `toISOString().split('T')[0]` logic would have returned '2026-09-21'
    // here (still "yesterday"), even though the user's local calendar day
    // is clearly the 22nd.
    const d = new Date(2026, 8, 22, 0, 30, 0);
    expect(todayString(d)).toBe('2026-09-22');
    // Prove this against the old buggy formula directly, so the test fails
    // loudly if the fix ever regresses back to UTC-based comparison.
    const oldBuggyFormula = d.toISOString().split('T')[0];
    if (d.getTimezoneOffset() < 0) {
      // Test runner's local timezone is ahead of UTC (e.g. IST) — this is
      // the exact scenario the bug affected; the old formula must disagree.
      expect(oldBuggyFormula).not.toBe(todayString(d));
    }
  });

  it('agrees with local Date getters at another timezone-independent boundary (23:00 local, two different days)', () => {
    const dayOne = new Date(2026, 5, 1, 23, 0, 0);
    const dayTwo = new Date(2026, 5, 2, 1, 0, 0);
    expect(todayString(dayOne)).toBe('2026-06-01');
    expect(todayString(dayTwo)).toBe('2026-06-02');
    expect(todayString(dayOne)).not.toBe(todayString(dayTwo));
  });
});

describe('checkAndRefresh — regeneration gating', () => {
  beforeEach(() => {
    resetStore();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('generates dailyWins on first call', () => {
    vi.setSystemTime(new Date(2026, 8, 21, 9, 0, 0));
    useTinyWinsStore.getState().checkAndRefresh('clear-sky');
    const state = useTinyWinsStore.getState();
    expect(state.dailyWins).toHaveLength(3);
    expect(state.dailyDate).toBe('2026-09-21');
  });

  it('is idempotent — repeated calls within the same local day do not regenerate', () => {
    vi.setSystemTime(new Date(2026, 8, 21, 9, 0, 0));
    useTinyWinsStore.getState().checkAndRefresh('clear-sky');
    const firstWins = useTinyWinsStore.getState().dailyWins;

    // Simulate re-mount / refresh later the same day.
    vi.setSystemTime(new Date(2026, 8, 21, 21, 45, 0));
    useTinyWinsStore.getState().checkAndRefresh('clear-sky');
    const secondWins = useTinyWinsStore.getState().dailyWins;

    expect(secondWins).toBe(firstWins); // same array reference — no regeneration happened
  });

  it('regenerates after local midnight has passed, even if the UTC day has not rolled over yet (the core fix)', () => {
    // 23:50 IST-equivalent local time on day 1.
    vi.setSystemTime(new Date(2026, 8, 21, 23, 50, 0));
    useTinyWinsStore.getState().checkAndRefresh('clear-sky');
    expect(useTinyWinsStore.getState().dailyDate).toBe('2026-09-21');

    // 00:10 local time on day 2 — 20 minutes later by the wall clock.
    vi.setSystemTime(new Date(2026, 8, 22, 0, 10, 0));
    useTinyWinsStore.getState().checkAndRefresh('clear-sky');
    expect(useTinyWinsStore.getState().dailyDate).toBe('2026-09-22');
  });

  it('resets completedToday/skippedToday on a genuine day change', () => {
    vi.setSystemTime(new Date(2026, 8, 21, 10, 0, 0));
    useTinyWinsStore.getState().checkAndRefresh('clear-sky');
    useTinyWinsStore.setState({ completedToday: ['mock-1'], skippedToday: ['mock-2'] });

    vi.setSystemTime(new Date(2026, 8, 22, 10, 0, 0));
    useTinyWinsStore.getState().checkAndRefresh('clear-sky');

    const state = useTinyWinsStore.getState();
    expect(state.completedToday).toEqual([]);
    expect(state.skippedToday).toEqual([]);
  });

  it('survives a simulated refresh/remount without losing same-day progress', () => {
    vi.setSystemTime(new Date(2026, 8, 21, 10, 0, 0));
    useTinyWinsStore.getState().checkAndRefresh('clear-sky');
    useTinyWinsStore.getState().completeWin('mock-1');

    // "Remount": call checkAndRefresh again later the same local day, as
    // Home.jsx's mount effect does on every page load.
    vi.setSystemTime(new Date(2026, 8, 21, 16, 0, 0));
    useTinyWinsStore.getState().checkAndRefresh('clear-sky');

    const state = useTinyWinsStore.getState();
    expect(state.completedToday).toEqual(['mock-1']);
    expect(state.dailyWins).toHaveLength(3);
  });
});
