'use client';

import * as React from 'react';
import { CursorEffect } from '@/lib/types/profile';

interface CustomCursorProps {
  effect: CursorEffect;
  accentColor: string;
  customCursorUrl?: string;
}

export function CustomCursor({
  effect,
  accentColor,
  customCursorUrl,
}: CustomCursorProps) {
  const [pos, setPos] = React.useState({ x: -100, y: -100 });
  const [trails, setTrails] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
  const [isPointer, setIsPointer] = React.useState(false);

  React.useEffect(() => {
    if (effect === 'none' && !customCursorUrl) return;

    let trailId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      if (effect === 'trail') {
        const id = trailId++;
        setTrails((prev) => [...prev.slice(-12), { x: e.clientX, y: e.clientY, id }]);
      }

      // Check if hovering clickable element
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON'
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [effect, customCursorUrl]);

  if (effect === 'none' && !customCursorUrl) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Custom Image Cursor */}
      {customCursorUrl && (
        <img
          src={customCursorUrl}
          alt=""
          className="fixed pointer-events-none w-6 h-6 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
        />
      )}

      {/* Ring Cursor */}
      {effect === 'ring' && (
        <div
          className={`fixed pointer-events-none rounded-full border border-accent/80 -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-out ${
            isPointer ? 'w-10 h-10 border-accent bg-accent/20' : 'w-6 h-6'
          }`}
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            borderColor: accentColor,
            boxShadow: `0 0 12px ${accentColor}40`,
          }}
        />
      )}

      {/* Glow Dot Cursor */}
      {effect === 'glow' && (
        <div
          className="fixed pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            width: isPointer ? '14px' : '8px',
            height: isPointer ? '14px' : '8px',
            backgroundColor: accentColor,
            boxShadow: `0 0 16px 4px ${accentColor}`,
          }}
        />
      )}

      {/* Crosshair Cursor */}
      {effect === 'crosshair' && (
        <div
          className="fixed pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
        >
          <div className="w-4 h-[1px] bg-accent -ml-2 -mt-[0.5px]" style={{ backgroundColor: accentColor }} />
          <div className="h-4 w-[1px] bg-accent -mt-2 -ml-[0.5px]" style={{ backgroundColor: accentColor }} />
        </div>
      )}

      {/* Particle Trail */}
      {effect === 'trail' &&
        trails.map((t, index) => (
          <div
            key={t.id}
            className="fixed pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
            style={{
              left: `${t.x}px`,
              top: `${t.y}px`,
              width: `${(index + 2) * 1.5}px`,
              height: `${(index + 2) * 1.5}px`,
              backgroundColor: accentColor,
              opacity: (index + 1) / trails.length * 0.7,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
        ))}
    </div>
  );
}
