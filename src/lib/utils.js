import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// shadcn/ui class combiner: conditional classes + Tailwind conflict merging
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
