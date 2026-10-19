import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#2D572C] focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none disabled:active:scale-100 select-none';

    const variants = {
      primary: 'bg-[#2D572C] hover:bg-[#1B431C] text-white shadow-sm border border-emerald-700/50',
      secondary: 'bg-[#1B431C] hover:bg-slate-900 text-emerald-100 border border-emerald-500/30 shadow-sm',
      outline: 'bg-white hover:bg-stone-50 text-slate-800 border border-stone-300/90 shadow-sm',
      ghost: 'bg-stone-100 hover:bg-stone-200/80 text-slate-700 border border-stone-200/60',
      danger: 'bg-rose-700 hover:bg-rose-800 text-white shadow-sm border border-rose-800/60',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-md min-h-[36px]',
      md: 'text-xs md:text-sm px-4 py-2 rounded-lg min-h-[44px]',
      lg: 'text-sm sm:text-base px-5 py-2.5 rounded-xl min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
