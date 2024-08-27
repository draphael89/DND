'use client';

import React, { useMemo, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface Star {
  id: number;
  x: string;
  y: string;
  size: number;
  opacity: number;
  blinkDuration: number;
}

const Star: React.FC<{ star: Star }> = ({ star }) => {
  const blinkOpacity = useMotionValue(star.opacity);
  const opacity = useTransform(
    blinkOpacity,
    [star.opacity * 0.3, star.opacity],
    [star.opacity * 0.3, star.opacity]
  );

  useEffect(() => {
    blinkOpacity.set(star.opacity * 0.3);
  }, [blinkOpacity, star.opacity]);

  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        top: star.y,
        left: star.x,
        width: star.size,
        height: star.size,
        opacity,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [star.opacity, star.opacity * 0.3, star.opacity],
      }}
      transition={{
        duration: star.blinkDuration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    />
  );
};

const StarryBackground: React.FC = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      blinkDuration: Math.random() * 4 + 2,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-black" />
      {stars.map((star) => (
        <Star key={star.id} star={star} />
      ))}
    </div>
  );
};

export default StarryBackground;