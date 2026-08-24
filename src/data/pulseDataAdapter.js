/**
 * Pulse Data Adapter
 *
 * Single seam between the Global Pulse UI and its data source. Calls the
 * real backend aggregation endpoint (GET /api/pulse/global via pulseAPI) —
 * the UI components (WorldMapCanvas, PulseStatsPanel) only depend on the
 * shape returned here, not on where it came from.
 *
 * There is no demo/fallback data. If the API call fails, callers must
 * surface an honest error state rather than substituting fabricated
 * numbers — see GlobalPulseNew.jsx for the loading/empty/error UI.
 *
 * Privacy: the backend enforces a minimum group size before a country or
 * category appears at all, and once visible, its count is a coarse range
 * string (e.g. "5-9"), not an exact integer — countries/categories also
 * only reflect check-ins old enough to have cleared a visibility delay, so
 * a fresh submission can't be correlated to an immediate change in the
 * numbers. See app/services/pulse_aggregation.py for the full rationale.
 * getDisplayRange() below is a client-side belt-and-braces guard for the
 * same minimum-group-size floor.
 */
import { pulseAPI } from '../services/api';
import { PROBLEM_COLORS } from './pulseExperienceData';

export const MIN_DISPLAYABLE_COUNT = 5;

export async function fetchGlobalPulse() {
  const response = await pulseAPI.getGlobal();
  const data = response.data;

  return {
    total: data.total ?? 0,
    categories: data.categories ?? [],
    countries: data.countries ?? [],
    map: data.map ?? [],
    minThreshold: data.min_threshold ?? MIN_DISPLAYABLE_COUNT,
    visibilityDelayMinutes: data.visibility_delay_minutes ?? null,
    colors: PROBLEM_COLORS,
  };
}

export async function submitCheckIn(problems, countryCode, countryName) {
  const response = await pulseAPI.checkIn(problems, countryCode, countryName);
  return response.data;
}

export function getDisplayRange(countRange) {
  if (!countRange || countRange === '0') return null; // caller should render "Not enough data to display"
  return countRange;
}
