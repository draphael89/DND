'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useCharacter } from '../context/CharacterContext';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaSuitcase, FaMapMarkedAlt, FaScroll } from 'react-icons/fa';

const GameButton = dynamic(() => import('./GameButton'));
const Combat = dynamic(() => import('./Combat'));
const StoryGenerator = dynamic(() => import('./StoryGenerator'));
const ImageGenerator = dynamic(() => import('./ImageGenerator'));

interface GameState {
  currentLocation: string;
  health: number;
  inventory: string[];
  questProgress: number;
}

interface Enemy {
  name: string;
  health: number;
  armorClass: number;
  attackBonus: number;
  damage: [number, number];
}

const enemies: Enemy[] = [
  { name: 'Goblin', health: 20, armorClass: 12, attackBonus: 2, damage: [1, 6] },
  { name: 'Orc', health: 30, armorClass: 13, attackBonus: 3, damage: [2, 8] },
  { name: 'Troll', health: 50, armorClass: 15, attackBonus: 5, damage: [3, 10] },
];

const ClientGame: React.FC = () => {
  const { character } = useCharacter();
  const [gameState, setGameState] = useState<GameState>({
    currentLocation: 'Village',
    health: 100,
    inventory: [],
    questProgress: 0,
  });

  const [currentScene, setCurrentScene] = useState<string>('');
  const [inCombat, setInCombat] = useState(false);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy>(enemies[0]);

  const generateScene = useCallback(async () => {
    if (!character.race || !character.class || !character.background) {
      return;
    }
    const newScene = `You find yourself in ${gameState.currentLocation}. 
    As a ${character.race} ${character.class}, you feel ${character.background === 'Folk Hero' ? 'a sense of purpose' : 'slightly out of place'}.
    What would you like to do?`;
    setCurrentScene(newScene);
  }, [gameState.currentLocation, character.race, character.class, character.background]);

  useEffect(() => {
    generateScene();
  }, [generateScene]);

  const handleAction = async (action: string) => {
    switch (action) {
      case 'explore':
        setGameState(prev => ({ ...prev, currentLocation: 'Forest' }));
        break;
      case 'rest':
        setGameState(prev => ({ ...prev, health: Math.min(prev.health + 10, 100) }));
        break;
      case 'fight':
        setInCombat(true);
        setCurrentEnemy(enemies[Math.floor(Math.random() * enemies.length)]);
        break;
    }
    if (action !== 'fight') {
      generateScene();
    }
  };

  const handleCombatEnd = (playerWon: boolean) => {
    setInCombat(false);
    if (playerWon) {
      setGameState(prev => ({ ...prev, questProgress: prev.questProgress + 1 }));
    } else {
      setGameState(prev => ({ ...prev, health: Math.max(prev.health - 20, 0) }));
    }
    generateScene();
  };

  if (!character) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-primary-900 to-primary-800 text-text-primary p-8"
    >
      <div className="max-w-4xl mx-auto bg-surface/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-accent-500/20">
        <h1 className="text-4xl font-display text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 via-secondary-500 to-accent-400">
          Your Adventure
        </h1>
        <div className="flex justify-between mb-6">
          <div className="flex items-center">
            <FaHeart className="text-accent-500 mr-2" />
            <span>Health: {gameState.health}</span>
          </div>
          <div className="flex items-center">
            <FaSuitcase className="text-accent-500 mr-2" />
            <span>Inventory: {gameState.inventory.length} items</span>
          </div>
          <div className="flex items-center">
            <FaMapMarkedAlt className="text-accent-500 mr-2" />
            <span>Location: {gameState.currentLocation}</span>
          </div>
          <div className="flex items-center">
            <FaScroll className="text-accent-500 mr-2" />
            <span>Quest Progress: {gameState.questProgress}</span>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {inCombat ? (
            <motion.div
              key="combat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Combat enemy={currentEnemy} onCombatEnd={handleCombatEnd} character={character} />
            </motion.div>
          ) : (
            <motion.div
              key="scene"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-primary-800/50 rounded-lg p-6 mb-6">
                <p className="mb-4 text-text-primary">{currentScene}</p>
                <div className="flex space-x-4">
                  <GameButton onClick={() => handleAction('explore')}>Explore</GameButton>
                  <GameButton onClick={() => handleAction('rest')}>Rest</GameButton>
                  <GameButton onClick={() => handleAction('fight')}>Fight</GameButton>
                </div>
              </div>
              <StoryGenerator />
              <ImageGenerator />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ClientGame;