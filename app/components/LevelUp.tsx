import React, { useState } from 'react';
import { Character, AbilityScores } from '../interfaces/gameInterfaces';
import GameButton from './GameButton';

interface LevelUpProps {
  character: Character;
  onLevelUp: (updates: Partial<Character>) => void;
  onClose: () => void;
}

const LevelUp: React.FC<LevelUpProps> = ({ character, onLevelUp, onClose }) => {
  const [abilities, setAbilities] = useState<AbilityScores>(character.abilities);
  const [skillPoints, setSkillPoints] = useState(2);

  const handleAbilityIncrease = (ability: keyof AbilityScores) => {
    if (skillPoints > 0) {
      setAbilities(prev => ({ ...prev, [ability]: prev[ability] + 1 }));
      setSkillPoints(prev => prev - 1);
    }
  };

  const handleConfirm = () => {
    onLevelUp({
      level: character.level + 1,
      abilities,
      maxHitPoints: character.maxHitPoints + 5,
      hitPoints: character.maxHitPoints + 5,
      maxMana: character.maxMana + 3,
      mana: character.maxMana + 3,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full">
        <h2 className="text-2xl font-display text-accent-400 mb-4">Level Up!</h2>
        <p>You&apos;ve reached level {character.level + 1}!</p>
        <div className="mt-4">
          <h3 className="text-xl font-display text-accent-300 mb-2">Increase Abilities</h3>
          <p>Remaining points: {skillPoints}</p>
          {Object.entries(abilities).map(([ability, score]) => (
            <div key={ability} className="flex justify-between items-center mb-2">
              <span>{ability}: {score}</span>
              <GameButton
                onClick={() => handleAbilityIncrease(ability as keyof AbilityScores)}
                disabled={skillPoints === 0}
              >
                Increase
              </GameButton>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <GameButton onClick={handleConfirm}>Confirm Level Up</GameButton>
        </div>
      </div>
    </div>
  );
};

export default LevelUp;