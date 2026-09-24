import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// shadcn/ui class combiner: conditional classes + Tailwind conflict merging
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Dark theme: lift a data colour (avatar/category hex) toward white so text
// in that colour stays readable on navy cards. Light mode keeps the raw hex.
export function lightenForDark(hex, amount = 0.5) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const mix = (c) => Math.round(c + (255 - c) * amount).toString(16).padStart(2, '0');
  return `#${mix(n >> 16)}${mix((n >> 8) & 255)}${mix(n & 255)}`;
}
