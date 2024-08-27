'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCharacter } from '../context/CharacterContext';
import GameButton from '../components/GameButton';
import Combat from '../components/Combat';

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
  damage: [number, number]; // This is now a tuple of two numbers
}

const enemies: Enemy[] = [
  { name: 'Goblin', health: 20, armorClass: 12, attackBonus: 2, damage: [1, 6] },
  { name: 'Orc', health: 30, armorClass: 13, attackBonus: 3, damage: [2, 8] },
  { name: 'Troll', health: 50, armorClass: 15, attackBonus: 5, damage: [3, 10] },
];

export default function Game() {
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

  return (
    <div className="min-h-screen bg-gradient-radial from-background to-surface p-8">
      <div className="max-w-4xl mx-auto bg-surface bg-opacity-30 backdrop-blur-md rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-display text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-secondary-500 mb-6">Your Adventure</h1>
        {inCombat ? (
          <Combat enemy={currentEnemy} onCombatEnd={handleCombatEnd} />
        ) : (
          <div className="bg-primary-800 bg-opacity-50 rounded-lg p-6 mb-6">
            <p className="mb-4 text-text-primary">{currentScene}</p>
            <div className="flex space-x-4">
              <GameButton onClick={() => handleAction('explore')}>Explore</GameButton>
              <GameButton onClick={() => handleAction('rest')}>Rest</GameButton>
              <GameButton onClick={() => handleAction('fight')}>Fight</GameButton>
            </div>
          </div>
        )}
        <div className="bg-primary-800 bg-opacity-50 rounded-lg p-6">
          <h2 className="text-2xl font-display text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500 mb-4">Character Status</h2>
          <div className="grid grid-cols-2 gap-4 text-text-primary">
            <p><span className="font-display text-secondary-300">Health:</span> {gameState.health}</p>
            <p><span className="font-display text-secondary-300">Location:</span> {gameState.currentLocation}</p>
            <p><span className="font-display text-secondary-300">Inventory:</span> {gameState.inventory.join(', ') || 'Empty'}</p>
            <p><span className="font-display text-secondary-300">Quest Progress:</span> {gameState.questProgress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}