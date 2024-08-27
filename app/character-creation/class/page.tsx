'use client';

import { useState, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import GameButton from '../../components/GameButton';
import Image from 'next/image';
import { motion } from 'framer-motion';

const classes = [
  {
    name: 'Fighter',
    description: 'Masters of martial combat, skilled with a variety of weapons and armor.',
    features: ['Second Wind', 'Action Surge', 'Martial Archetype'],
    image: '/images/classes/fighter.jpg'
  },
  {
    name: 'Wizard',
    description: 'Scholarly magic-users capable of manipulating the structures of reality.',
    features: ['Spellcasting', 'Arcane Recovery', 'Arcane Tradition'],
    image: '/images/classes/wizard.jpg'
  },
  {
    name: 'Rogue',
    description: 'Skilled tricksters and agile combatants, masters of stealth and precision.',
    features: ['Expertise', 'Sneak Attack', "Thieves' Cant"],
    image: '/images/classes/rogue.jpg'
  },
  {
    name: 'Cleric',
    description: 'Divine spellcasters who wield the power of their deity to heal and protect.',
    features: ['Spellcasting', 'Divine Domain', 'Channel Divinity'],
    image: '/images/classes/cleric.jpg'
  },
  {
    name: 'Ranger',
    description: 'Skilled hunters and trackers who blend martial prowess with nature magic.',
    features: ['Favored Enemy', 'Natural Explorer', 'Spellcasting'],
    image: '/images/classes/ranger.jpg'
  }
];

interface ClassSelectionProps {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export default function ClassSelection({ goToNextStep, goToPreviousStep }: ClassSelectionProps) {
  const { updateCharacter } = useCharacter();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.backgroundImage = "url('/images/class-selection-bg.jpg')";
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';

    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundAttachment = '';
    };
  }, []);

  const handleContinue = () => {
    if (selectedClass) {
      updateCharacter({ class: selectedClass });
      goToNextStep();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-display text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 via-secondary-500 to-accent-400">
          Choose Your Class
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((characterClass) => (
            <motion.div
              key={characterClass.name}
              className={`bg-surface bg-opacity-80 backdrop-blur-md rounded-lg overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                selectedClass === characterClass.name ? 'ring-4 ring-accent-500' : ''
              }`}
              onClick={() => setSelectedClass(characterClass.name)}
              onMouseEnter={() => setHoveredClass(characterClass.name)}
              onMouseLeave={() => setHoveredClass(null)}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48">
                <Image
                  src={characterClass.image}
                  alt={characterClass.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-opacity duration-300"
                  style={{ opacity: hoveredClass === characterClass.name ? 0.7 : 1 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                <h2 className="absolute bottom-4 left-4 text-3xl font-display text-text-primary">{characterClass.name}</h2>
              </div>
              <div className="p-4">
                <p className="text-text-secondary mb-4">{characterClass.description}</p>
                <h3 className="font-display text-accent-400 mb-2">Key Features:</h3>
                <ul className="list-disc list-inside text-sm text-text-secondary">
                  {characterClass.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 flex justify-between">
          <GameButton onClick={goToPreviousStep} className="text-xl px-8 py-4">
            Back to Race
          </GameButton>
          <GameButton
            onClick={handleContinue}
            disabled={!selectedClass}
            className="text-xl px-8 py-4"
          >
            Continue to Abilities
          </GameButton>
        </div>
      </div>
    </motion.div>
  );
}