import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Check, ArrowRight } from 'lucide-react';
import { useTinyWinsStore } from '../../store/tinyWins';

/**
 * Today's Focus — the sidebar's opening card.
 *
 * Reads the real Tiny Wins store (same source as the dashboard's Tiny Wins
 * strip), so the checklist and its completion state are genuine. Ticking an
 * item here calls the store's own completeWin action; nothing is faked and no
 * new API is introduced.
 */
export default function TodaysFocusPanel() {
  const navigate = useNavigate();
  const dailyWins = useTinyWinsStore(s => s.dailyWins);
  const completedToday = useTinyWinsStore(s => s.completedToday);
  const completeWin = useTinyWinsStore(s => s.completeWin);

  const items = (dailyWins || []).slice(0, 4);
  const allDone = items.length > 0 && items.every(w => completedToday.includes(w.id));

  const onToggle = useCallback((id) => {
    if (!completedToday.includes(id)) completeWin(id);
  }, [completedToday, completeWin]);

  return (
    <section className="sc-panel rs-card rs-focus" aria-labelledby="todays-focus-heading">
      <header style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Leaf size={16} strokeWidth={2} color="#6EE7B7" aria-hidden="true" />
        <h2 id="todays-focus-heading" className="rs-card-title" style={{ gap: 0 }}>
          Today&apos;s Focus
        </h2>
      </header>

      <p className="rs-focus-headline">
        Small steps.<br />Big change.
      </p>

      {items.length > 0 ? (
        <ul className="rs-check-list">
          {items.map(win => {
            const done = completedToday.includes(win.id);
            return (
              <li key={win.id}>
                <button
                  type="button"
                  className="rs-check-item"
                  onClick={() => onToggle(win.id)}
                  aria-pressed={done}
                  disabled={done}
                  title={win.description || win.title}
                >
                  <span className={`rs-check-box${done ? ' is-done' : ''}`} aria-hidden="true">
                    {done && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className={`rs-check-label${done ? ' is-done' : ''}`}>
                    {win.shortTitle || win.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rs-muted" style={{ margin: '0 0 14px' }}>
          Your next small step is waiting.
        </p>
      )}

      <button
        type="button"
        className="rs-btn rs-btn--primary"
        onClick={() => navigate('/tiny-wins')}
      >
        {allDone ? 'All done today' : 'Start Today'}
        <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
      </button>

      <p className="rs-quote-line">&ldquo;Progress, not perfection.&rdquo;</p>
    </section>
  );
}
