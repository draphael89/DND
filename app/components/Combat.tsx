import React, { useState } from 'react';
import { Character, InventoryItem } from '../interfaces/gameInterfaces';
import GameButton from './GameButton';

interface Enemy {
  name: string;
  health: number;
  maxHealth: number;
  armorClass: number;
  attackBonus: number;
  damage: [number, number]; // [min, max]
}

interface CombatProps {
  enemy: Enemy;
  onCombatEnd: (playerWon: boolean) => void;
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
}

const Combat: React.FC<CombatProps> = ({ enemy, onCombatEnd, character, updateCharacter }) => {
  const [enemyHealth, setEnemyHealth] = useState(enemy.health);
  const [combatLog, setCombatLog] = useState<string[]>([]);

  const rollD20 = () => Math.floor(Math.random() * 20) + 1;

  const playerAttack = () => {
    const roll = rollD20();
    const attackRoll = roll + Math.floor((character.abilities.strength - 10) / 2);
    if (attackRoll >= enemy.armorClass) {
      const damage = Math.floor(Math.random() * 6) + 1 + Math.floor((character.abilities.strength - 10) / 2);
      setEnemyHealth((prev) => Math.max(prev - damage, 0));
      setCombatLog((prev) => [...prev, `You hit ${enemy.name} for ${damage} damage!`]);
      if (enemyHealth - damage <= 0) {
        onCombatEnd(true);
      }
    } else {
      setCombatLog((prev) => [...prev, `You missed ${enemy.name}!`]);
    }
    enemyAttack();
  };

  const enemyAttack = () => {
    const roll = rollD20();
    const attackRoll = roll + enemy.attackBonus;
    if (attackRoll >= 10 + Math.floor((character.abilities.dexterity - 10) / 2)) {
      const damage = Math.floor(Math.random() * (enemy.damage[1] - enemy.damage[0] + 1)) + enemy.damage[0];
      updateCharacter({ hitPoints: Math.max(character.hitPoints - damage, 0) });
      setCombatLog((prev) => [...prev, `${enemy.name} hits you for ${damage} damage!`]);
      if (character.hitPoints - damage <= 0) {
        onCombatEnd(false);
      }
    } else {
      setCombatLog((prev) => [...prev, `${enemy.name} missed you!`]);
    }
  };

  return (
    <div className="bg-gray-800 shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-bold text-accent-400 mb-4">Combat with {enemy.name}</h2>
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-gray-300">Your Health: {character.hitPoints}/{character.maxHitPoints}</p>
          <GameButton onClick={playerAttack} className="mt-2">
            Attack
          </GameButton>
        </div>
        <div>
          <p className="text-gray-300">{enemy.name}&apos;s Health: {enemyHealth}/{enemy.maxHealth}</p>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-bold text-accent-300">Combat Log:</h3>
        <ul className="list-disc list-inside text-gray-300">
          {combatLog.slice(-5).map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Combat;
