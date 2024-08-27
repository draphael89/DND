'use client';

import { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { motion } from 'framer-motion';
import GameButton from '../../components/GameButton';
import { FaPray, FaMask, FaUsers } from 'react-icons/fa';

const backgrounds = [
  {
    name: 'Acolyte',
    description: 'You have spent your life in service to a temple, learning sacred rites and providing sacrifices to the gods.',
    skills: ['Insight', 'Religion'],
    feature: 'Shelter of the Faithful',
    icon: FaPray
  },
  {
    name: 'Criminal',
    description: 'You have a history of breaking the law and have spent time honing your skills in the criminal underworld.',
    skills: ['Deception', 'Stealth'],
    feature: 'Criminal Contact',
    icon: FaMask
  },
  {
    name: 'Folk Hero',
    description: 'You come from a humble background, but you are destined for so much more. The common folk look to you as their champion.',
    skills: ['Animal Handling', 'Survival'],
    feature: 'Rustic Hospitality',
    icon: FaUsers
  },
];

export default function BackgroundSelection() {
  const { updateCharacter } = useCharacter();
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);

  const handleBackgroundSelect = (backgroundName: string) => {
    setSelectedBackground(backgroundName);
    updateCharacter({ background: backgroundName });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-display text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 via-secondary-500 to-accent-400">
        Choose Your Background
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {backgrounds.map((background, index) => (
          <motion.div
            key={background.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-primary-800/50 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-105 ${
              selectedBackground === background.name ? 'ring-2 ring-accent-500' : ''
            }`}
            onClick={() => handleBackgroundSelect(background.name)}
          >
            <div className="p-6">
              <h2 className="text-2xl font-display text-accent-400 mb-4 flex items-center">
                <background.icon className="mr-2" />
                {background.name}
              </h2>
              <p className="text-text-secondary mb-4">{background.description}</p>
              <h3 className="font-display text-accent-300 mb-2">Skills:</h3>
              <ul className="list-disc list-inside text-sm text-text-secondary mb-4">
                {background.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
              <h3 className="font-display text-accent-300 mb-2">Feature:</h3>
              <p className="text-sm text-text-secondary">{background.feature}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <GameButton 
          href="/character-creation/abilities" 
          disabled={!selectedBackground}
        >
          Continue to Ability Scores
        </GameButton>
      </div>
    </motion.div>
  );
}