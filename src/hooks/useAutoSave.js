import { useEffect, useRef } from 'react';

export function useAutoSave(data, isDirty, onSave, delay = 2000) {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      if (data) {
        onSave(data);
      }
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, isDirty, onSave, delay]);
}
