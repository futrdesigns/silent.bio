'use client';

import * as React from 'react';
import { BgType } from '@/lib/types/profile';

interface BackgroundLayerProps {
  bgType: BgType;
  bgValue: string;
  bgBlur?: number;
  bgDim?: number;
}

export function BackgroundLayer({
  bgType,
  bgValue,
  bgBlur = 0,
  bgDim = 0,
}: BackgroundLayerProps) {
  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
      {/* Dynamic Background Surface */}
      {bgType === 'solid' && (
        <div
          className="absolute inset-0 transition-colors duration-300"
          style={{ backgroundColor: bgValue || '#08090B' }}
        />
      )}

      {bgType === 'gradient' && (
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{ backgroundImage: bgValue }}
        />
      )}

      {bgType === 'mesh' && (
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{ backgroundImage: bgValue }}
        />
      )}

      {bgType === 'image' && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
          style={{
            backgroundImage: `url(${bgValue})`,
            filter: bgBlur > 0 ? `blur(${bgBlur}px)` : 'none',
          }}
        />
      )}

      {bgType === 'video' && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            filter: bgBlur > 0 ? `blur(${bgBlur}px)` : 'none',
          }}
        >
          <source src={bgValue} type="video/mp4" />
        </video>
      )}

      {/* Dim Overlay */}
      {bgDim > 0 && (
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: bgDim / 100 }}
        />
      )}
    </div>
  );
}
