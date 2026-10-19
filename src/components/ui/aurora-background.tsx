"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center bg-gradient-to-br from-[#1B431C] via-[#2D572C] to-slate-950 text-slate-950 rounded-3xl overflow-hidden border border-[#2D572C] transform-gpu",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <div
          className={cn(
            `
            [--white-gradient:repeat-linear-gradient(100deg,rgba(45,87,44,0.2)_0%,rgba(45,87,44,0.2)_7%,transparent_10%,transparent_12%,rgba(45,87,44,0.2)_16%)]
            [--dark-gradient:repeat-linear-gradient(100deg,rgba(27,67,28,0.9)_0%,rgba(27,67,28,0.9)_7%,transparent_10%,transparent_12%,rgba(27,67,28,0.9)_16%)]
            [--aurora:repeat-linear-gradient(100deg,#2D572C_10%,#38761D_15%,#1B431C_20%,#2E7D32_25%,#1E4620_30%)]
            [background-image:var(--dark-gradient),var(--aurora)]
            [background-size:200%,_100%]
            opacity-30 transform-gpu
            absolute -inset-[10px]`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_20%,transparent_80%)]`
          )}
        ></div>
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};
