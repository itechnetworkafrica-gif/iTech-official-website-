import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  className?: string;
}

/**
 * Reusable floating particle field — sprinkles subtle animated dots
 * across any dark section for a premium spatial feel.
 */
export function FloatingParticles({
  count = 20,
  color = '#3CB52A',
  className = '',
}: FloatingParticlesProps) {
  const particles: Particle[] = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (i * 173 + 17) % 97,
        y: (i * 137 + 29) % 93,
        size: 1.5 + ((i * 7) % 3),
        duration: 6 + ((i * 3) % 10),
        delay: (i * 0.4) % 6,
        opacity: 0.15 + ((i * 11) % 30) / 100,
      })),
    [count]
  );

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: color,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -18 - (p.id % 4) * 6, 0],
            opacity: [p.opacity, p.opacity * 2.5, p.opacity],
            scale: [1, 1.4 + (p.id % 3) * 0.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
