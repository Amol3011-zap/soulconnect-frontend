import { useEffect } from 'react';

export function useDailyReset(onMidnightReached) {
  useEffect(() => {
    function checkMidnight() {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const msUntilMidnight = tomorrow.getTime() - now.getTime();

      const timeoutId = setTimeout(() => {
        onMidnightReached?.();
        // Check again after midnight
        checkMidnight();
      }, msUntilMidnight);

      return () => clearTimeout(timeoutId);
    }

    return checkMidnight();
  }, [onMidnightReached]);
}
