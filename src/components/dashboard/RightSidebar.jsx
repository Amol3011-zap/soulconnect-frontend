import React from 'react';
import TodaysFocusPanel from './TodaysFocusPanel';
import GlobalPulseCard from './GlobalPulseCard';
import UpcomingSessionCard from './UpcomingSessionCard';
import InspirationCard from './InspirationCard';

/**
 * Right sidebar (desktop) / companion card feed (tablet + mobile).
 *
 * The same four cards in the same order everywhere. On desktop the parent
 * pins this to the right rail; below 1100px `.rs-stack` becomes part of the
 * main vertical feed instead of being hidden.
 */
export default function RightSidebar() {
  return (
    <div className="rs-stack">
      <TodaysFocusPanel />
      <GlobalPulseCard />
      <UpcomingSessionCard />
      <InspirationCard />
    </div>
  );
}
