"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function MovingBorderCard({
  borderRadius = "1rem",
  children,
  containerClassName,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <div
      className={cn(
        "relative p-[1px] overflow-hidden rounded-2xl group transition-all duration-300 hover:shadow-lg",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      {/* High-Performance Gradient Border Glow */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-[#2D572C]/40 to-amber-500/30 opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
      />

      <div
        className={cn(
          "relative bg-white border border-stone-200/80 group-hover:border-transparent rounded-2xl p-5 shadow-sm transition flex flex-col justify-between space-y-4 w-full h-full z-10",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export const MovingBorder = ({
  children,
}: {
  children: React.ReactNode;
  [key: string]: any;
}) => {
  return <>{children}</>;
};
