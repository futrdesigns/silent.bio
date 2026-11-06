'use client';

import * as React from 'react';

interface TiltContainerProps {
  children: React.ReactNode;
  enabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function TiltContainer({
  children,
  enabled = true,
  className = '',
  style = {},
}: TiltContainerProps) {
  const [transform, setTransform] = React.useState('');
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg tilt
    const rotateY = ((x - centerX) / centerX) * 5;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    if (!enabled) return;
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{
        ...style,
        transform: enabled && transform ? transform : undefined,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
}
