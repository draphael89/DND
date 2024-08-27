'use client';

import { useCharacter } from '../../context/CharacterContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import GameButton from '../../components/GameButton';
import { FaUser, FaHatWizard, FaScroll, FaDiceD20 } from 'react-icons/fa';

export default function CharacterSummary() {
  const { character, setCharacterComplete } = useCharacter();
  const router = useRouter();

  const handleStartAdventure = () => {
    setCharacterComplete(true);
    router.push('/game');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-4xl font-display text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 via-secondary-500 to-accent-400">
        Character Summary
      </h1>
      <div className="bg-primary-800/50 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-display text-accent-400 mb-4">Your Character</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
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
        <h3 className="text-xl font-display text-accent-400 mt-6 mb-4">Ability Scores</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(character.abilities).map(([ability, score]) => (
            <div key={ability} className="text-center bg-surface/50 rounded-lg p-2">
              <p className="font-display text-text-secondary">{ability.charAt(0).toUpperCase() + ability.slice(1)}</p>
              <p className="text-2xl font-bold text-accent-400">{score}</p>
              <p className="text-sm text-text-secondary">(Modifier: {Math.floor((score - 10) / 2)})</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <GameButton onClick={handleStartAdventure}>
          Start Your Adventure
        </GameButton>
      </div>
    </motion.div>
  );
}