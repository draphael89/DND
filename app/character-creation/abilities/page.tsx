'use client';

import { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import GameButton from '../../components/GameButton';

const abilityNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
const pointCosts = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

export default function AbilityScores() {
  const { character, updateCharacter } = useCharacter();
  const [abilities, setAbilities] = useState(character.abilities);
  const [pointsRemaining, setPointsRemaining] = useState(27);

  const handleChange = (ability: string, value: number) => {
    const oldValue = abilities[ability as keyof typeof abilities];
    const oldCost = pointCosts[oldValue as keyof typeof pointCosts] || 0;
    const newCost = pointCosts[value as keyof typeof pointCosts] || 0;
    const pointDifference = newCost - oldCost;

    if (pointsRemaining - pointDifference >= 0) {
      setAbilities(prev => ({ ...prev, [ability]: value }));
      setPointsRemaining(prev => prev - pointDifference);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-display text-center mb-8">Set Your Ability Scores</h2>
      <p className="text-muted text-center mb-6">Points remaining: {pointsRemaining}</p>
      <div className="grid grid-cols-2 gap-6">
        {abilityNames.map((ability) => (
          <div key={ability} className="bg-primary rounded-lg p-4">
            <label htmlFor={ability} className="block text-lg font-display text-accent mb-2">
              {ability.charAt(0).toUpperCase() + ability.slice(1)}
            </label>
            <select
              id={ability}
              value={abilities[ability as keyof typeof abilities]}
              onChange={(e) => handleChange(ability, parseInt(e.target.value))}
              className="w-full bg-secondary text-text rounded p-2"
            >
              {Object.keys(pointCosts).map((score) => (
                <option key={score} value={score}>{score}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <GameButton
        href="/character-creation/background"
        onClick={() => updateCharacter({ abilities })}
        disabled={pointsRemaining !== 0}
        className="mt-8"
      >
        Continue to Background
      </GameButton>
    </div>
  );
}