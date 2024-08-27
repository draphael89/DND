'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Character {
  race: string;
  class: string;
  background: string;
  abilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
}

export interface CharacterContextType {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
  isCharacterComplete: boolean;
  setCharacterComplete: (complete: boolean) => void;
}

const defaultCharacter: Character = {
  race: '',
  class: '',
  background: '',
  abilities: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
};

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [character, setCharacter] = useState<Character>(defaultCharacter);
  const [isCharacterComplete, setIsCharacterComplete] = useState(false);

  const updateCharacter = (updates: Partial<Character>) => {
    setCharacter((prev) => ({ ...prev, ...updates }));
  };

  const setCharacterComplete = (complete: boolean) => {
    setIsCharacterComplete(complete);
  };

  return (
    <CharacterContext.Provider value={{ character, updateCharacter, isCharacterComplete, setCharacterComplete }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
}