'use client';

import * as React from 'react';
import { ActiveEffect } from '@/lib/types/profile';

interface EffectsCanvasProps {
  effect: ActiveEffect;
  intensity?: number;
  crtScanlines?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  fadeSpeed: number;
  angle?: number;
  angularSpeed?: number;
  char?: string;
  glow?: number;
}

export function EffectsCanvas({ effect, intensity = 0.5, crtScanlines = false }: EffectsCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (effect === 'none' && !crtScanlines) return;

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

    const matrixChars = '0123456789ABCDEF$#@*!%+-/<>';
    const baseCount =
      effect === 'lightning'
        ? 1
        : effect === 'cherry_blossoms'
        ? 45
        : effect === 'bubbles'
        ? 35
        : effect === 'fireflies'
        ? 40
        : effect === 'fog'
        ? 20
        : 60;

    const count = Math.max(12, Math.floor(baseCount * intensity));
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx:
          effect === 'cherry_blossoms'
            ? 0.5 + Math.random() * 1.5
            : effect === 'bubbles'
            ? (Math.random() - 0.5) * 0.4
            : effect === 'fireflies'
            ? (Math.random() - 0.5) * 1.2
            : effect === 'fog'
            ? (Math.random() - 0.5) * 0.3
            : effect === 'embers'
            ? (Math.random() - 0.5) * 0.8
            : (Math.random() - 0.5) * 0.4,
        vy:
          effect === 'rain'
            ? 7 + Math.random() * 4
            : effect === 'matrix'
            ? 3 + Math.random() * 5
            : effect === 'cherry_blossoms'
            ? 0.8 + Math.random() * 1.5
            : effect === 'bubbles'
            ? -(0.8 + Math.random() * 1.2)
            : effect === 'embers'
            ? -(1 + Math.random() * 2)
            : effect === 'snow'
            ? 0.8 + Math.random() * 1.5
            : effect === 'fireflies'
            ? (Math.random() - 0.5) * 1.2
            : effect === 'fog'
            ? (Math.random() - 0.5) * 0.2
            : (Math.random() - 0.5) * 0.5,
        size:
          effect === 'rain'
            ? 1
            : effect === 'cherry_blossoms'
            ? Math.random() * 6 + 5
            : effect === 'bubbles'
            ? Math.random() * 12 + 6
            : effect === 'fog'
            ? Math.random() * 180 + 120
            : effect === 'stars'
            ? Math.random() * 2 + 0.5
            : effect === 'fireflies'
            ? Math.random() * 2.5 + 2
            : Math.random() * 3 + 1,
        alpha:
          effect === 'fog'
            ? Math.random() * 0.08 + 0.04
            : Math.random() * 0.7 + 0.3,
        fadeSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.04,
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
        glow: Math.random(),
      });
    }

    // Lightning flash timer
    let lightningFlash = 0;
    let nextLightning = Date.now() + Math.random() * 7000 + 3000;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Lightning storm sky flash effect
      if (effect === 'lightning') {
        const now = Date.now();
        if (now > nextLightning) {
          lightningFlash = 0.45;
          nextLightning = now + Math.random() * 8000 + 4000;
        }

        if (lightningFlash > 0.01) {
          ctx.fillStyle = `rgba(180, 200, 255, ${lightningFlash})`;
          ctx.fillRect(0, 0, width, height);
          lightningFlash *= 0.86;
        }
      }

      // CRT Scanlines pass
      if (crtScanlines || effect === 'crt_lines') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for (let y = 0; y < height; y += 4) {
          ctx.fillRect(0, y, width, 1.5);
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.angularSpeed !== undefined && p.angle !== undefined) {
          p.angle += p.angularSpeed;
        }

        p.alpha += p.fadeSpeed;
        if (p.alpha <= 0.15 || p.alpha >= 0.85) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        // Screen wrap
        if (p.x < -p.size) p.x = width + p.size;
        if (p.x > width + p.size) p.x = -p.size;
        if (p.y < -p.size) p.y = height + p.size;
        if (p.y > height + p.size) p.y = -p.size;

        ctx.save();

        if (effect === 'rain') {
          ctx.strokeStyle = `rgba(165, 165, 255, ${p.alpha * 0.6})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 2, p.y + 12);
          ctx.stroke();
        } else if (effect === 'matrix') {
          ctx.fillStyle = `rgba(78, 254, 89, ${p.alpha * 0.8})`;
          ctx.font = '12px monospace';
          ctx.fillText(p.char || '0', p.x, p.y);
        } else if (effect === 'embers') {
          ctx.fillStyle = `rgba(255, 120, 60, ${p.alpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#ff6030';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (effect === 'cherry_blossoms') {
          // Sakura Petal
          ctx.translate(p.x, p.y);
          if (p.angle !== undefined) ctx.rotate(p.angle);
          ctx.fillStyle = `rgba(255, 182, 193, ${p.alpha * 0.75})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (effect === 'fireflies') {
          // Glowing wandering firefly
          const pulse = (Math.sin(Date.now() * 0.003 + (p.glow || 0) * 10) + 1) / 2;
          ctx.fillStyle = `rgba(230, 255, 120, ${p.alpha * pulse})`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#d4ff59';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (effect === 'bubbles') {
          // Translucent rising bubble
          ctx.strokeStyle = `rgba(200, 230, 255, ${p.alpha * 0.5})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.stroke();
          // Inner shine highlight
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.4})`;
          ctx.beginPath();
          ctx.arc(p.x - p.size * 0.35, p.y - p.size * 0.35, p.size * 0.25, 0, Math.PI * 2);
          ctx.fill();
        } else if (effect === 'fog') {
          // Soft atmospheric haze
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, `rgba(180, 190, 210, ${p.alpha})`);
          grad.addColorStop(1, 'rgba(180, 190, 210, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (effect === 'snow') {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.75})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Stars / generic particles
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.8})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#ffffff';
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
  }, [effect, intensity, crtScanlines]);

  if (effect === 'none' && !crtScanlines) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 h-full w-full opacity-65"
    />
  );
}
