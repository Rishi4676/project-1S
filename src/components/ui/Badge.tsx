import React from 'react';

export const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'verified' | 'demo' | 'danger' | 'success' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    verified: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold',
    demo: 'bg-amber-50 text-amber-900 border-amber-300 font-medium',
    danger: 'bg-red-50 text-red-800 border-red-300 font-bold',
    success: 'bg-green-50 text-green-800 border-green-300 font-bold',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] border ${styles[variant]}`}>
      {children}
    </span>
  );
};
