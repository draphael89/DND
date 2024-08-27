'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import GameButton from '../../components/GameButton';
import { FaShieldAlt, FaHatWizard, FaSkull, FaPray, FaLeaf } from 'react-icons/fa';

const classes = [
  {
    name: 'Warrior',
    description: 'Masters of martial combat, skilled with a variety of weapons and armor.',
    features: ['Second Wind', 'Action Surge', 'Martial Archetype'],
    icon: FaShieldAlt,
    imageName: 'warrior'
  },
  {
    name: 'Wizard',
    description: 'Scholarly magic-users capable of manipulating the structures of reality.',
    features: ['Arcane Recovery', 'Spellcasting', 'Arcane Tradition'],
    icon: FaHatWizard,
    imageName: 'wizard'
  },
  {
    name: 'Rogue',
    description: 'Skilled tricksters and agile combatants who prefer stealth and cunning.',
    features: ['Sneak Attack', 'Cunning Action', 'Roguish Archetype'],
    icon: FaSkull,
    imageName: 'rogue'
  },
  {
    name: 'Cleric',
    description: 'Divine agents who wield the power of the gods and lead through inspiration.',
    features: ['Divine Domain', 'Channel Divinity', 'Turn Undead'],
    icon: FaPray,
    imageName: 'cleric'
  },
  {
    name: 'Ranger',
    description: 'Skilled hunters and trackers who specialize in wilderness survival.',
    features: ['Favored Enemy', 'Natural Explorer', 'Ranger Archetype'],
    icon: FaLeaf,
    imageName: 'ranger'
  }
];

const preloadImages = async (race: string) => {
  const images: Record<string, string> = {};
  for (const characterClass of classes) {
    let imageName = characterClass.imageName;
    if (race.toLowerCase() === 'halfling' && imageName === 'cleric') {
      imageName = 'priest';
    }
    const imagePath = `/images/classes/${race.toLowerCase()}/${imageName}.png`;
    
    try {
      const res = await fetch(imagePath);
      if (res.ok) {
        images[characterClass.name] = imagePath;
      } else {
        throw new Error(`Image not found: ${imagePath}`);
      }
    } catch (error) {
      console.warn(`Image not found: ${imagePath}, using default`);
      images[characterClass.name] = '/images/classes/default.png';
    }
  }
  return images;
};

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

export default function ClassSelection() {
  const { character, updateCharacter } = useCharacter();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [classImages, setClassImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      if (character.race) {
        setIsLoading(true);
        const loadedImages = await preloadImages(character.race);
        setClassImages(loadedImages);
        setIsLoading(false);
      }
    };

    loadImages();
  }, [character.race]);

  const handleClassSelect = (className: string) => {
    setSelectedClass(className);
    updateCharacter({ class: className });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-accent-400"></div>
      </div>
    );
  }

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
          Choose Your Class
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((characterClass, index) => (
            <motion.div
              key={characterClass.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-primary-800/50 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                selectedClass === characterClass.name ? 'ring-2 ring-accent-500' : ''
              }`}
              onClick={() => handleClassSelect(characterClass.name)}
            >
              <div className="relative h-48">
                <Image
                  src={classImages[characterClass.name] || '/images/classes/default.png'}
                  alt={characterClass.name}
                  fill
                  priority
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/classes/default.png';
                    console.error(`Error loading image, fallback to default: ${target.src}`);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900 to-transparent" />
                <h2 className="absolute bottom-4 left-4 text-2xl font-display text-text-primary flex items-center">
                  <characterClass.icon className="mr-2" />
                  {characterClass.name}
                </h2>
              </div>
              <div className="p-4">
                <p className="text-text-secondary mb-4">{characterClass.description}</p>
                <h3 className="font-display text-accent-400 mb-2">Key Features:</h3>
                <ul className="list-disc list-inside text-sm text-text-secondary">
                  {characterClass.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <GameButton 
            href="/character-creation/background" 
            disabled={!selectedClass}
          >
            Continue to Background Selection
          </GameButton>
        </div>
      </motion.div>
    </motion.div>
  );
}