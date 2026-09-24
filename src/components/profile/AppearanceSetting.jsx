import React, { useCallback } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useThemeStore } from '../../store/theme';

const OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

// Profile › Appearance: Light / Dark / System for the logged-in app.
// The choice persists (theme-store) and applies instantly — no reload.
function AppearanceSetting() {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  const onKeyDown = useCallback((e) => {
    const i = OPTIONS.findIndex((o) => o.value === mode);
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = OPTIONS[(i + step + OPTIONS.length) % OPTIONS.length].value;
    setMode(next);
    e.currentTarget.querySelector(`[data-value="${next}"]`)?.focus();
  }, [mode, setMode]);

  return (
    <Card className="mb-4 p-4">
      <div className="mb-3">
        <h3 id="appearance-title" className="text-[14px] font-bold text-foreground">Appearance</h3>
        <p className="mt-0.5 text-[12px] text-muted-foreground">Choose how SoulConnect looks on this device.</p>
      </div>
      <div
        role="radiogroup"
        aria-labelledby="appearance-title"
        onKeyDown={onKeyDown}
        className="grid grid-cols-3 gap-1 rounded-2xl bg-muted p-1"
      >
        {OPTIONS.map(({ value, label, icon: Icon }) => {
          const on = mode === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              data-value={value}
              onClick={() => setMode(value)}
              className={cn(
                'flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl text-[13px] font-semibold transition-colors duration-150 active:scale-[0.98]',
                on
                  ? 'bg-card text-foreground shadow-[0_1px_2px_rgba(23,22,66,0.08)] ring-1 ring-primary/40'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export default React.memo(AppearanceSetting);
