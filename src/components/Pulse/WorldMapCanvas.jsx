import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { geoNaturalEarth1, geoPath, geoCentroid } from 'd3-geo';
import { WORLD_FEATURE_COLLECTION } from '../../lib/worldTopo';
import { PROBLEMS } from '../../data/pulseExperienceData';
import { getDisplayRange } from '../../data/pulseDataAdapter';

// Map points only carry a bucketed range string (e.g. "5-9", "100-499") for
// privacy — this extracts just the lower bound to pick a point's on-screen
// size. It's never rendered as text; the visible number always comes from
// getDisplayRange()'s range string.
function lowerBoundOf(countRange) {
  const match = /^(\d+)/.exec(countRange || '');
  return match ? parseInt(match[1], 10) : 0;
}

const VIEW_W = 960;
const VIEW_H = 540;

// Fixed world projection: fitSize centers + scales the whole globe into
// the viewBox, so continents keep correct relative size/position — no
// hand-tuned coordinates anywhere in this file.
const projection = geoNaturalEarth1().fitSize([VIEW_W, VIEW_H], WORLD_FEATURE_COLLECTION);
const pathGenerator = geoPath(projection);

// ISO 3166-1 numeric (topojson feature id) -> alpha-2, for the handful of
// countries the backend can report. Derived once from real topology
// centroids below — no fabricated coordinates.
const ISO_NUMERIC_TO_ALPHA2 = {
  '356': 'IN', '840': 'US', '826': 'GB', '124': 'CA', '036': 'AU',
  '076': 'BR', '276': 'DE', '710': 'ZA', '410': 'KR', '392': 'JP',
  '250': 'FR', '724': 'ES', '380': 'IT', '528': 'NL', '566': 'NG',
  '818': 'EG', '404': 'KE', '484': 'MX', '032': 'AR', '170': 'CO',
  '702': 'SG', '764': 'TH', '360': 'CO', '554': 'NZ', '156': 'CN',
};

function useCountryCentroids() {
  return useMemo(() => {
    const centroids = {};
    WORLD_FEATURE_COLLECTION.features.forEach((f) => {
      const alpha2 = ISO_NUMERIC_TO_ALPHA2[f.id];
      if (!alpha2) return;
      const [lng, lat] = geoCentroid(f);
      if (Number.isNaN(lng) || Number.isNaN(lat)) return;
      centroids[alpha2] = [lng, lat];
    });
    return centroids;
  }, []);
}

