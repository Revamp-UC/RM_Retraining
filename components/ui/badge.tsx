import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20',
        success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
        warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/20',
        danger: 'bg-red-500/15 text-red-300 border border-red-500/20',
        muted: 'bg-[#1c1c26] text-[#9090a8] border border-[#2a2a38]',
        outline: 'border border-[#2a2a38] text-[#9090a8]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
