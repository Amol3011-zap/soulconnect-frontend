/**
 * useReflections — local-storage backed reflection store.
 *
 * Data shape per entry:
 *   { text: string, savedAt: ISO string, updatedAt: ISO string | null }
 *
 * All I/O is isolated here so backend integration only touches this file.
 * Swap localStorage calls for API calls when ready.
 */

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'sc_reflections_v1';

function todayKey() {
  return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
}

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function useReflections() {
  const [store, setStore] = useState(readAll);

  const key = todayKey();
  const todayReflection = store[key] ?? null; // { text, savedAt, updatedAt } | null

  /**
   * Save or update today's reflection.
   * Returns a promise so callers can await it — ready for async backend swap.
   */
  const saveReflection = useCallback(
    async (text) => {
      const isUpdate = Boolean(todayReflection);
      const now = new Date().toISOString();

      const entry = isUpdate
        ? { ...todayReflection, text, updatedAt: now }
        : { text, savedAt: now, updatedAt: null };

      const updated = { ...store, [key]: entry };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setStore(updated);

      // Future: return await api.saveReflection({ date: key, text });
      return { isUpdate };
    },
    [store, key, todayReflection],
  );

  return {
    todayReflection,   // null or { text, savedAt, updatedAt }
    saveReflection,    // async (text: string) => { isUpdate: bool }
    isExisting: Boolean(todayReflection),
  };
}
