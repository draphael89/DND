'use client';

import { useCharacter } from '../../context/CharacterContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useAnimation, useTransform, useMotionValue, useSpring } from 'framer-motion';
import GameButton from '../../components/GameButton';
import { FaUser, FaHatWizard, FaScroll, FaDiceD20, FaInfoCircle, FaChevronDown } from 'react-icons/fa';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { Tooltip } from 'react-tooltip';

const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

const getCharacterImagePath = (race: string, characterClass: string) => {
  return `/images/classes/${race.toLowerCase()}/${characterClass.toLowerCase()}.png`;
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

const CharacterSummary = () => {
  const { character, setCharacterComplete } = useCharacter();
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const [backgroundStory, setBackgroundStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const generateBackstory = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/generate-backstory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            race: character.race,
            characterClass: character.class,
            background: character.background,
            abilities: character.abilities,
          }),
        });
        if (!response.ok) throw new Error('Failed to generate backstory');
        const data = await response.json();
        setBackgroundStory(data.backstory);
      } catch (err) {
        setError('Failed to generate backstory. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (character.race && character.class && character.background && character.abilities) {
      generateBackstory();
    }
  }, [character]);

  const handleStartAdventure = () => {
    setCharacterComplete(true);
    router.push('/game');
  };

  if (!character.race || !character.class || !character.background || !character.abilities) {
    return <div>Loading character data...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen text-text-primary relative overflow-hidden"
    >
      <StarryBackground />
      <div className="relative z-10">
        <div className="h-screen flex flex-col justify-center items-center text-center p-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
            className="mb-8"
          >
            <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-accent-400 shadow-lg">
              <Image
                src={getCharacterImagePath(character.race, character.class)}
                alt="Character Portrait"
                layout="fill"
                objectFit="cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/classes/default.png';
                }}
              />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl font-display mb-4 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] animate-pulse"
          >
            {character.race} {character.class}
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-2xl font-display text-accent-400 mb-8"
          >
            {character.background}
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
          >
            <GameButton onClick={() => setShowDetails(!showDetails)} className="text-xl py-3 px-8">
              {showDetails ? 'Hide Details' : 'Show Character Details'}
            </GameButton>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <FaChevronDown className="text-4xl text-accent-400 animate-bounce" />
        </motion.div>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-primary-800/90 backdrop-blur-md relative z-20"
          >
            <div className="max-w-7xl mx-auto px-4 py-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <div className="relative aspect-square mb-4 rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src={getCharacterImagePath(character.race, character.class)}
                      alt="Character Portrait"
                      layout="fill"
                      objectFit="cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/classes/default.png';
                      }}
                    />
                  </div>
                  <h2 className="text-2xl font-display text-accent-400 mb-2">Character Traits</h2>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FaUser className="text-accent-500 mr-2" />
                      <p><span className="font-display text-text-secondary">Race:</span> {character.race}</p>
                    </div>
                    <div className="flex items-center">
                      <FaHatWizard className="text-accent-500 mr-2" />
                      <p><span className="font-display text-text-secondary">Class:</span> {character.class}</p>
                    </div>
                    <div className="flex items-center">
                      <FaScroll className="text-accent-500 mr-2" />
                      <p><span className="font-display text-text-secondary">Background:</span> {character.background}</p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h2 className="text-3xl font-display text-accent-400 mb-6">Ability Scores</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                    {Object.entries(character.abilities).map(([ability, score]) => (
                      <motion.div 
                        key={ability}
                        className="text-center bg-primary-700/50 rounded-lg p-4 shadow-md border border-accent-500/30"
                        whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,165,0,0.3)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      >
                        <p className="font-display text-accent-300 capitalize text-lg">{ability}</p>
                        <p className="text-4xl font-bold text-accent-400 my-2">{score}</p>
                        <p className="text-sm text-text-secondary">Modifier: {calculateModifier(score)}</p>
                      </motion.div>
                    ))}
                  </div>
                  <h3 className="text-2xl font-display text-accent-400 mb-4">Background Story</h3>
                  {isLoading ? (
                    <p>Generating your unique backstory...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <p className="text-text-secondary mb-6 leading-relaxed">{backgroundStory}</p>
                  )}
                  <GameButton onClick={handleStartAdventure} className="text-xl py-3 px-8 w-full">
                    Embark on Your Quest
                  </GameButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CharacterSummary;