'use client';

import { useRouter } from 'next/navigation';
import { motion, LazyMotion, domAnimation, useAnimation, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import GameButton from './GameButton';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { FaDiceD20 } from 'react-icons/fa';

const backgroundVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 2 } },
};

const titleVariants = {
  initial: { opacity: 0, y: -50 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      delay: 0.5, 
      duration: 1.2, 
      type: 'spring',
      stiffness: 100,
      damping: 10
    } 
  }
};

const subtitleVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      delay: 0.8, 
      duration: 1, 
      ease: "easeOut" 
    } 
  }
};

const buttonVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { delay: 1.1, duration: 0.5 } },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

const FloatingParticle = ({ delay = 0 }) => (
  <motion.div
    className="absolute w-1 h-1 bg-white rounded-full opacity-70"
    initial={{ 
      y: Math.random() * 100 + '%', 
      x: Math.random() * 100 + '%' 
    }}
    animate={{
      y: [
        Math.random() * 100 + '%',
        Math.random() * 100 + '%',
        Math.random() * 100 + '%',
        Math.random() * 100 + '%'
      ],
      x: [
        Math.random() * 100 + '%',
        Math.random() * 100 + '%',
        Math.random() * 100 + '%',
        Math.random() * 100 + '%'
      ],
    }}
    transition={{
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 20 + Math.random() * 10,
      delay: delay,
      ease: "easeInOut",
    }}
  />
);

const AnimatedWord = ({ text }: { text: string }) => (
  <motion.span
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: Math.random() * 0.5 }}
    className="inline-block"
  >
    {text}
  </motion.span>
);

interface Star {
  id: number;
  x: string;
  y: string;
  size: number;
  opacity: number;
  blinkDuration: number;
}

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

export default function MainMenu() {
  const router = useRouter();
  const controls = useAnimation();
  const [sequence, setSequence] = useState({ cardExpanded: false, titleVisible: false, subtitleVisible: false, ctaVisible: false });

  const startSequence = useCallback(async () => {
    await controls.start({
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut" }
    });
    setSequence(prev => ({ ...prev, cardExpanded: true }));
    await new Promise(resolve => setTimeout(resolve, 500));
    setSequence(prev => ({ ...prev, titleVisible: true }));
    await new Promise(resolve => setTimeout(resolve, 500));
    setSequence(prev => ({ ...prev, subtitleVisible: true }));
    await new Promise(resolve => setTimeout(resolve, 500));
    setSequence(prev => ({ ...prev, ctaVisible: true }));
  }, [controls]);

  useEffect(() => {
    startSequence();
  }, [startSequence]);

  return (
    <LazyMotion features={domAnimation}>
      <motion.div
        className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
        initial="initial"
        animate="animate"
        variants={backgroundVariants}
      >
        <StarryBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-900/50 to-primary-900/80" />
        <div className="absolute inset-0 bg-fantasy-overlay opacity-30" />
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-transparent to-primary-900/60 opacity-40"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 0.1} />
          ))}
        </div>
        <AnimatePresence>
          {sequence.cardExpanded && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
              }}
              className="flex flex-col items-center w-full max-w-4xl px-4 z-10"
            >
              <motion.h1 
                className="text-6xl sm:text-7xl md:text-8xl font-display mb-6 text-white tracking-wide leading-tight text-center text-shadow-glow"
                variants={titleVariants}
                initial="initial"
                animate={sequence.titleVisible ? "animate" : "initial"}
              >
                <AnimatedWord text="D&D" />
                {' '}
                <AnimatedWord text="Web" />
                {' '}
                <AnimatedWord text="Adventure" />
              </motion.h1>
              <motion.p 
                className="text-xl sm:text-2xl md:text-3xl mb-12 text-white max-w-2xl text-center font-semibold text-shadow-subtle"
                variants={subtitleVariants}
                initial="initial"
                animate={sequence.subtitleVisible ? "animate" : "initial"}
              >
                Embark on an epic journey through realms of magic and mystery. Your adventure awaits!
              </motion.p>
              <motion.div
                variants={buttonVariants}
                initial="initial"
                animate={sequence.ctaVisible ? "animate" : "initial"}
                whileHover="hover"
                whileTap="tap"
                className="group relative"
              >
                <GameButton
                  onClick={() => router.push('/character-creation/race')}
                  className="relative px-10 py-4 text-xl shadow-button-glow"
                  icon={<FaDiceD20 className="text-2xl ml-2" />}
                >
                  Start Your Quest
                </GameButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.footer
          className="absolute bottom-4 text-sm text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          Version 1.0 | © 2023 D&D Web Adventure
        </motion.footer>
      </motion.div>
    </LazyMotion>
  );
}