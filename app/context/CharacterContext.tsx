'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Character, AbilityScores, InventoryItem, Quest } from '../interfaces/gameInterfaces';

type CharacterContextType = {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
  resetAbilities: () => void;
  setCharacterComplete: (complete: boolean) => void;
  addInventoryItem: (item: InventoryItem) => void;
  removeInventoryItem: (itemId: string) => void;
  addQuest: (quest: Quest) => void;
  updateQuest: (questId: string, updates: Partial<Quest>) => void;
};

const defaultAbilities: AbilityScores = {
  strength: 8,
  dexterity: 8,
  constitution: 8,
  intelligence: 8,
  wisdom: 8,
  charisma: 8,
};

const defaultCharacter: Character = {
  race: '',
  class: '',
  background: '',
  abilities: defaultAbilities,
  skills: {},
  equipment: [],
  inventory: [],
  quests: [],
  backstory: '',
  level: 1,
  experience: 0,
  hitPoints: 10,
  maxHitPoints: 10,
  mana: 0,
  maxMana: 0,
};

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [character, setCharacter] = useState<Character>(defaultCharacter);
  const [characterComplete, setCharacterComplete] = useState(false);

  const updateCharacter = (updates: Partial<Character>) => {
    setCharacter((prev) => ({ ...prev, ...updates }));
  };

  const resetAbilities = () => {
    setCharacter((prev) => ({
      ...prev,
      abilities: defaultAbilities,
    }));
  };

  const addInventoryItem = (item: InventoryItem) => {
    setCharacter((prev) => ({
      ...prev,
      inventory: [...prev.inventory, item],
    }));
  };

  const removeInventoryItem = (itemId: string) => {
    setCharacter((prev) => ({
      ...prev,
      inventory: prev.inventory.filter((item) => item.id !== itemId),
    }));
  };

  const addQuest = (quest: Quest) => {
    setCharacter((prev) => ({
      ...prev,
      quests: [...prev.quests, quest],
    }));
  };

  const updateQuest = (questId: string, updates: Partial<Quest>) => {
    setCharacter((prev) => ({
      ...prev,
      quests: prev.quests.map((quest) =>
        quest.id === questId ? { ...quest, ...updates } : quest
      ),
    }));
  };

  return (
    <CharacterContext.Provider
      value={{
        character,
        updateCharacter,
        resetAbilities,
        setCharacterComplete,
        addInventoryItem,
        removeInventoryItem,
        addQuest,
        updateQuest,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};