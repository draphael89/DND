import React from 'react';
import { motion } from 'framer-motion';
import { Character } from '../interfaces/gameInterfaces';

interface CharacterSheetProps {
  character: Character;
  onClose: () => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-display text-accent-400">Character Sheet</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            Close
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-display text-accent-300 mb-2">Basic Info</h3>
            <p><span className="text-gray-400">Race:</span> {character.race}</p>
            <p><span className="text-gray-400">Class:</span> {character.class}</p>
            <p><span className="text-gray-400">Background:</span> {character.background}</p>
            <p><span className="text-gray-400">Level:</span> {character.level}</p>
            <p><span className="text-gray-400">Experience:</span> {character.experience}</p>
            <p><span className="text-gray-400">Hit Points:</span> {character.hitPoints}/{character.maxHitPoints}</p>
            <p><span className="text-gray-400">Mana:</span> {character.mana}/{character.maxMana}</p>
          </div>
          <div>
            <h3 className="text-xl font-display text-accent-300 mb-2">Abilities</h3>
            {Object.entries(character.abilities).map(([ability, score]) => (
              <p key={ability}>
                <span className="text-gray-400">{ability.charAt(0).toUpperCase() + ability.slice(1)}:</span> {score} (Modifier: {Math.floor((score - 10) / 2)})
              </p>
            ))}
          </div>
          <div>
            <h3 className="text-xl font-display text-accent-300 mb-2">Skills</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(character.skills).map(([skill, bonus]) => (
                <p key={skill}>
                  <span className="text-gray-400">{skill}:</span> +{bonus}
                </p>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-display text-accent-300 mb-2">Equipment</h3>
            <ul className="list-disc list-inside">
              {character.equipment.map((item, index) => (
                <li key={index} className="text-gray-300">{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-display text-accent-300 mb-2">Backstory</h3>
          <p className="text-gray-300">{character.backstory}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CharacterSheet;