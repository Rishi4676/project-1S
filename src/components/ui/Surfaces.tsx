import React from 'react';
import { cn } from '@/lib/utils';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Dark elevated primary surface panel (e.g. Hero headers, main intelligence modules)
export const SurfacePrimary = React.forwardRef<HTMLDivElement, SurfaceProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-gradient-to-r from-slate-950 via-[#1B431C] to-slate-900 text-white rounded-2xl p-5 shadow-md border border-[#2D572C]/40',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SurfacePrimary.displayName = 'SurfacePrimary';

// Neutral structured elevated card surface (Standard information modules)
export const SurfaceElevated = React.forwardRef<HTMLDivElement, SurfaceProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-white border border-stone-200/80 rounded-xl p-4 sm:p-5 shadow-sm space-y-3',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SurfaceElevated.displayName = 'SurfaceElevated';

// Soft secondary neutral surface (Form containers, secondary feeds)
export const SurfaceSecondary = React.forwardRef<HTMLDivElement, SurfaceProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-stone-50 border border-stone-200/70 rounded-xl p-4 space-y-3',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SurfaceSecondary.displayName = 'SurfaceSecondary';

// Cool-toned weather & climate surface (Blue semantic color)
export const SurfaceWeather = React.forwardRef<HTMLDivElement, SurfaceProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-sky-50/70 border border-sky-200/80 text-sky-950 rounded-xl p-4 space-y-3',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SurfaceWeather.displayName = 'SurfaceWeather';

// Soft green-tinted success surface (Safe conditions, verified outcomes)
export const SurfaceSuccess = React.forwardRef<HTMLDivElement, SurfaceProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 rounded-xl p-4 space-y-3',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SurfaceSuccess.displayName = 'SurfaceSuccess';

// Warm amber-tinted caution surface (Advisories, caution warnings)
export const SurfaceWarning = React.forwardRef<HTMLDivElement, SurfaceProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-amber-50/80 border border-amber-200/80 text-amber-950 rounded-xl p-4 space-y-3',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SurfaceWarning.displayName = 'SurfaceWarning';

// Warm red/rose-tinted danger surface (Pest warnings, disease alerts, urgent actions)
export const SurfaceDanger = React.forwardRef<HTMLDivElement, SurfaceProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-rose-50/80 border border-rose-200/80 text-rose-950 rounded-xl p-4 space-y-3',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SurfaceDanger.displayName = 'SurfaceDanger';
