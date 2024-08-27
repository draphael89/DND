'use client';

import { useState, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import GameButton from '../../components/GameButton';
import Image from 'next/image';
import { motion } from 'framer-motion';

const races = [
  {
    name: 'Human',
    description: 'Versatile and ambitious, humans are the most common race in many D&D worlds. They adapt quickly to changing situations and excel in various fields.',
    traits: ['Bonus feat', '+1 to all ability scores'],
    image: '/images/races/human.jpg'
  },
  {
    name: 'Elf',
    description: 'Graceful and long-lived, elves are known for their connection to nature and arcane magic. They possess keen senses and a natural affinity for the mystical.',
    traits: ['Darkvision', 'Keen Senses', 'Fey Ancestry'],
    image: '/images/races/elf.jpg'
  },
  {
    name: 'Dwarf',
    description: 'Stout and sturdy, dwarves are known for their craftsmanship and resilience. They have a strong connection to the earth and are natural miners and smiths.',
    traits: ['Darkvision', 'Dwarven Resilience', 'Stonecunning'],
    image: '/images/races/dwarf.jpg'
  },
  {
    name: 'Halfling',
    description: 'Small but brave, halflings are known for their luck and nimbleness. They are natural diplomats and have a knack for finding comfort even in the most challenging situations.',
    traits: ['Lucky', 'Brave', 'Halfling Nimbleness'],
    image: '/images/races/halfling.jpg'
  },
  {
    name: 'Dragonborn',
    description: 'Descended from dragons, dragonborn are proud and noble warriors. They possess a breath weapon and natural armor, making them formidable in combat.',
    traits: ['Breath Weapon', 'Damage Resistance', 'Draconic Ancestry'],
    image: '/images/races/dragonborn.jpg'
  }
];

export default function RaceSelection() {
  const { updateCharacter } = useCharacter();
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [hoveredRace, setHoveredRace] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.backgroundImage = "url('/images/fantasy-background.jpg')";
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';

    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundAttachment = '';
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-display text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 via-secondary-500 to-accent-400">
          Choose Your Race
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {races.map((race) => (
            <motion.div
              key={race.name}
              className={`bg-surface bg-opacity-80 backdrop-blur-md rounded-lg overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                selectedRace === race.name ? 'ring-4 ring-accent-500' : ''
              }`}
              onClick={() => setSelectedRace(race.name)}
              onMouseEnter={() => setHoveredRace(race.name)}
              onMouseLeave={() => setHoveredRace(null)}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48">
                <Image
                  src={race.image}
                  alt={race.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-opacity duration-300"
                  style={{ opacity: hoveredRace === race.name ? 0.7 : 1 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                <h2 className="absolute bottom-4 left-4 text-3xl font-display text-text-primary">{race.name}</h2>
              </div>
              <div className="p-4">
                <p className="text-text-secondary mb-4">{race.description}</p>
                <h3 className="font-display text-accent-400 mb-2">Racial Traits:</h3>
                <ul className="list-disc list-inside text-sm text-text-secondary">
                  {race.traits.map((trait, index) => (
                    <li key={index}>{trait}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <GameButton
            href="/character-creation/class"
            onClick={() => selectedRace && updateCharacter({ race: selectedRace })}
            disabled={!selectedRace}
            className="text-xl px-8 py-4"
          >
            Continue to Class Selection
          </GameButton>
        </div>
      </div>
    </motion.div>
  );
}