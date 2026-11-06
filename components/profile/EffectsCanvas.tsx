'use client';

import * as React from 'react';
import { ActiveEffect } from '@/lib/types/profile';

interface EffectsCanvasProps {
  effect: ActiveEffect;
  intensity?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  fadeSpeed: number;
}

export function EffectsCanvas({ effect, intensity = 0.5 }: EffectsCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (effect === 'none') return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = Math.floor(60 * intensity);
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: effect === 'embers' ? (Math.random() - 0.5) * 0.8 : (Math.random() - 0.5) * 0.4,
        vy:
          effect === 'rain'
            ? 6 + Math.random() * 4
            : effect === 'embers'
            ? -(1 + Math.random() * 2)
            : effect === 'snow'
            ? 0.8 + Math.random() * 1.5
            : (Math.random() - 0.5) * 0.5,
        size:
          effect === 'rain'
            ? 1
            : effect === 'stars'
            ? Math.random() * 2 + 0.5
            : Math.random() * 3 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        fadeSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Twinkle / pulse
        p.alpha += p.fadeSpeed;
        if (p.alpha <= 0.2 || p.alpha >= 0.9) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        // Screen wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        if (effect === 'rain') {
          ctx.strokeStyle = `rgba(165, 165, 255, ${p.alpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + 8);
          ctx.stroke();
        } else if (effect === 'embers') {
          ctx.fillStyle = `rgba(255, 120, 60, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.7})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [effect, intensity]);

  if (effect === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 h-full w-full opacity-60"
    />
  );
}
