/* ─────────────────────────────────────────────────────────────────────────────
   SHARED STYLE OBJECTS — extracted verbatim from Home.jsx
───────────────────────────────────────────────────────────────────────────── */
export const CARD_STYLE = {
  background: 'rgba(34,18,73,0.72)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 24,
  padding: '20px 20px',
  marginBottom: 14,
  boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)',
  position: 'relative',
  overflow: 'hidden',
};

export const SECTION_LABEL = {
  fontSize: 11, color: '#F4C542', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10,
};

export const GLASS_BTN = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12, color: '#E2DEFF',
  cursor: 'pointer', padding: '8px 16px',
  fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif',
};

export const PURPLE_BTN = {
  background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
  border: 'none', borderRadius: 14, color: '#fff',
  cursor: 'pointer', fontWeight: 700, fontSize: 14,
  padding: '11px 24px',
  boxShadow: '0 4px 20px rgba(124,58,237,0.45)',
  fontFamily: 'Inter, sans-serif',
};

export const WEATHER_OPTIONS = [
  { id: 'clear-sky',  emoji: '☀️', label: 'Clear'      },
  { id: 'hope',       emoji: '🌤', label: 'Hope'       },
  { id: 'blooming',   emoji: '🌸', label: 'Blooming'   },
  { id: 'fog',        emoji: '🌫', label: 'Fog'        },
  { id: 'heavy-rain', emoji: '🌧', label: 'Heavy Rain' },
  { id: 'storm',      emoji: '⚡', label: 'Storm'      },
];
