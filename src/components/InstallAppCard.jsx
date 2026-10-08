import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Share, SquarePlus, Check, X, EllipsisVertical, Download } from 'lucide-react';
import { canPromptInstall, isStandalone, onInstallChange, platform, promptInstall } from '../pwa';

/**
 * "Get SameFeel on your home screen" card for phones.
 * iPhone: shows the Share → Add to Home Screen steps (iOS has no install popup).
 * Android: one tap Install when Chrome allows it, otherwise the menu steps.
 * Hidden when already installed, on desktop, or for 7 days after "Not now".
 * Add ?install=1 to any URL to show it again while testing.
 */
const KEY = 'sc-install-dismissed-at';
const WEEK = 7 * 24 * 3600 * 1000;
const P = '#6B4FA0';

function recentlyDismissed() {
  try {
    if (new URLSearchParams(window.location.search).get('install') === '1') {
      localStorage.removeItem(KEY);
      return false;
    }
    const t = Number(localStorage.getItem(KEY) || 0);
    return t && Date.now() - t < WEEK;
  } catch { return false; }
}

function Step({ n, children }) {
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#3A3350', lineHeight: 1.4 }}>
      <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#F1ECF9', color: P, fontWeight: 700, fontSize: 12.5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>{children}</span>
    </li>
  );
}

const Chip = ({ children }) => (
  <b style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 8, background: '#F6F2FC', border: '1px solid #E6DDF3', color: '#221B3A', fontWeight: 600 }}>{children}</b>
);

export default function InstallAppCard() {
  const [open, setOpen] = useState(false);
  const [, force] = useState(0);
  const os = typeof navigator !== 'undefined' ? platform() : 'desktop';

  useEffect(() => onInstallChange(() => force((n) => n + 1)), []);
  useEffect(() => {
    if (os === 'desktop' || isStandalone() || recentlyDismissed()) return undefined;
    const t = setTimeout(() => setOpen(true), 2500); // let the page settle first
    return () => clearTimeout(t);
  }, [os]);

  const dismiss = () => {
    try { localStorage.setItem(KEY, String(Date.now())); } catch { /* private mode */ }
    setOpen(false);
  };
  const install = async () => {
    const r = await promptInstall();
    if (r === 'accepted') setOpen(false);
  };

  const androidPrompt = os === 'android' && canPromptInstall();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Add SameFeel to your home screen"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          style={{
            position: 'fixed', left: 12, right: 12, zIndex: 998,
            bottom: 'calc(108px + env(safe-area-inset-bottom, 0px))',
            maxWidth: 440, margin: '0 auto',
            borderRadius: 22, padding: '16px 16px 14px',
            border: '1.5px solid transparent',
            background: 'linear-gradient(#fff,#fff) padding-box, linear-gradient(150deg,#D4B07A,#E7D3E4 45%,#9C86CC) border-box',
            boxShadow: '0 18px 44px rgba(34,27,58,.18)',
            fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif",
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/icon-192.png" alt="" width={44} height={44} style={{ borderRadius: 12, flexShrink: 0, boxShadow: '0 4px 12px rgba(107,79,160,.15)' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15.5, color: '#221B3A' }}>Get SameFeel on your home screen</div>
              <div style={{ fontSize: 12.5, color: '#6E6784', marginTop: 2 }}>Opens like an app. No app store needed.</div>
            </div>
            <button type="button" onClick={dismiss} aria-label="Close" style={{ width: 36, height: 36, border: 0, background: 'transparent', borderRadius: 10, color: '#8A84A0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <X size={18} />
            </button>
          </div>

          {androidPrompt ? (
            <button type="button" onClick={install} style={{ marginTop: 14, width: '100%', border: 0, borderRadius: 14, padding: '13px 16px', background: P, color: '#fff', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 16px rgba(107,79,160,.25)' }}>
              <Download size={17} /> Install SameFeel
            </button>
          ) : (
            <ol style={{ listStyle: 'none', margin: '14px 0 0', padding: 0, display: 'grid', gap: 10 }}>
              {os === 'ios-safari' && (
                <Step n={1}>Tap <Chip><Share size={14} color="#1a73e8" /> Share</Chip> at the bottom</Step>
              )}
              {os === 'ios-other' && (
                <Step n={1}>Tap <Chip><Share size={14} color="#1a73e8" /> Share</Chip> at the top right</Step>
              )}
              {os === 'android' && (
                <Step n={1}>Tap the <Chip><EllipsisVertical size={14} /> menu</Chip> at the top right</Step>
              )}
              {os === 'android' ? (
                <Step n={2}>Tap <Chip><SquarePlus size={14} /> Add to Home screen</Chip></Step>
              ) : (
                <Step n={2}>Scroll down, tap <Chip><SquarePlus size={14} /> Add to Home Screen</Chip></Step>
              )}
              <Step n={3}>Tap <Chip><Check size={14} color={P} /> Add</Chip></Step>
            </ol>
          )}

          <button type="button" onClick={dismiss} style={{ marginTop: 12, width: '100%', border: 0, background: 'transparent', color: '#6E6784', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', padding: 6 }}>
            Not now
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
