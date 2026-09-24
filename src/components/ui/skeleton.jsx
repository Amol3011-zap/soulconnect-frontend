import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-xl bg-muted motion-reduce:animate-none', className)} {...props} />;
}

export { Skeleton };