function WorldMapCanvas({ countries, mapPoints, colors, selectedIso, onSelectCountry }) {
  const [hoveredIso, setHoveredIso] = useState(null);
  const centroidsByAlpha2 = useCountryCentroids();

  const countryByCode = useMemo(() => {
    const map = {};
    countries.forEach((c) => {
      map[c.code] = c;
    });
    return map;
  }, [countries]);

  const countryPaths = useMemo(() => {
    return WORLD_FEATURE_COLLECTION.features.map((f, i) => ({
      id: f.id,
      key: f.id != null ? f.id : `no-id-${i}`,
      code: ISO_NUMERIC_TO_ALPHA2[f.id] || null,
      name: f.properties?.name,
      d: pathGenerator(f),
    }));
  }, []);

  // One real point per country the backend reported (already aggregated and
  // privacy-thresholded server-side) — no fabricated city scatter.
  const points = useMemo(() => {
    return (mapPoints || [])
      .map((mp) => {
        const centroid = centroidsByAlpha2[mp.country_code];
        if (!centroid) return null;
        const [x, y] = projection(centroid) || [null, null];
        if (x == null || Number.isNaN(x)) return null;

        const topProblem = Object.entries(mp.breakdown || {}).sort(([, a], [, b]) => b - a)[0]?.[0];
        const radius = Math.min(10, 3 + Math.log2(lowerBoundOf(mp.count_range) + 1));

        return {
          key: mp.country_code,
          x,
          y,
          r: radius,
          color: colors[topProblem] || colors.other,
        };
      })
      .filter(Boolean);
  }, [mapPoints, centroidsByAlpha2, colors]);

  const hoveredFeature = hoveredIso ? countryPaths.find((c) => c.id === hoveredIso) : null;
  const hovered = hoveredFeature?.code ? countryByCode[hoveredFeature.code] : null;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        style={{ width: '100%', height: '100%', display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="pulseGlow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="mapAmbient" cx="50%" cy="38%">
            <stop offset="0%" stopColor="rgba(124,58,237,0.10)" />
            <stop offset="100%" stopColor="rgba(5,8,23,0)" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="#050817" />
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#mapAmbient)" />

        <g>
          {countryPaths.map((c) => {
            const hasData = Boolean(c.code && countryByCode[c.code]);
            const isHovered = c.id === hoveredIso;
            const isSelected = c.code === selectedIso;
            return (
              <path
                key={c.key}
                d={c.d}
                fill={isHovered || isSelected ? '#2f2158' : hasData ? '#241a44' : '#161031'}
                stroke={isHovered || isSelected ? 'rgba(168,85,247,0.55)' : 'rgba(124,90,200,0.18)'}
                strokeWidth={isHovered || isSelected ? 1 : 0.5}
                style={{ transition: 'fill 0.25s ease, stroke 0.25s ease', cursor: hasData ? 'pointer' : 'default' }}
                onMouseEnter={() => hasData && setHoveredIso(c.id)}
                onMouseLeave={() => setHoveredIso(null)}
                onClick={() => hasData && onSelectCountry(c.code)}
              />
            );
          })}
        </g>

        <g>
          {points.map((p) => (
            <g key={p.key} style={{ pointerEvents: 'none' }}>
              <circle cx={p.x} cy={p.y} r={p.r + 3} fill={p.color} opacity="0.14" filter="url(#pulseGlow)" />
              <motion.circle
                cx={p.x}
                cy={p.y}
                fill={p.color}
                filter="url(#pulseGlow)"
                initial={{ r: p.r, opacity: 0.65 }}
                animate={{ r: [p.r, p.r * 1.3, p.r], opacity: [0.65, 1, 0.65] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </g>
          ))}
        </g>

        {hoveredFeature && (
          <motion.path
            d={hoveredFeature.d}
            fill="none"
            stroke="#F472B6"
            strokeWidth="1.5"
            opacity="0.7"
            style={{ pointerEvents: 'none' }}
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        )}
      </svg>

      {hovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            padding: '16px 20px',
            borderRadius: '14px',
            backgroundColor: 'rgba(18,11,46,0.95)',
            border: '1px solid #7C3AED',
            boxShadow: '0 16px 48px rgba(124,58,237,0.25)',
            backdropFilter: 'blur(24px)',
            minWidth: '210px',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '15px', marginBottom: '6px', color: '#FFFFFF' }}>
            {hovered.name}
          </div>
          <div style={{ fontSize: '12px', marginBottom: '10px', color: 'rgba(255,255,255,0.5)' }}>
            {getDisplayRange(hovered.count_range) !== null
              ? `${hovered.count_range} anonymous check-ins`
              : 'Not enough data to display'}
          </div>

          {Object.entries(mapPoints.find((mp) => mp.country_code === hovered.code)?.breakdown || {})
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([problemId, percentage]) => {
              const problem = PROBLEMS.find((p) => p.id === problemId);
              const color = colors[problemId] || colors.other;
              return (
                <div key={problemId} style={{ display: 'flex', gap: '8px', marginBottom: '5px', fontSize: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, marginTop: '3px', flexShrink: 0 }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{problem?.label || problemId}</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 700, color }}>{percentage}%</span>
                </div>
              );
            })}
        </motion.div>
      )}
    </div>
  );
}

export default React.memo(WorldMapCanvas);
