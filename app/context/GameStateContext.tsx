'use client';

import React, { createContext, useContext, useState } from 'react';
import { Character, InventoryItem, Quest } from '../interfaces/gameInterfaces';

interface GameState {
  character: Character;
  inventory: InventoryItem[];
  quests: Quest[];
  sceneHistory: string[];
  currentScene: string;
}

const GameStateContext = createContext<{
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
} | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    character: {} as Character,
    inventory: [],
    quests: [],
    sceneHistory: [],
    currentScene: '',
  });

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState((prevState) => ({ ...prevState, ...updates }));
  };

  return (
    <GameStateContext.Provider value={{ gameState, updateGameState }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};