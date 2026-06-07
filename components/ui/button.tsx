'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] disabled:pointer-events-none disabled:opacity-40 select-none',
  {
    variants: {
      variant: {
        default:
          'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98] shadow-lg shadow-indigo-900/30',
        destructive:
          'bg-red-600 text-white hover:bg-red-500 active:scale-[0.98] shadow-lg shadow-red-900/30',
        outline:
          'border border-[#2a2a38] bg-transparent text-[#f1f1f5] hover:bg-[#1c1c26] active:scale-[0.98]',
        ghost:
          'text-[#9090a8] hover:text-[#f1f1f5] hover:bg-[#1c1c26] active:scale-[0.98]',
        secondary:
          'bg-[#1c1c26] text-[#f1f1f5] hover:bg-[#22222e] active:scale-[0.98] border border-[#2a2a38]',
        amber:
          'bg-amber-500 text-black hover:bg-amber-400 active:scale-[0.98] shadow-lg shadow-amber-900/30 font-bold',
      },
      size: {
        default: 'h-11 px-5 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-13 px-8 text-base',
        xl: 'h-14 px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
