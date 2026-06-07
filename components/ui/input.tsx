import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-lg border bg-[#13131a] px-4 py-2 text-sm text-[#f1f1f5] placeholder:text-[#60607a] transition-colors duration-150',
            'border-[#2a2a38] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
