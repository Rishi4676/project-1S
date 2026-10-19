"use client";

import React, { memo, useRef, useEffect, useState } from 'react';

export const BackgroundVideo = memo(function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Ensure smooth continuous playback and handle browser autoplay policies
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.85; // Slightly slower, cinematic cadence
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was restrained by user/browser power saver; silently fall back
        });
      }
    }
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full overflow-hidden z-0 pointer-events-none select-none"
      style={{
        contain: 'strict',
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
    >
      {/* High-fidelity Fallback Background Image/Gradient if video is unsupported or fails */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0e2710] to-slate-950"
        style={{ transform: 'translateZ(0)' }}
      />

      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onError={() => setVideoError(true)}
          className="w-full h-full object-cover pointer-events-none transform-gpu"
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
      )}

      {/* Atmospheric Agriculture Gradient Tint & Contrast Balancing Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-950/40 to-slate-950/75 pointer-events-none"
        style={{ transform: 'translateZ(0)' }}
      />
    </div>
  );
});
