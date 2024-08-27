'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import GameButton from '../../components/GameButton';
import { FaDiceD20, FaInfoCircle, FaArrowUp, FaArrowDown, FaRedo, FaRandom } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { useRouter } from 'next/navigation'; // Add this line to import the router

const abilityNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const;
type AbilityName = typeof abilityNames[number];

type AbilityScores = {
  [key in AbilityName]: number;
};

const pointCosts = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

const abilityDescriptions: Record<AbilityName, string> = {
  strength: "Physical power and athletic training",
  dexterity: "Agility, reflexes, and balance",
  constitution: "Health, stamina, and vital force",
  intelligence: "Mental acuity, information recall, analytical skill",
  wisdom: "Awareness, intuition, and insight",
  charisma: "Force of personality, persuasiveness, leadership"
};

const famousCharacters: Record<AbilityName, string> = {
  strength: "Hercules, known for his incredible strength and heroic feats",
  dexterity: "Robin Hood, renowned for his archery skills and agility",
  constitution: "Wolverine, famous for his endurance and healing abilities",
  intelligence: "Sherlock Holmes, celebrated for his keen intellect and deductive reasoning",
  wisdom: "Gandalf, respected for his deep insight and magical knowledge",
  charisma: "King Arthur, admired for his leadership and ability to inspire others"
};

const getRacialBonuses = (race: string): Partial<AbilityScores> => {
  const bonuses: Record<string, Partial<AbilityScores>> = {
    Human: { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
    Elf: { dexterity: 2, intelligence: 1 },
    Dwarf: { constitution: 2, wisdom: 1 },
    Halfling: { dexterity: 2, charisma: 1 },
    Dragonborn: { strength: 2, charisma: 1 },
  };
  return bonuses[race] || {};
};

const getAbilityScoreSuggestions = (characterClass: string, race: string): AbilityScores => {
  const baseSuggestions = {
    Warrior: { strength: 15, constitution: 14, dexterity: 13, wisdom: 12, charisma: 10, intelligence: 8 },
    Wizard: { intelligence: 15, wisdom: 14, constitution: 13, dexterity: 12, charisma: 10, strength: 8 },
    Rogue: { dexterity: 15, charisma: 14, intelligence: 13, wisdom: 12, constitution: 10, strength: 8 },
    Cleric: { wisdom: 15, charisma: 14, constitution: 13, strength: 12, intelligence: 10, dexterity: 8 },
    Ranger: { dexterity: 15, wisdom: 14, constitution: 13, intelligence: 12, strength: 10, charisma: 8 },
  };

  const baseScores = baseSuggestions[characterClass as keyof typeof baseSuggestions] || {
    strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10
  };

  const racialBonuses = getRacialBonuses(race);

  return Object.fromEntries(
    Object.entries(baseScores).map(([ability, score]) => [
      ability,
      Math.min(15, score + (racialBonuses[ability as AbilityName] || 0))
    ])
  ) as AbilityScores;
};

type AbilityCardProps = {
  ability: AbilityName;
  value: number;
  onChange: (ability: AbilityName, value: number) => void;
  suggestion: number | undefined;
  description: string;
  famousCharacter: string;
  racialBonus: number;
};

const AbilityCard: React.FC<AbilityCardProps> = ({ ability, value, onChange, suggestion, description, famousCharacter, racialBonus }) => {
  return (
    <motion.div 
      className="bg-primary-800/80 rounded-lg p-6 relative shadow-lg backdrop-blur-sm border border-accent-500/30"
      whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(255,255,255,0.2)" }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <div className="flex justify-between items-center mb-4">
        <label htmlFor={ability} className="text-2xl font-display text-accent-300 capitalize">
          {ability}
        </label>
        <div className="text-4xl font-bold text-accent-400">
          {value}
          {racialBonus > 0 && <span className="text-green-400 text-2xl ml-2">+{racialBonus}</span>}
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => onChange(ability, Math.max(8, value - 1))}
          className="text-accent-500 hover:text-accent-400 p-2 rounded-full bg-primary-700/50 hover:bg-primary-700/70 transition-all transform hover:scale-110"
          disabled={value <= 8}
        >
          <FaArrowDown />
        </button>
        <div className="w-full mx-4 h-2 bg-primary-600 rounded-full">
          <div 
            className="h-full bg-accent-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((value - 8) / 7) * 100}%` }}
          ></div>
        </div>
        <button 
          onClick={() => onChange(ability, Math.min(15, value + 1))}
          className="text-accent-500 hover:text-accent-400 p-2 rounded-full bg-primary-700/50 hover:bg-primary-700/70 transition-all transform hover:scale-110"
          disabled={value >= 15}
        >
          <FaArrowUp />
        </button>
      </div>
      {suggestion && (
        <div className="mt-2 text-sm text-accent-300 text-center">
          Suggested: {suggestion}
        </div>
      )}
      <div className="mt-4 text-sm text-text-secondary flex items-center justify-center">
        <Tooltip id={`tooltip-${ability}`} place="bottom">
          <p>{description}</p>
          <p className="mt-2 font-semibold">Example: {famousCharacter}</p>
        </Tooltip>
        <FaInfoCircle 
          data-tooltip-id={`tooltip-${ability}`}
          className="text-accent-400 cursor-pointer text-xl hover:text-accent-300 transition-colors ml-2"
        />
      </div>
    </motion.div>
  );
};

type CharacterPreviewProps = {
  abilities: AbilityScores;
  suggestions: AbilityScores;
  racialBonuses: Partial<AbilityScores>;
};

