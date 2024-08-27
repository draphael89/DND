export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Character {
  race: string;
  class: string;
  background: string;
  abilities: AbilityScores;
  skills: Record<string, number>;
  equipment: string[];
  inventory: InventoryItem[]; // Add this line
  quests: Quest[]; // Add this line
  backstory: string;
  level: number;
  experience: number;
  hitPoints: number;
  maxHitPoints: number;
  mana: number;
  maxMana: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'failed';
  rewards: {
    experience: number;
    gold: number;
    items?: string[];
  };
  objectives: {
    description: string;
    completed: boolean;
  }[];
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  type: 'weapon' | 'armor' | 'potion' | 'misc';
  effects?: string[];
}