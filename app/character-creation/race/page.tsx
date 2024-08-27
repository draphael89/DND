'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import GameButton from '../../components/GameButton';

const races = [
  {
    name: 'Human',
    description: 'Versatile and ambitious, humans are the most common race in many D&D worlds.',
    traits: ['Bonus feat', '+1 to all ability scores'],
    image: '/images/races/human.png'
  },
  {
    name: 'Elf',
    description: 'Graceful and long-lived, elves are known for their connection to nature and arcane magic.',
    traits: ['Darkvision', 'Keen Senses', 'Fey Ancestry'],
    image: '/images/races/elf.png'
  },
  {
    name: 'Dwarf',
    description: 'Stout and sturdy, dwarves are known for their craftsmanship and resilience.',
    traits: ['Darkvision', 'Dwarven Resilience', 'Stonecunning'],
    image: '/images/races/dwarf.png'
  },
  {
    name: 'Halfling',
    description: 'Small but brave, halflings are known for their luck and nimbleness.',
    traits: ['Lucky', 'Brave', 'Halfling Nimbleness'],
    image: '/images/races/halfling.png'
  },
  {
    name: 'Dragonborn',
    description: 'Descended from dragons, dragonborn are proud and noble warriors.',
    traits: ['Breath Weapon', 'Damage Resistance', 'Draconic Ancestry'],
    image: '/images/races/dragonborn.png'
  }
];

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

export default function RaceSelection() {
  const { updateCharacter } = useCharacter();
  const [selectedRace, setSelectedRace] = useState<string | null>(null);

  const handleRaceSelect = (raceName: string) => {
    setSelectedRace(raceName);
    updateCharacter({ race: raceName });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen text-text-primary relative overflow-hidden"
    >
      <StarryBackground />
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto px-4 py-8"
      >
        <h1 className="text-5xl font-display text-center mb-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] animate-pulse">
          Choose Your Race
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {races.map((race, index) => (
            <motion.div
              key={race.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-primary-800/50 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                selectedRace === race.name ? 'ring-2 ring-accent-500' : ''
              }`}
              onClick={() => handleRaceSelect(race.name)}
            >
              <div className="relative h-48">
                <Image
                  src={race.image}
                  alt={race.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/races/default.png';
                    console.log(`Error loading image, fallback to default: ${target.src}`);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900 to-transparent" />
                <h2 className="absolute bottom-4 left-4 text-2xl font-display text-text-primary">{race.name}</h2>
              </div>
              <div className="p-4">
                <p className="text-text-secondary mb-4">{race.description}</p>
                <h3 className="font-display text-accent-400 mb-2">Racial Traits:</h3>
                <ul className="list-disc list-inside text-sm text-text-secondary">
                  {race.traits.map((trait, index) => (
                    <li key={index}>{trait}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <GameButton 
            href="/character-creation/class" 
            disabled={!selectedRace}
          >
            Continue to Class Selection
          </GameButton>
        </div>
      </motion.div>
    </motion.div>
  );
}