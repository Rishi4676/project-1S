"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
  renderItem,
}: {
  items: any[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  renderItem?: (item: any, index: number) => React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );

      const duration = speed === "fast" ? "20s" : speed === "normal" ? "35s" : "80s";
      containerRef.current.style.setProperty("--animation-duration", duration);
    }
  }, [direction, speed]);

  // Duplicate items declaratively for infinite continuous marquee
  const displayItems = [...items, ...items];

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      <ul
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-3 w-max flex-nowrap transform-gpu",
          mounted && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {displayItems.map((item, idx) => (
          <li
            key={`${item.id || idx}-${idx}`}
            className="w-[300px] sm:w-[350px] md:w-[400px] max-w-full relative rounded-2xl border border-stone-200 bg-white p-4 flex-shrink-0 shadow-sm hover:shadow-md transition"
          >
            {renderItem ? (
              renderItem(item, idx)
            ) : (
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {item.crop || item.category || "Community"}
                </span>
                <h3 className="text-base font-bold text-slate-900 line-clamp-2 mt-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3">
                  {item.content || item.quote}
                </p>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{item.author || item.name}</span>
                  {item.upvotes !== undefined && (
                    <span className="text-emerald-600 font-semibold">
                      👍 {item.upvotes}
                    </span>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
