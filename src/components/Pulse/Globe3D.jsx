import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { geoEquirectangular, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import worldTopology from '../../data/geo/countries-110m.json';
import { PROBLEMS } from '../../data/pulseExperienceData';
import { getDisplayRange } from '../../data/pulseDataAdapter';

const COUNTRY_CENTROIDS = {
  'IN': [20, 78], 'US': [38, -97], 'GB': [54, -2], 'CA': [56, -95], 'AU': [-27, 133],
  'BR': [-10, -55], 'DE': [51, 10], 'ZA': [-30, 22], 'KR': [37, 127], 'JP': [36, 138],
  'FR': [46, 2], 'ES': [40, -4], 'IT': [42, 12], 'NL': [52, 5], 'NG': [9, 8],
  'EG': [26, 30], 'KE': [0, 37], 'MX': [23, -102], 'AR': [-34, -64], 'CO': [4, -72],
  'SG': [1, 104], 'TH': [15, 101], 'NZ': [-41, 174], 'CN': [35, 105],
};

// Real Earth landmass geometry — the same Natural Earth 110m data (via the
// world-atlas package, already a project dependency) used by the 2D pulse
// map. `land` is the pre-merged landmass MultiPolygon (all continents,
// coastline-accurate, no internal borders needed for a globe texture).
// Rasterized once per mount below with d3-geo, so the sphere gets genuine
// coastlines instead of hand-drawn approximations.
const LAND_FEATURE = feature(worldTopology, worldTopology.objects.land);

function latLngToXYZ(lat, lng, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

function latLngToCoordinates(countryCode) {
  return COUNTRY_CENTROIDS[countryCode] || [null, null];
}

// Fixed positions for the 6 emotion-category markers, spread evenly around
// the globe on a wide great-circle band (~60° apart in longitude, alternating
// hemisphere) so none cluster and none overlap in screen space as the globe
// rotates — matches the reference composition.
const EMOTION_MARKER_LAYOUT = [
  { problemId: 'anxiety',       lat: 38,  lng: -80  },
  { problemId: 'loneliness',    lat: 45,  lng: -10  },
  { problemId: 'burnout',       lat: -20, lng: -55  },
  { problemId: 'mood',          lat: 30,  lng: 60   },
  { problemId: 'family',        lat: -15, lng: 30   },
  { problemId: 'relationships', lat: -30, lng: 105  },
];

// Populated-region seed points (lat/lng) used only to weight WHERE the
// illustrative background particle layer clusters — e.g. denser over land
// masses/coastal regions than mid-ocean. Purely decorative distribution
// guidance, not real user data.
const POPULATION_WEIGHT_SEEDS = [
  [40, -95], [34, -118], [40, -74], [-23, -46], [-34, -58],
  [51, 0], [48, 2], [52, 13], [41, 12], [55, 37],
  [28, 77], [19, 72], [23, 90], [31, 121], [35, 139], [37, 127],
  [1, 104], [13, 100], [-6, 107], [14, 121],
  [30, 31], [6, 3], [-1, 36], [-26, 28],
  [-33, 151], [-37, 175],
];

function Globe3D({ mapPoints, colors, selectedIso, onSelectCountry, countries, lightTheme = false }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const globeRef = useRef(null);
  const markersRef = useRef([]);
  const rotationSpeedRef = useRef(0.00022);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [labelPositions, setLabelPositions] = useState([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const autoRotateRef = useRef(true);
  const isDraggingRef = useRef(false);
  const lastDragXRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;

    // Scene setup — transparent background so the globe floats freely on
    // the page's own lavender glow instead of sitting in an opaque box.
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // The atmosphere shell is radius 1.09, so at fov=50° a camera at
    // z=2.75 gives a visible half-height of ~1.28 — the whole globe plus
    // its rim fits with comfortable margin and no edge clipping, while
    // still filling most of the frame.
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 10000);
    camera.position.z = 2.75;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Earth texture: real continent silhouettes on a deep-ocean base ──
    const TW = 2048, TH = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = TW;
    canvas.height = TH;
    const ctx = canvas.getContext('2d');

    // Deep navy/midnight ocean with subtle horizontal light banding
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, TH);
    oceanGradient.addColorStop(0, '#0B1C3D');
    oceanGradient.addColorStop(0.28, '#122A54');
    oceanGradient.addColorStop(0.5, '#16305E');
    oceanGradient.addColorStop(0.72, '#122A54');
    oceanGradient.addColorStop(1, '#0B1C3D');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, TW, TH);

    // Subtle ocean noise texture for depth
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * TW;
      const y = Math.random() * TH;
      const r = Math.random() * 1.4;
      ctx.fillStyle = `rgba(90,140,220,${Math.random() * 0.06})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw real Earth coastlines using d3-geo (accurate Natural Earth
    // geometry). Instead of a solid land fill, the continents are built
    // entirely out of a dense grid of tiny glowing dots — a "pointillist
    // data globe" look (dots outline + fill the landmass, ocean stays
    // clear/dark) rather than a painted map.
    const projection = geoEquirectangular()
      .fitSize([TW, TH], { type: 'Sphere' });

    // Render the land silhouette to an offscreen 1-bit mask first — this
    // is how we test "is this point on land" per dot without re-running
    // geo math per sample (fast: one fill, then pixel reads).
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = TW;
    maskCanvas.height = TH;
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    const maskPath = geoPath(projection, maskCtx);
    maskCtx.fillStyle = '#fff';
    maskCtx.beginPath();
    maskPath(LAND_FEATURE);
    maskCtx.fill();
    const maskData = maskCtx.getImageData(0, 0, TW, TH).data;
    const isLand = (x, y) => {
      if (x < 0 || x >= TW || y < 0 || y >= TH) return false;
      return maskData[(y * TW + x) * 4 + 3] > 128;
    };

    // Faint coastline outline for edge definition, drawn very dim so the
    // dot grid itself reads as the continent shape.
    const coastPath = geoPath(projection, ctx);
    ctx.beginPath();
    coastPath(LAND_FEATURE);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(139,164,230,0.22)';
    ctx.stroke();

    // Dense dot grid over land — this IS the continent now, not a fill.
    // A touch of per-dot jitter and size variance keeps it from looking
    // like a perfect mechanical lattice.
    const gridSpacing = 6;
    for (let y = 0; y < TH; y += gridSpacing) {
      for (let x = 0; x < TW; x += gridSpacing) {
        const jx = x + (Math.random() - 0.5) * 3;
        const jy = y + (Math.random() - 0.5) * 3;
        if (!isLand(Math.round(jx), Math.round(jy))) continue;
        const r = Math.random();
        ctx.beginPath();
        ctx.arc(jx, jy, r < 0.08 ? 1.6 : r < 0.3 ? 1.1 : 0.7, 0, Math.PI * 2);
        ctx.fillStyle = r < 0.08
          ? 'rgba(148,140,190,0.85)'   // occasional brighter dot, still muted
          : `rgba(110,118,160,${0.35 + r * 0.35})`;
        ctx.fill();
      }
    }

    // Scattered bright "city light" points on land, layered on top of the
    // dot grid for a few sparkle highlights (denser than before).
    for (let i = 0; i < 420; i++) {
      const x = Math.floor(Math.random() * TW);
      const y = Math.floor(Math.random() * TH);
      if (!isLand(x, y)) continue;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 0.9 + 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,244,214,0.7)';
      ctx.fill();
    }

    // Sparse star-like sparkle across the whole sphere (ocean included) —
    // the "space dust" texture visible in the reference's background.
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * TW;
      const y = Math.random() * TH;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 0.7 + 0.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,200,255,${Math.random() * 0.35})`;
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    // NOTE: deliberately NOT setting texture.colorSpace = SRGBColorSpace.
    // The canvas was painted with final display-ready hex values (not
    // scene-referred/HDR data), so telling the renderer to sRGB-decode it
    // before lighting pushed every midtone toward white — that was the
    // single biggest cause of the previous overexposed/white-Earth bug.
    // Leaving colorSpace at its default (NoColorSpace) makes the texture
    // read back as-authored.
    texture.needsUpdate = true;

    const geometry = new THREE.SphereGeometry(1, 128, 128);
    // Matte material — no clearcoat, no glossy/reflective layer. Two
    // rounds of "shiny" feedback made clear that any clearcoat/specular
    // sheen on this surface reads as unwanted shine rather than premium
    // polish, so it's removed rather than further tuned. A plain
    // MeshStandardMaterial with high roughness gives soft, non-reflective
    // shading from the lights below — depth and geography stay readable
    // without any glossy highlight moving across the sphere.
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 1,
      metalness: 0,
      side: THREE.FrontSide,
    });

    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);
    globeRef.current = globe;

    // Lighting — simple and restrained: one soft key light plus a dim
    // ambient fill so the dark side of the globe still shows geography,
    // and a faint violet rim for depth. No point/specular light — that
    // was the direct source of the glossy highlight the material change
    // above already removed the surface response for; keeping a bright
    // point light would just relight a matte surface into looking shiny
    // again via the ambient term.
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
    keyLight.position.set(4, 2.5, 3.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xC4B5FD, 0.3);
    rimLight.position.set(-3.5, -1.5, -2.5);
    scene.add(rimLight);

    // Atmosphere — a single fresnel shell.
    //
    // The previous approach stacked 5 BackSide spheres with *uniform*
    // opacity. A uniform-opacity BackSide sphere renders as a flat filled
    // disc from the camera's view, not a rim — so those layers were
    // painting solid colour discs across the entire globe (the pink/violet
    // "rings" that hid the Earth). A fresnel term is the correct way to
    // get atmosphere: it's ~0 facing the camera and rises only at the limb,
    // so the planet's face stays completely clear.
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColorInner: { value: new THREE.Color(0x7FB4FF) },
        uColorOuter: { value: new THREE.Color(0xB98BFF) },
      },
      vertexShader: `
        varying vec3 vNormalView;
        varying vec3 vViewDir;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vNormalView = normalize(normalMatrix * normal);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColorInner;
        uniform vec3 uColorOuter;
        varying vec3 vNormalView;
        varying vec3 vViewDir;
        void main() {
          // BackSide winding => flip the normal to face the camera
          float facing = abs(dot(normalize(vNormalView), normalize(vViewDir)));
          // 0 at the centre of the disc, 1 at the silhouette edge
          float fresnel = pow(1.0 - facing, 3.0);
          vec3 col = mix(uColorInner, uColorOuter, fresnel);
          gl_FragColor = vec4(col, fresnel * 0.55);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.09, 64, 64),
      atmosphereMaterial
    );
    scene.add(atmosphere);

    // ── Background particle field: thousands of tiny glowing dots ──
    // GPU-instanced via a single THREE.Points/BufferGeometry draw call
    // (not individual meshes/React components) so this stays cheap even
    // at high counts. Purely illustrative — communicates "countless lives,
    // countless places" and is NOT tied to real user coordinates; density
    // is only loosely weighted toward populated-region seed points so it
    // doesn't read as a uniform random sphere.
    const DOT_COUNT = w < 500 ? 900 : 2200; // fewer on small/mobile viewports
    const dotPositions = new Float32Array(DOT_COUNT * 3);
    const dotColors = new Float32Array(DOT_COUNT * 3);
    const dotSizes = new Float32Array(DOT_COUNT);
    const dotPalette = [
      new THREE.Color('#A855F7'), new THREE.Color('#8B5CF6'),
      new THREE.Color('#F472B6'), new THREE.Color('#60A5FA'),
      new THREE.Color('#67E8F9'), new THREE.Color('#FBBF24'),
    ];

    for (let i = 0; i < DOT_COUNT; i++) {
      let lat, lng;
      if (Math.random() < 0.72) {
        // Weighted near a populated seed for organic clustering
        const seed = POPULATION_WEIGHT_SEEDS[Math.floor(Math.random() * POPULATION_WEIGHT_SEEDS.length)];
        lat = Math.max(-85, Math.min(85, seed[0] + (Math.random() - 0.5) * 22));
        lng = seed[1] + (Math.random() - 0.5) * 30;
      } else {
        // Sparse uniform scatter so it doesn't look like isolated clusters
        lat = (Math.random() - 0.5) * 170;
        lng = (Math.random() - 0.5) * 360;
      }
      const pos = latLngToXYZ(lat, lng, 1.012 + Math.random() * 0.01);
      dotPositions[i * 3] = pos.x;
      dotPositions[i * 3 + 1] = pos.y;
      dotPositions[i * 3 + 2] = pos.z;

      const c = dotPalette[Math.floor(Math.random() * dotPalette.length)];
      dotColors[i * 3] = c.r;
      dotColors[i * 3 + 1] = c.g;
      dotColors[i * 3 + 2] = c.b;

      // Size in *world* units (sphere radius is 1.0), converted to pixels
      // in the shader. Keep these genuinely tiny — a dot is ~0.2% of the
      // globe's radius.
      dotSizes[i] = Math.random() < 0.08 ? 0.010 + Math.random() * 0.005 : 0.004 + Math.random() * 0.004;
    }

    // Per-point random phase so the pulsing subset never reads as
    // synchronized — each point drifts on its own independent cycle.
    const dotPhases = new Float32Array(DOT_COUNT);
    for (let i = 0; i < DOT_COUNT; i++) dotPhases[i] = Math.random() * Math.PI * 2;

    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    dotGeometry.setAttribute('color', new THREE.BufferAttribute(dotColors, 3));
    dotGeometry.setAttribute('aSize', new THREE.BufferAttribute(dotSizes, 1));
    dotGeometry.setAttribute('aPhase', new THREE.BufferAttribute(dotPhases, 1));

    // Custom shader material — THREE.PointsMaterial only supports a single
    // uniform size, not per-vertex size/animation, so a small custom
    // shader is the correct (and cheap) way to get organic per-dot pulse
    // and varied sizes in a single draw call.
    //
    // uProjScale converts a world-unit size into pixels the same way
    // Three.js's own sizeAttenuation does. A previous version used a bare
    // `300.0 / -mvPosition.z` with sizes of 1.0-4.0, which produced points
    // ~180-700px wide; 2200 of those in additive blending completely
    // buried the Earth under a wash of colour. Sizes are world units now.
    const dotMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        // canvas height (device px) / (2 * tan(fov/2)) — standard
        // perspective world->pixel size factor
        uProjScale: {
          value: (h * Math.min(window.devicePixelRatio, 2)) /
                 (2 * Math.tan(THREE.MathUtils.degToRad(50) / 2)),
        },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aPhase;
        uniform float uTime;
        uniform float uProjScale;
        varying vec3 vColor;
        varying float vGlow;
        void main() {
          vColor = color;
          float pulse = max(0.0, sin(uTime * 0.6 + aPhase));
          vGlow = 0.45 + pulse * 0.4;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (1.0 + pulse * 0.35) * uProjScale / max(-mvPosition.z, 0.001);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vGlow;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          float alpha = smoothstep(0.5, 0.1, d) * vGlow;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      // NormalBlending, not Additive: additive stacking of thousands of
      // overlapping points is what blew the whole globe out to white.
      blending: THREE.NormalBlending,
    });
    const dotField = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(dotField);

    // ── Markers ──
    // Real /pulse page: mapPoints carries actual per-country aggregated
    // check-ins (server-side privacy-thresholded) — render one marker per
    // reported country, hoverable for the breakdown tooltip.
    // Landing-page demo (no mapPoints passed): fall back to a fixed,
    // naturally-spread layout of emotion-category markers matching the
    // reference composition — never clustered, never per-user.
    const markerGroup = new THREE.Group();
    scene.add(markerGroup);
    markersRef.current = [];

    const usingRealData = Array.isArray(mapPoints) && mapPoints.length > 0;

    if (usingRealData) {
      mapPoints.forEach((mp) => {
        const [lat, lng] = latLngToCoordinates(mp.country_code);
        if (lat === null || lng === null) return;

        const pos = latLngToXYZ(lat, lng, 1.02);
        const topProblem = Object.entries(mp.breakdown || {}).sort(([, a], [, b]) => b - a)[0]?.[0];
        const colorStr = colors[topProblem] || colors.other || '#A855F7';
        const color = new THREE.Color(colorStr);

        const markerGeo = new THREE.SphereGeometry(0.026, 16, 16);
        const markerMat = new THREE.MeshBasicMaterial({ color });
        const marker = new THREE.Mesh(markerGeo, markerMat);
        marker.position.copy(pos);
        marker.userData = { countryCode: mp.country_code };

        const haloGeo = new THREE.SphereGeometry(0.05, 16, 16);
        const haloMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3 });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.copy(pos);

        markerGroup.add(marker);
        markerGroup.add(halo);
        markersRef.current.push({ marker, halo, pos, countryCode: mp.country_code, color: colorStr, isCountryMarker: true });
      });
    } else {
      EMOTION_MARKER_LAYOUT.forEach(({ problemId, lat, lng }) => {
        const problem = PROBLEMS.find((p) => p.id === problemId);
        if (!problem) return;
        const colorStr = colors[problemId] || colors.other || '#A855F7';
        const color = new THREE.Color(colorStr);
        const pos = latLngToXYZ(lat, lng, 1.02);

        const markerGeo = new THREE.SphereGeometry(0.028, 16, 16);
        const markerMat = new THREE.MeshBasicMaterial({ color });
        const marker = new THREE.Mesh(markerGeo, markerMat);
        marker.position.copy(pos);
        marker.userData = { problemId };

        const haloGeo = new THREE.SphereGeometry(0.055, 16, 16);
        const haloMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3 });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.copy(pos);

        markerGroup.add(marker);
        markerGroup.add(halo);
        markersRef.current.push({
          marker, halo, pos,
          label: problem.label.split(' & ')[0],
          icon: problem.icon,
          color: colorStr,
        });
      });
    }

    // ── Interaction: hover pauses rotation, gentle drag to spin ──
    // Pointer Events (not mouse-only) so this works uniformly on touch:
    // a mouse-event-only implementation leaves auto-rotate stuck paused on
    // mobile, because a touch drag fires touchmove/touchend, which don't
    // reliably synthesize mousemove/mouseup — so onPointerDown's
    // autoRotateRef.current = false never gets flipped back. pointerup/
    // pointercancel cover both the release and the "scrolled away" case.
    const onPointerMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDraggingRef.current) {
        const deltaX = event.clientX - lastDragXRef.current;
        globe.rotation.y += deltaX * 0.005;
        markerGroup.rotation.y += deltaX * 0.005;
        dotField.rotation.y += deltaX * 0.005;
        lastDragXRef.current = event.clientX;
        return;
      }

      if (event.pointerType && event.pointerType !== 'mouse') return;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(markersRef.current.map((m) => m.marker));
      setHoveredCountry(intersects.length > 0 ? intersects[0].object.userData.countryCode ?? null : null);
      autoRotateRef.current = intersects.length === 0;
    };

    const onClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(markersRef.current.map((m) => m.marker));
      if (intersects.length > 0 && intersects[0].object.userData.countryCode) {
        onSelectCountry?.(intersects[0].object.userData.countryCode);
      }
    };

    const onPointerDown = (event) => {
      isDraggingRef.current = true;
      lastDragXRef.current = event.clientX;
      autoRotateRef.current = false;
      renderer.domElement.setPointerCapture?.(event.pointerId);
    };

    const onPointerUp = (event) => {
      isDraggingRef.current = false;
      setHoveredCountry(null);
      autoRotateRef.current = true;
      renderer.domElement.releasePointerCapture?.(event.pointerId);
    };

    const onMouseLeave = () => {
      if (isDraggingRef.current) return;
      setHoveredCountry(null);
      autoRotateRef.current = true;
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('click', onClick);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    renderer.domElement.addEventListener('mouseleave', onMouseLeave);
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.style.touchAction = 'pan-y';

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Animation loop ──
    let rafId;
    let frameCount = 0;
    const projected = new THREE.Vector3();
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      frameCount++;

      if (autoRotateRef.current && !prefersReducedMotion) {
        globe.rotation.y += rotationSpeedRef.current;
        markerGroup.rotation.y += rotationSpeedRef.current;
        dotField.rotation.y += rotationSpeedRef.current;
      }

      markersRef.current.forEach((m, i) => {
        const pulse = Math.sin(Date.now() * 0.0025 + i * 0.9);
        m.halo.scale.setScalar(1 + pulse * 0.22);
        m.halo.material.opacity = 0.3 * (0.65 + pulse * 0.35);
      });

      // Each dot's brightness/size gently drifts on its own independent
      // phase (see aPhase in the shader) — driven by a single uniform so
      // this costs one draw call regardless of dot count.
      if (!prefersReducedMotion) {
        dotMaterial.uniforms.uTime.value = performance.now() * 0.001;
      }

      renderer.render(scene, camera);

      if (frameCount % 2 === 0 && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const next = markersRef.current
          .filter((m) => !m.isCountryMarker)
          .map((m) => {
            m.marker.getWorldPosition(projected);
            const facing = projected.clone().normalize().dot(
              camera.position.clone().normalize()
            );
            const screen = projected.clone().project(camera);
            const anchorX = (screen.x * 0.5 + 0.5) * rect.width;
            const anchorY = (-screen.y * 0.5 + 0.5) * rect.height;
            // Offset the pill outward from the dot (away from globe center
            // in screen space) so a short connector line reads clearly,
            // matching the reference's floating-label-with-stem look.
            const cx = rect.width / 2, cy = rect.height / 2;
            const dx = anchorX - cx, dy = anchorY - cy;
            const dist = Math.hypot(dx, dy) || 1;
            // Scale the outward offset with container size so labels never
            // push past a small mobile globe's own box — 64px suits the
            // ~500px desktop globe; a ~240px mobile globe needs proportionally
            // less room, and pill labels themselves shrink via CSS clamp().
            const offset = Math.max(28, Math.min(64, rect.width * 0.13));
            return {
              key: m.label,
              label: m.label,
              icon: m.icon,
              color: m.color,
              anchorX, anchorY,
              x: anchorX + (dx / dist) * offset,
              y: anchorY + (dy / dist) * offset,
              visible: facing > 0.08 && screen.z < 1,
            };
          });
        setLabelPositions(next);
      }
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      // Keep the world->pixel point-size factor in sync with the new height
      dotMaterial.uniforms.uProjScale.value =
        (newH * Math.min(window.devicePixelRatio, 2)) /
        (2 * Math.tan(THREE.MathUtils.degToRad(50) / 2));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('mouseleave', onMouseLeave);
      containerRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      atmosphere.geometry.dispose();
      atmosphereMaterial.dispose();
      dotGeometry.dispose();
      dotMaterial.dispose();
      markersRef.current.forEach((m) => {
        m.marker.geometry.dispose();
        m.marker.material.dispose();
        m.halo.geometry.dispose();
        m.halo.material.dispose();
      });
      renderer.dispose();
    };
  }, [mapPoints, colors, onSelectCountry, lightTheme]);

  const countryByCode = countries?.reduce((acc, c) => {
    acc[c.code] = c;
    return acc;
  }, {}) || {};
  const hoveredData = hoveredCountry ? countryByCode[hoveredCountry] : null;
  const mapPoint = hoveredData ? mapPoints?.find((mp) => mp.country_code === hoveredCountry) : null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
      />

      {/* Thin connector lines from each marker dot to its floating label */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 4 }}
      >
        {labelPositions.filter((l) => l.visible).map((l) => (
          <line
            key={l.key}
            x1={l.anchorX} y1={l.anchorY}
            x2={l.x} y2={l.y}
            stroke={l.color}
            strokeWidth={1.2}
            strokeOpacity={0.45}
          />
        ))}
      </svg>

      {/* Floating emotion-category labels — anonymized/aggregated signals,
          never tied to an individual user or exact location. */}
      {labelPositions.filter((l) => l.visible).map((l) => (
        <div
          key={l.key}
          style={{
            position: 'absolute',
            left: l.x,
            top: l.y,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(4px, 1.5vw, 8px)',
            padding: 'clamp(4px, 1.2vw, 7px) clamp(8px, 2.5vw, 14px) clamp(4px, 1.2vw, 7px) clamp(4px, 1.2vw, 8px)',
            borderRadius: 999,
            background: lightTheme ? 'rgba(255,255,255,0.94)' : 'rgba(18,11,46,0.94)',
            boxShadow: `0 6px 18px ${l.color}33, 0 2px 10px rgba(0,0,0,0.06)`,
            border: `1px solid ${l.color}55`,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 5,
          }}
        >
          <span style={{
            width: 'clamp(17px, 4.5vw, 24px)', height: 'clamp(17px, 4.5vw, 24px)', borderRadius: '50%',
            background: `linear-gradient(135deg, ${l.color}, ${l.color}CC)`,
            boxShadow: `0 0 10px ${l.color}99, 0 0 2px ${l.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'clamp(9px, 2.2vw, 12px)', flexShrink: 0,
          }}>
            {l.icon}
          </span>
          <span style={{ fontSize: 'clamp(10px, 2.6vw, 13px)', fontWeight: 600, color: lightTheme ? '#1F2937' : '#FFFFFF' }}>
            {l.label}
          </span>
        </div>
      ))}

      {/* Hover tooltip for real per-country data (only present on the
          actual /pulse page, which passes mapPoints/countries). */}
      {hoveredData && mapPoint && (
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
            backgroundColor: lightTheme ? 'rgba(255,255,255,0.9)' : 'rgba(18,11,46,0.95)',
            border: lightTheme ? '1px solid rgba(147,51,234,0.2)' : '1px solid #7C3AED',
            boxShadow: lightTheme ? '0 12px 32px rgba(0,0,0,0.08)' : '0 16px 48px rgba(124,58,237,0.25)',
            backdropFilter: 'blur(12px)',
            minWidth: '210px',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '15px', marginBottom: '6px', color: lightTheme ? '#1F2937' : '#FFFFFF' }}>
            {hoveredData.name}
          </div>
          <div style={{ fontSize: '12px', marginBottom: '10px', color: lightTheme ? '#6B7280' : 'rgba(255,255,255,0.5)' }}>
            {getDisplayRange(hoveredData.count_range) !== null
              ? `${hoveredData.count_range} anonymous check-ins`
              : 'Not enough data to display'}
          </div>

          {Object.entries(mapPoint?.breakdown || {})
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([problemId, percentage]) => {
              const problem = PROBLEMS.find((p) => p.id === problemId);
              const color = colors[problemId] || colors.other;
              return (
                <div key={problemId} style={{ display: 'flex', gap: '8px', marginBottom: '5px', fontSize: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, marginTop: '3px', flexShrink: 0 }} />
                  <span style={{ color: lightTheme ? '#6B7280' : 'rgba(255,255,255,0.7)' }}>{problem?.label || problemId}</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 700, color }}>{percentage}%</span>
                </div>
              );
            })}
        </motion.div>
      )}
    </div>
  );
}

export default React.memo(Globe3D);
