'use client';

import { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import GameButton from '../../components/GameButton';

const backgrounds = [
  {
    name: 'Acolyte',
    description: 'You have spent your life in service to a temple, learning sacred rites and providing sacrifices to the gods.',
    skills: ['Insight', 'Religion'],
    feature: 'Shelter of the Faithful'
  },
  {
    name: 'Criminal',
    description: 'You have a history of breaking the law and have spent time honing your skills in the criminal underworld.',
    skills: ['Deception', 'Stealth'],
    feature: 'Criminal Contact'
  },
  {
    name: 'Folk Hero',
    description: 'You come from a humble background, but you are destined for so much more. The common folk look to you as their champion.',
    skills: ['Animal Handling', 'Survival'],
    feature: 'Rustic Hospitality'
  },
  // Add more backgrounds as needed
];

export default function BackgroundSelection() {
  const { updateCharacter } = useCharacter();
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);

  return (
    <div>
      <h2 className="text-3xl font-display text-center mb-8">Choose Your Background</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {backgrounds.map((background) => (
          <div
            key={background.name}
            className={`bg-primary rounded-lg p-6 transition-all duration-300 cursor-pointer ${
              selectedBackground === background.name ? 'ring-2 ring-accent' : 'hover:shadow-card-hover'
            }`}
            onClick={() => setSelectedBackground(background.name)}
          >
            <h3 className="text-2xl font-display text-accent mb-2">{background.name}</h3>
            <p className="text-muted mb-4">{background.description}</p>
            <p><span className="font-display text-text">Skills:</span> {background.skills.join(', ')}</p>
            <p><span className="font-display text-text">Feature:</span> {background.feature}</p>
          </div>
        ))}
      </div>
      <GameButton
        href="/character-creation/summary"
        onClick={() => selectedBackground && updateCharacter({ background: selectedBackground })}
        disabled={!selectedBackground}
        className="mt-8"
      >
        Continue to Summary
      </GameButton>
    </div>
  );
}