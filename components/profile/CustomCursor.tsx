'use client';

import * as React from 'react';
import { CursorEffect, CursorTrailType, ClickEffectType } from '@/lib/types/profile';

interface CustomCursorProps {
  effect: CursorEffect;
  accentColor: string;
  customCursorUrl?: string;
  cursorTrail?: CursorTrailType;
  clickEffect?: ClickEffectType;
}

interface TrailItem {
  id: number;
  x: number;
  y: number;
  opacity: number;
  size: number;
  color?: string;
}

interface ClickBurstItem {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation?: number;
  type: ClickEffectType;
}

export function CustomCursor({
  effect = 'none',
  accentColor = '#A5A5FF',
  customCursorUrl,
  cursorTrail = 'none',
  clickEffect = 'ripple',
}: CustomCursorProps) {
  const [pos, setPos] = React.useState({ x: -100, y: -100 });
  const [trails, setTrails] = React.useState<TrailItem[]>([]);
  const [clickBursts, setClickBursts] = React.useState<ClickBurstItem[]>([]);
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isPointer, setIsPointer] = React.useState(false);
  const [isMouseDown, setIsMouseDown] = React.useState(false);

  // Mouse move handler
  React.useEffect(() => {
    if (effect === 'none' && !customCursorUrl && cursorTrail === 'none' && clickEffect === 'none') {
      return;
    }

    let trailCounter = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Add to trail if enabled
      if (cursorTrail !== 'none') {
        const id = trailCounter++;
        setTrails((prev) => [
          ...prev.slice(-14),
          {
            id,
            x: e.clientX,
            y: e.clientY,
            opacity: 0.8,
            size: cursorTrail === 'hearts' ? 12 : cursorTrail === 'sparkles' ? 8 : 6,
          },
        ]);
      }

      // Check if hovering clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const computed = window.getComputedStyle(target);
        setIsPointer(
          computed.cursor === 'pointer' ||
            target.tagName === 'A' ||
            target.tagName === 'BUTTON' ||
            Boolean(target.closest('button')) ||
            Boolean(target.closest('a'))
        );
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [effect, customCursorUrl, cursorTrail, clickEffect]);

  // Click burst & ripple handler
  React.useEffect(() => {
    if (!clickEffect || clickEffect === 'none') return;

    let burstId = 0;

    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      if (clickEffect === 'ripple' || clickEffect === 'shockwave') {
        const rId = burstId++;
        setRipples((prev) => [...prev, { id: rId, x: clickX, y: clickY }]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== rId));
        }, 700);
      } else {
        // Particle burst (sparks, hearts, cherry blossoms)
        const count = clickEffect === 'spark_burst' ? 16 : 8;
        const newParticles: ClickBurstItem[] = [];

        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
          const speed = Math.random() * 4 + 2;
          newParticles.push({
            id: burstId++,
            x: clickX,
            y: clickY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: clickEffect === 'heart_explode' ? 14 : clickEffect === 'cherry_blossom' ? 10 : 4,
            color:
              clickEffect === 'heart_explode'
                ? '#ff3366'
                : clickEffect === 'cherry_blossom'
                ? '#ffb6c1'
                : accentColor,
            alpha: 1,
            rotation: Math.random() * 360,
            type: clickEffect,
          });
        }

        setClickBursts((prev) => [...prev, ...newParticles]);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [clickEffect, accentColor]);

  // Animation frame for particles and trails fade
  React.useEffect(() => {
    if (clickBursts.length === 0 && trails.length === 0) return;

    const timer = setInterval(() => {
      // Fade trails
      setTrails((prev) =>
        prev
          .map((t) => ({ ...t, opacity: t.opacity - 0.08, size: Math.max(2, t.size * 0.94) }))
          .filter((t) => t.opacity > 0.05)
      );

      // Animate burst particles
      setClickBursts((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15, // gravity
            alpha: p.alpha - 0.04,
            rotation: (p.rotation || 0) + 5,
          }))
          .filter((p) => p.alpha > 0.05)
      );
    }, 20);

    return () => clearInterval(timer);
  }, [clickBursts.length, trails.length]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Click Ripples */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="fixed pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
            width: clickEffect === 'shockwave' ? '90px' : '50px',
            height: clickEffect === 'shockwave' ? '90px' : '50px',
            border: `2px solid ${accentColor}`,
            boxShadow: `0 0 20px ${accentColor}`,
          }}
        />
      ))}

      {/* Click Burst Particles */}
      {clickBursts.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none -translate-x-1/2 -translate-y-1/2 select-none"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            opacity: p.alpha,
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
          }}
        >
          {p.type === 'heart_explode' ? (
            <span style={{ fontSize: `${p.size}px`, color: p.color }}>❤️</span>
          ) : p.type === 'cherry_blossom' ? (
            <span style={{ fontSize: `${p.size}px`, color: p.color }}>🌸</span>
          ) : (
            <div
              className="rounded-full"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                boxShadow: `0 0 8px ${p.color}`,
              }}
            />
          )}
        </div>
      ))}

      {/* Cursor Trails */}
      {cursorTrail !== 'none' &&
        trails.map((t, idx) => (
          <div
            key={t.id}
            className="fixed pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${t.x}px`,
              top: `${t.y}px`,
              opacity: t.opacity,
            }}
          >
            {cursorTrail === 'hearts' ? (
              <span style={{ fontSize: `${t.size}px`, color: '#ff4d6d' }}>♥</span>
            ) : cursorTrail === 'sparkles' ? (
              <span style={{ fontSize: `${t.size}px`, color: accentColor }}>✦</span>
            ) : cursorTrail === 'fire' ? (
              <div
                className="rounded-full"
                style={{
                  width: `${t.size}px`,
                  height: `${t.size}px`,
                  backgroundColor: idx % 2 === 0 ? '#ff4500' : '#ffb703',
                  boxShadow: '0 0 10px #ff4500',
                }}
              />
            ) : (
              <div
                className="rounded-full"
                style={{
                  width: `${t.size}px`,
                  height: `${t.size}px`,
                  backgroundColor: accentColor,
                  boxShadow: `0 0 8px ${accentColor}`,
                }}
              />
            )}
          </div>
        ))}

      {/* Custom Image / Uploaded Cursor */}
      {customCursorUrl && (
        <img
          src={customCursorUrl}
          alt=""
          className={`fixed pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ${
            isMouseDown ? 'scale-90' : isPointer ? 'scale-110' : 'scale-100'
          }`}
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            width: '28px',
            height: '28px',
            objectFit: 'contain',
            filter: `drop-shadow(0 0 6px ${accentColor}80)`,
          }}
        />
      )}

      {/* Sword Cursor Preset */}
      {effect === 'sword' && !customCursorUrl && (
        <div
          className={`fixed pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ${
            isMouseDown ? 'rotate-12 scale-90' : isPointer ? 'scale-125' : 'scale-100'
          }`}
          style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
            <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
            <path d="m13 19 6-6" />
            <path d="m16 16 4 4" />
            <path d="m19 21 2-2" />
          </svg>
        </div>
      )}

      {/* Heart Cursor Preset */}
      {effect === 'heart' && !customCursorUrl && (
        <div
          className={`fixed pointer-events-none -translate-x-1/2 -translate-y-1/2 text-xl transition-transform duration-75 ${
            isMouseDown ? 'scale-75' : isPointer ? 'scale-125' : 'scale-100'
          }`}
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            filter: `drop-shadow(0 0 8px ${accentColor})`,
          }}
        >
          💖
        </div>
      )}

      {/* Star Cursor Preset */}
      {effect === 'star' && !customCursorUrl && (
        <div
          className={`fixed pointer-events-none -translate-x-1/2 -translate-y-1/2 text-lg transition-transform duration-75 ${
            isMouseDown ? 'rotate-45 scale-75' : isPointer ? 'scale-125 rotate-12' : 'scale-100'
          }`}
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            color: accentColor,
            filter: `drop-shadow(0 0 8px ${accentColor})`,
          }}
        >
          ✦
        </div>
      )}

      {/* Wand Cursor Preset */}
      {effect === 'wand' && !customCursorUrl && (
        <div
          className={`fixed pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ${
            isMouseDown ? 'scale-90 rotate-6' : isPointer ? 'scale-115' : 'scale-100'
          }`}
          style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
            <path d="m15 4-2 2" />
            <path d="m15 9-2-2" />
            <path d="M17.8 11.8 19 13" />
            <path d="m3 21 9-9" />
            <path d="M12.2 6.2 11 5" />
          </svg>
        </div>
      )}

      {/* Aesthetic Ring Indicator */}
      {effect === 'ring' && !customCursorUrl && (
        <div
          className={`fixed pointer-events-none rounded-full border -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ease-out ${
            isMouseDown
              ? 'w-4 h-4 bg-accent/40'
              : isPointer
              ? 'w-10 h-10 border-accent bg-accent/20'
              : 'w-6 h-6'
          }`}
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            borderColor: accentColor,
            boxShadow: `0 0 14px ${accentColor}50`,
          }}
        />
      )}

      {/* Neon Glow Dot Cursor */}
      {effect === 'glow' && !customCursorUrl && (
        <div
          className="fixed pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            width: isMouseDown ? '6px' : isPointer ? '14px' : '8px',
            height: isMouseDown ? '6px' : isPointer ? '14px' : '8px',
            backgroundColor: accentColor,
            boxShadow: `0 0 16px 4px ${accentColor}`,
          }}
        />
      )}

      {/* Crosshair Cursor */}
      {effect === 'crosshair' && !customCursorUrl && (
        <div
          className="fixed pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
        >
          <div className="w-5 h-[1.5px] -ml-2.5 -mt-[0.75px]" style={{ backgroundColor: accentColor }} />
          <div className="h-5 w-[1.5px] -mt-2.5 -ml-[0.75px]" style={{ backgroundColor: accentColor }} />
          <div
            className="w-2 h-2 rounded-full border -ml-1 -mt-1"
            style={{ borderColor: accentColor }}
          />
        </div>
      )}

      {/* Dot Cursor */}
      {effect === 'dot' && !customCursorUrl && (
        <div
          className="fixed pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            width: isPointer ? '8px' : '5px',
            height: isPointer ? '8px' : '5px',
            backgroundColor: accentColor,
          }}
        />
      )}
    </div>
  );
}
