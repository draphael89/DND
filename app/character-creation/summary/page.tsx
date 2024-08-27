'use client';

import { useCharacter } from '../../context/CharacterContext';
import GameButton from '../../components/GameButton';

export default function CharacterSummary() {
  const { character } = useCharacter();

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-display text-center text-accent mb-8">Character Summary</h2>
      <div className="bg-primary rounded-lg p-6 mb-6">
        <h3 className="text-2xl font-display text-accent mb-4">Your Character</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <p><span className="font-display text-text">Race:</span> {character.race}</p>
          <p><span className="font-display text-text">Class:</span> {character.class}</p>
          <p><span className="font-display text-text">Background:</span> {character.background}</p>
        </div>
        <h4 className="text-xl font-display text-accent mt-6 mb-4">Ability Scores</h4>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(character.abilities).map(([ability, score]) => (
            <div key={ability} className="text-center bg-secondary rounded-lg p-2">
              <p className="font-display text-text">{ability.charAt(0).toUpperCase() + ability.slice(1)}</p>
              <p className="text-2xl font-bold">{score}</p>
              <p className="text-sm text-muted">(Modifier: {Math.floor((score - 10) / 2)})</p>
            </div>
          ))}
        </div>
      </div>
      <GameButton href="/game" className="w-full">
        Start Your Adventure
      </GameButton>
    </div>
  );
}