import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-ring select-none',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-accent/20 text-accent hover:bg-accent/30',
        secondary:
          'border-border bg-elevated text-foreground hover:bg-hover',
        outline:
          'border-border text-foreground',
        verified:
          'border-accent/30 bg-accent/10 text-accent font-mono',
        system:
          'border-border-strong bg-surface text-muted font-mono',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
