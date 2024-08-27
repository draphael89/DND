'use client';

import { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { motion } from 'framer-motion';
import GameButton from '../../components/GameButton';
import { FaDiceD20 } from 'react-icons/fa';

const abilityNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const;
type AbilityName = typeof abilityNames[number];

const pointCosts = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

export default function AbilitiesPage() {
  const { character, updateCharacter } = useCharacter();
  const [abilities, setAbilities] = useState(character.abilities);
  const [pointsRemaining, setPointsRemaining] = useState(27);

  const handleChange = (ability: AbilityName, value: number) => {
    const oldValue = abilities[ability];
    const oldCost = pointCosts[oldValue as keyof typeof pointCosts] || 0;
    const newCost = pointCosts[value as keyof typeof pointCosts] || 0;
    const pointDifference = newCost - oldCost;

    if (pointsRemaining - pointDifference >= 0) {
      setAbilities(prev => ({ ...prev, [ability]: value }));
      setPointsRemaining(prev => prev - pointDifference);
    }
  };

  const handleSubmit = () => {
    updateCharacter({ abilities });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-4xl font-display text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 via-secondary-500 to-accent-400">
        Set Your Ability Scores
      </h1>
      <div className="bg-primary-800/50 rounded-lg p-6 mb-6">
        <p className="text-xl text-center mb-4">Points remaining: <span className="font-bold text-accent-400">{pointsRemaining}</span></p>
        <div className="grid grid-cols-2 gap-6">
          {abilityNames.map((ability) => (
            <div key={ability} className="bg-surface/50 rounded-lg p-4">
              <label htmlFor={ability} className="block text-lg font-display text-accent-300 mb-2 capitalize">
                {ability}
              </label>
              <div className="flex items-center">
                <FaDiceD20 className="text-2xl text-accent-500 mr-2" />
                <select
                  id={ability}
                  value={abilities[ability]}
                  onChange={(e) => handleChange(ability, parseInt(e.target.value))}
                  className="w-full bg-primary-900/50 text-text-primary rounded p-2 border border-accent-500/30 focus:border-accent-400 focus:ring focus:ring-accent-400/50"
                >
                  {Object.keys(pointCosts).map((score) => (
                    <option key={score} value={score}>{score}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <GameButton
          onClick={handleSubmit}
          disabled={pointsRemaining !== 0}
          href="/character-creation/summary"
        >
          Confirm Abilities
        </GameButton>
      </div>
    </motion.div>
  );
}