const CharacterPreview: React.FC<CharacterPreviewProps> = ({ abilities, suggestions, racialBonuses }) => {
  const { character } = useCharacter();

  return (
    <div className="bg-surface/80 rounded-lg p-6 shadow-lg backdrop-blur-sm sticky top-8">
      <h2 className="text-3xl font-display text-accent-300 mb-4">Character Preview</h2>
      <div className="grid grid-cols-2 gap-4">
        {abilityNames.map((ability) => (
          <div key={ability} className="flex items-center justify-between">
            <span className="capitalize text-text-secondary">{ability}</span>
            <span className="text-xl font-bold text-text-primary">
              {abilities[ability] + (racialBonuses[ability] || 0)}
              {abilities[ability] !== suggestions[ability] && (
                <span className={abilities[ability] > suggestions[ability] ? "text-green-500" : "text-red-500"}>
                  {abilities[ability] > suggestions[ability] ? "↑" : "↓"}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
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

export default function AbilitiesPage() {
  const { character, updateCharacter } = useCharacter();
  const router = useRouter(); // Add this line to import the router
  const [abilities, setAbilities] = useState<AbilityScores>({
    strength: 8, dexterity: 8, constitution: 8, intelligence: 8, wisdom: 8, charisma: 8
  });
  const [pointsRemaining, setPointsRemaining] = useState(27);
  const suggestions = useMemo(() => getAbilityScoreSuggestions(character.class, character.race), [character.class, character.race]);
  const racialBonuses = useMemo(() => getRacialBonuses(character.race), [character.race]);

  useEffect(() => {
    const initialAbilities: AbilityScores = {
      strength: 8, dexterity: 8, constitution: 8, intelligence: 8, wisdom: 8, charisma: 8
    };
    setAbilities(initialAbilities);
    setPointsRemaining(27);
  }, [character.race, character.class]);

  const handleChange = useCallback((ability: AbilityName, value: number) => {
    const oldValue = abilities[ability];
    const oldCost = pointCosts[oldValue as keyof typeof pointCosts] || 0;
    const newCost = pointCosts[value as keyof typeof pointCosts] || 0;
    const pointDifference = newCost - oldCost;

    if (pointsRemaining - pointDifference >= 0 && value >= 8 && value <= 15) {
      setAbilities(prev => ({ ...prev, [ability]: value }));
      setPointsRemaining(prev => prev - pointDifference);
    }
  }, [abilities, pointsRemaining]);

  const handleSubmit = useCallback(() => {
    const finalAbilities = Object.fromEntries(
      Object.entries(abilities).map(([ability, score]) => [
        ability,
        score + (racialBonuses[ability as AbilityName] || 0)
      ])
    ) as AbilityScores;
    updateCharacter({ abilities: finalAbilities });
    router.push('/character-creation/summary'); // Add this line to navigate to the summary page
  }, [updateCharacter, abilities, racialBonuses, router]);

  const handleReset = useCallback(() => {
    const resetAbilities: AbilityScores = {
      strength: 8, dexterity: 8, constitution: 8, intelligence: 8, wisdom: 8, charisma: 8
    };
    setAbilities(resetAbilities);
    setPointsRemaining(27);
  }, []);

  const handleRandom = useCallback(() => {
    const randomAbilities: AbilityScores = {} as AbilityScores;
    let remainingPoints = 27;

    abilityNames.forEach((ability) => {
      const minScore = 8;
      const maxScore = Math.min(15, minScore + Math.floor(remainingPoints / 2));
      const score = Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;
      randomAbilities[ability] = score;
      remainingPoints -= pointCosts[score as keyof typeof pointCosts] || 0;
    });

    setAbilities(randomAbilities);
    setPointsRemaining(remainingPoints);
  }, []);

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
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto px-4 py-8"
      >
        <h1 className="text-5xl font-display text-center mb-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] animate-pulse">
          Set Your Ability Scores
        </h1>
        <p className="text-center mb-8 text-text-secondary">
          Allocate your ability scores using the point-buy system. You have {pointsRemaining} points remaining.
          Your racial bonuses will be applied automatically.
        </p>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <motion.div 
              className="bg-primary-800/70 rounded-lg p-8 mb-8 shadow-xl backdrop-blur-sm border border-accent-500/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <p className="text-2xl text-center">
                  Points remaining: <span className="font-bold text-accent-400 text-3xl">{pointsRemaining}</span>
                </p>
                <div className="space-x-4">
                  <motion.button 
                    onClick={handleReset} 
                    className="p-3 bg-secondary-600 hover:bg-secondary-500 rounded-lg shadow-md transition-colors"
                    title="Reset Abilities"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaRedo className="text-xl" />
                  </motion.button>
                  <motion.button 
                    onClick={handleRandom} 
                    className="p-3 bg-accent-600 hover:bg-accent-500 rounded-lg shadow-md transition-colors"
                    title="Randomize Abilities"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaRandom className="text-xl" />
                  </motion.button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {abilityNames.map((ability) => (
                  <AbilityCard
                    key={ability}
                    ability={ability}
                    value={abilities[ability]}
                    onChange={handleChange}
                    suggestion={suggestions[ability]}
                    description={abilityDescriptions[ability]}
                    famousCharacter={famousCharacters[ability]}
                    racialBonus={racialBonuses[ability] || 0}
                  />
                ))}
              </div>
            </motion.div>
            <div className="flex justify-center">
              <GameButton
                onClick={handleSubmit}
                disabled={pointsRemaining !== 0}
                className="text-xl py-3 px-8"
              >
                Confirm Abilities
              </GameButton>
            </div>
          </div>
          <div className="lg:w-1/3">
            <CharacterPreview abilities={abilities} suggestions={suggestions} racialBonuses={racialBonuses} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}