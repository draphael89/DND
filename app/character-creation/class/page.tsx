'use client';

import { useState, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import Image from 'next/image';
import { motion } from 'framer-motion';
import GameButton from '../../components/GameButton';
import { FaShieldAlt, FaHatWizard, FaSkull, FaPray, FaLeaf } from 'react-icons/fa';

const classes = [
  {
    name: 'Warrior',
    description: 'Masters of martial combat, skilled with a variety of weapons and armor.',
    features: ['Second Wind', 'Action Surge', 'Martial Archetype'],
    icon: FaShieldAlt,
    imageName: 'warrior'
  },
  {
    name: 'Wizard',
    description: 'Scholarly magic-users capable of manipulating the structures of reality.',
    features: ['Arcane Recovery', 'Spellcasting', 'Arcane Tradition'],
    icon: FaHatWizard,
    imageName: 'wizard'
  },
  {
    name: 'Rogue',
    description: 'Skilled tricksters and agile combatants who prefer stealth and cunning.',
    features: ['Sneak Attack', 'Cunning Action', 'Roguish Archetype'],
    icon: FaSkull,
    imageName: 'rogue'
  },
  {
    name: 'Cleric',
    description: 'Divine agents who wield the power of the gods and lead through inspiration.',
    features: ['Divine Domain', 'Channel Divinity', 'Turn Undead'],
    icon: FaPray,
    imageName: 'cleric'
  },
  {
    name: 'Ranger',
    description: 'Skilled hunters and trackers who specialize in wilderness survival.',
    features: ['Favored Enemy', 'Natural Explorer', 'Ranger Archetype'],
    icon: FaLeaf,
    imageName: 'ranger'
  }
];

export default function ClassSelection() {
  const { character, updateCharacter } = useCharacter();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [classImages, setClassImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadImages = async () => {
      const images: Record<string, string> = {};
      for (const characterClass of classes) {
        let imageName = characterClass.imageName;
        if (character.race.toLowerCase() === 'halfling' && imageName === 'cleric') {
          imageName = 'priest';
        }
        const imagePath = `/images/classes/${character.race.toLowerCase()}/${imageName}.png`;
        
        console.log(`Attempting to load image: ${imagePath}`);
        console.log(`Character race: ${character.race}, Class name: ${characterClass.name}, Image name: ${imageName}`);

        try {
          const res = await fetch(imagePath);
          if (res.ok) {
            images[characterClass.name] = imagePath;
            console.log(`Successfully loaded image: ${imagePath}`);
          } else {
            throw new Error(`Image not found: ${imagePath}`);
          }
        } catch (error) {
          console.warn(`Image not found: ${imagePath}, using default`);
          images[characterClass.name] = '/images/classes/default.png';
        }
      }
      console.log('Final classImages object:', images);
      setClassImages(images);
    };

    if (character.race) {
      loadImages();
    }
  }, [character.race, classes]);

  const handleClassSelect = (className: string) => {
    setSelectedClass(className);
    updateCharacter({ class: className });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-display text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 via-secondary-500 to-accent-400">
        Choose Your Class
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((characterClass, index) => (
          <motion.div
            key={characterClass.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-primary-800/50 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-105 ${
              selectedClass === characterClass.name ? 'ring-2 ring-accent-500' : ''
            }`}
            onClick={() => handleClassSelect(characterClass.name)}
          >
            <div className="relative h-48">
              <Image
                src={classImages[characterClass.name] || '/images/classes/default.png'}
                alt={characterClass.name}
                fill
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/images/classes/default.png';
                  console.log(`Error loading image, fallback to default: ${target.src}`);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900 to-transparent" />
              <h2 className="absolute bottom-4 left-4 text-2xl font-display text-text-primary flex items-center">
                <characterClass.icon className="mr-2" />
                {characterClass.name}
              </h2>
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
      <div className="mt-8 flex justify-center">
        <GameButton 
          href="/character-creation/background" 
          disabled={!selectedClass}
        >
          Continue to Background Selection
        </GameButton>
      </div>
    </motion.div>
  );
}